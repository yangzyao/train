/**
 * 成绩模块
 */

var getData = require('../models/dbsql');                   //通用sql查询
var getRecordData = require('../models/recordSql');             //定制sql查询
var currency = require('../controllers/currencyRoute');
var tools = require("../models/tools");
var ejsExcel = require("ejsexcel");
var xlsx = require('node-xlsx');
var async = require("async");
var fs = require("fs");

/************************************成绩管理 start *************************************************/
/**
 * 成绩录入前查询二级科目和一级单位
 * @param req
 * @param res
 * @param next
 */
exports.get_subject = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        var c_filed = ["id","second_subject"];
        var rid = 1;
        var a_filed=["id","name"];
        getData.select_data("t_user",a_filed,"rid",rid,null,null,function (err,result) {
            if(err ==0){
                getData.select_data("t_subject",c_filed,null,null,"is_valid",1,function (err,data){
                    if(data){
                        console.log(data);
                        return res.render('', {'title':'','first_class': result,"subject":data});
                    }else {
                        return res.json({"code":100,"msg":"查询科目表失败"});
                    }
                })
            }else{
                return res.end(JSON.stringify({'code':200, 'msg': "查询失败"}));
            }
        })
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
};
/**
 * 根据一级单位ID查询二级单位
 * @param req
 * @param res
 * @param next
 */
exports.get_second_class = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        var rid = req.query.id?req.body.id:"";
        if(id ==""){
            res.redirect('back');
            return;
        }
        var a_filed=["id","name"];
        getData.select_data("t_user",a_filed,"rid",rid,null,null,function (err,result) {
            if(err ==0){
                return res.end({'code':0,'second_class': result});
            }else{
                return res.end(JSON.stringify({'code':200, 'msg': "查询失败"}));
            }
        })
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}

/**
 * 根据一级单位和二级单位查学员
 * @param req
 * @param res
 * @param next
 */
exports.get_person = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        var body =req.query;
        var unit_first = body.unit_first,
            unit_second = body.unit_second;
        var a_filed=["name","card_id"];
        getData.select_data("t_user",a_filed,"unit_first",unit_first,"unit_second",unit_second,function (err,result) {
            if(err ==0){
                // req.session.user_info =result;
                return res.end({'code':0,'users': result});
            }else{
                return res.end(JSON.stringify({'code':200, 'msg': "查询失败"}));
            }
        })
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}

/**
 * 跳到成绩录入页面
 * @param req
 * @param res
 * @param next
 */
exports.get_subjectHtml = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        var body =req.body;
        var unit_first =body.unit_first;
        var unit_second = body.unit_second;
        var check_time =body.check_time;
        var second_class =body.second_class;
        var filed={
            unit_first:unit_first,
            unit_second:unit_second,
            check_time:check_time,
            second_class:second_class
        };
        getRecordData.select_user(filed,function (err,data) {
            if(err ==0){
                if(data ==""){
                    var filed=["name","card_id"];
                    getData.select_data("t_person",filed,"unit_first",unit_first,"unit_second",unit_second,function (err,result) {
                        if(err ==0){
                            getData.select_data("t_subject","id","second_class",second_class,null,null,function (err,datas) {
                                if(err ==0){
                                    getData.select_data("t_assessment",null,"subject_id",datas[0],null,null,function (err,list) {
                                        if(err ==0){
                                            return res.render('', {'title':'','users': result,"assessment":list});
                                        }else{
                                            return res.end(JSON.stringify({'code':50, 'msg': "查询失败"}));
                                        }
                                    })
                                }else{
                                    return res.end(JSON.stringify({'code':80, 'msg': "查询失败"}));
                                }
                            })
                        }else{
                            return res.end(JSON.stringify({'code':100, 'msg': "查询失败"}));
                        }
                    })
                }else {
                    return res.json({"code":210,"msg":"已经存在同一人同一日期考核"});
                }
            }else{
                return res.end(JSON.stringify({'code':220, 'msg': "查询失败"}));
            }

        })
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}
/**
 * 成绩录入
 * @param req
 * @param res
 * @param next
 */
exports.add_record = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        //console.log(req.body);
        var query = req.body;
        var second_subject = req.body.second_subject;
        var dataArr = query.dataArr;
        var datafiled=[];

        for(var i=0,l=dataArr.length;i<l;i++){
            var dataBrr =[];
            var dataCrr =[];
            for(var name in dataArr[i]){
                dataBrr.push(name);
                dataCrr.push(dataArr[i][name]);
            }
            datafiled.push(dataCrr);
        }
        //console.log(dataBrr);
        //console.log(datafiled);
        getData.insert_batch("t_record",dataBrr,datafiled,function (err,data) {                        //插入成绩表
            if(err ==0){
                // getData.select_data("t_record","second_class",null,null,null,null,function (err,subject) {      //查询二级科目
                //     if(err ==0){
                //         var dataGrr=[];
                //         for(var i =0,len=subject.length;i<len;i++){
                //             //console.log("第"+i+"次");
                //             //console.log(subject[i].second_class);
                //             if(dataGrr.indexOf(subject[i].second_class) ==-1){
                //                 dataGrr.push(subject[i].second_class);
                //             }
                //         }
                //         //console.log("%%%%%%%"+dataGrr);
                //         tools.getDatas(dataGrr,function (err,arr) {
                //             console.log("*********");
                //             //console.log(err);
                //             console.log(arr);
                //         //     getData.select_cloumn(arr[0].cloumn, function (err, exist) {
                //         //     if (err == 0) {
                //         //
                //         //     } else {
                //         //
                //         //     }
                //         // })
                //     })
                //         // for(var a=0,l =dataGrr.length;a<l;a++){
                //         //     var filed =["second_subject","cloumn","cloumns"];
                //         //     getData.select_data("t_subject",filed,"second_subject",dataGrr[a],null,null,function (err,kid) {
                //         //         if(err ==0){
                //         //             dataFiled.push(kid);
                //         //             getData.select_cloumn(kid[0].cloumn,function (err,exist) {
                //         //                 if(err==0){
                //         //
                //         //                 }else{
                //         //
                //         //                 }
                //         //             })
                //         //         }else{
                //         //             return res.end(JSON.stringify({'code':120, 'msg': "查询失败"}));
                //         //         }
                //         //     })
                //         // }
                //     }else{
                //         return res.end(JSON.stringify({'code':120, 'msg': "查询失败"}));
                //     }
                // })
                return res.json({"code":0,"msg":"成绩录入成功"});
            }else{
                return res.json({"code":200,"msg":"成绩录入失败"});
            }
        })
    //     var second_class = query.second_class;
    //     var check_time =query.check_time;
    //     var queryData = ["id","name","card_id"];
    //     var fileArr=["id","uid","second_class","name","card_id","check_time"];
    //     var page=0,
    //         num=15;
    //     var abc = ["second_class"];
    //     var bcd = [second_class];
    //     getData.select_data("t_person",queryData,null,null,"is_valid",1,function (err,data) {
    //         //console.log(err);
    //         if(data){
    //             var dataArr = [];
    //             for(var i=0;i<data.length;i++){
    //                 var a = [0,data[i].id,second_class,data[i].name,data[i].card_id,check_time];
    //                 dataArr.push(a);
    //             }
    //             getData.insert_batch("t_record",fileArr,dataArr,function (err,result) {
    //                 //console.log(err);
    //                 if(result){
    //                     getData.select_data_orderby("t_record",null,abc,bcd,null,null,page,num,function (err,datas) {
    //                         //console.log(err);
    //                         if(datas){
    //                             //console.log(datas);
    //                             return res.json({"code":0,"msg":"查询成绩记录成功","data":datas});
    //                         }else {
    //                             return res.json({"code":300,"msg":"查询成绩记录失败"});
    //                         }
    //                     })
    //                 }
    //             })
    //         }else{
    //             return res.json({"code":100,"msg":"人员表查询失败"});
    //         }
    //     })
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // // }else{
    // //     return res.redirect('/');
    // // }
}

/**
 * 编辑成绩前查询相关成绩标准
 * @param req
 * @param res
 * @param next
 */
exports.get_assessment = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        var id = req.query.id;
        if(!id){
            res.redirect('back');
            return;
        }
        getData.select_data("t_record","second_class","id",id,null,null,function (err,result) {
            if(result){
                getData.select_data("t_assessment",null,"subject_id",result[0].second_class,"is_valid",1,function (err,data) {
                    if(data){
                        //console.log(data);
                        return res.render('',{"code":0,"data":data});
                    }else{
                        return res.json({"code":100,"msg":"查询考核标准失败"});
                    }
                })
            }else{
                return res.json({"code":200,"msg":"查询成绩记录表失败"});
            }
        })
    }catch (e){
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}

/**
 * 编辑成绩
 * @param req
 * @param res
 * @param next
 */
exports.update_record = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try {
        var id = query.id;
        var fileArr = Object.keys(query.data);
        var dataArr = [];
        for(var i in query.data){
            dataArr.push(query.data[i]);
        }
        if(!id){
            res.redirect('back');
            return;
        }
        getData.data_add_modify("t_record",fileArr,dataArr,"id",id,function (err,data) {
            if(data){
                return res.json({"code":0,"msg":"编辑成功"});
            }else {
                return res.json({"code":200,"msg":"编辑失败"});
            }
        })
    }catch (e){
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}

/**
 * 成绩导出
 * @param req
 * @param res
 * @param next
 */
exports.record_export = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var s=[];
    var num=0;              //考核次数
    var names=[],
        p_nums=[],
        p_num=0;            //参加人数
    var subjs=[],
        sub_nums=[],
        sub_num=0;          //科目数
    var examination=[],
        exam_num=0;         //补考人数
    var ach=[],
        achievement=[],     //成绩评定为数字
        achievements=[],    //成绩评定为汉字
        passes=[],          //及格
        goods=[],           //良好
        excell=[];          //优秀
    var unps=[],           //不及格
        ps=[],             //及格
        fine=[];           //良好
        try {
            var exlBuf = fs.readFileSync("../public/template/record.xlsx");
            async.parallel([
                function (cb) {
                    getData.select_data("t_record",null,null,null,null,null,function (err,datas) {
                        cb(err,datas);
                    })
                }
            ],function (err,result) {
                for(var a=0;a<result[0].length;a++){
                    s.push(result[0][a]);
                    names.push(result[0][a].name);
                    subjs.push(result[0][a].second_class);
                    if(result[0][a].examination != ""){
                        examination.push(result[0][a].examination);
                    }
                    ach.push(result[0][a].evaluation);
                }
                //考核人次
                num=s.length;
                //补考人数
                exam_num=examination.length;
                //参加人数
                for(var a=0;a<names.length;a++){
                    if(p_nums.indexOf(names[a]) == -1){
                        p_nums.push(names[a]);
                    }
                }
                p_num=p_nums.length;
                //科目数
                for(var b=0;b<subjs.length;b++){
                    if(sub_nums.indexOf(subjs[b]) == -1){
                        sub_nums.push(subjs[b]);
                    }
                }
                sub_num=sub_nums.length;
                for(var c=0;c<ach.length;c++){
                    if(!isNaN(parseInt(ach[c]))){
                        achievements.push(ach[c]);
                    }else{
                        achievement.push(ach[c]);
                    }
                }
                for(var d=0;d<achievements.length;d++){
                    if(Number(achievements[d]) >= 60){
                        passes.push(achievements[d]);
                    }else{
                        unps.push(achievements[d]);
                    }
                    if(Number(achievements[d]) >= 75){
                        goods.push(achievements[d]);
                    }else if(Number(achievements[d]) >= 60){
                        ps.push(achievements[d]);
                    }
                    if(Number(achievements[d]) >= 90){
                        excell.push(achievements[d]);
                    }else if(Number(achievements[d]) >= 75){
                        fine.push(achievements[d]);
                    }
                }
                for(var e=0;e<achievement.length;e++){
                    if(achievement[e] == "合格" || achievement[e] == "良好" || achievement[e] == "优秀"){
                        passes.push(achievement[e]);
                    }else{
                        unps.push(achievement[e]);
                    }
                    if(achievement[e] == "合格"){
                        ps.push(achievement[e]);
                    }
                    if(achievement[e] == "良好"){
                        goods.push(achievement[e]);
                        fine.push(achievement[e]);
                    }
                    if(achievement[e] == "优秀"){
                        excell.push(achievement[e]);
                    }
                }
                //合格率
                var pass = (Math.round(Number(passes.length/num)*10000)/100).toFixed(1)+"%";
                //优良率
                var good = (Math.round(Number((goods.length+excell.length)/num)*10000)/100).toFixed(1)+"%";
                //优秀率
                var excellent = (Math.round(Number(excell.length/num)*10000)/100).toFixed(1)+"%";
                var data=[[{"name":"xx旅团成绩记录表","record":"【成绩统计】 考核人次"+Number(num)+", 参加人数"+Number(p_num)+
                            ", 科目数"+Number(sub_num)+", 合格率"+pass+", 优良率"+good+", 优秀率"+excellent+
                            "  【成绩分布】 <60分(不及格)"+Number(unps.length)+", 60~75分(及格)"+Number(ps.length)+
                            ", 75~90分(良好)"+Number(fine.length)+", >=90分(优秀)"+Number(excell.length)+"  【补考人数】"+Number(exam_num)}]];
                data.push(s);
                var date="";
                currency.getTime(function (err,dates) {
                    if(err == 0){
                        date = dates;
                    }
                });
                var fileName = "xx旅团成绩记录表_"+date;
                ejsExcel.renderExcel(exlBuf,data).then(function (exlBuf2) {
                    res.setHeader('Content-Type','application/vnd.openxmlformats');
                    res.setHeader('Content-Disposition','attachment;filename='+encodeURI(fileName)+'.xlsx');
                    res.write(exlBuf2,'binary');
                    res.end();
                });
            });
        }catch (e){
            return res.json({"code":300,"msg":"unknow error"});
        }
    // }else{
    //     return res.redirect('/');
    // }
}

/**
 * 成绩导入
 * @param req
 * @param res
 */
exports.record_import =function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        currency.upload(req,res,function (err,re) {
            if(err == 0){
                var obj = xlsx.parse(re);
                //删除上传后文件
                fs.unlinkSync(re);
                var dataArr = [];
                var data = [];
                var c_filed=["unit_first","unit_second","name","card_id","second_class","achievement","evaluation",
                    "check_time","examination","coach","staff"];
                for(var i in obj[0].data){
                    dataArr.push(obj[0].data[i]);
                }
                for(var j=2;j<dataArr.length;j++){
                    data.push(dataArr[j]);
                }
                var filed = ["card_id","second_class","check_time"];
                getData.select_data("t_record",filed,null,null,null,null,function (err,datas) {
                    if(datas){
                        for(var i=0;i<datas.length;i++){
                            for(var j=0;j<data.length;j++){
                                if(data[j][3] == datas[i].card_id && data[j][4] == datas[i].second_class && data[j][7] == datas[i].check_time){
                                    //从data中第j的位置删除1个元素
                                    data.splice(j,1);
                                    j=j-1;
                                    //dataArr.push(data);
                                }
                            }
                        }
                        //console.log(data);
                        if(data.length > 0){
                            //将空的数据置为''
                            for(var k=0;k<data.length;k++){
                                for(var a=0;a<11;a++){
                                    if(data[k].length <= 11){
                                        if(!data[k][10]){
                                            data[k][10] = '';
                                        }
                                        if(!data[k][a]){
                                            data[k][a] = '';
                                        }
                                    }
                                }
                            }
                            getData.insert_batch("t_record",c_filed,data,function (err,result) {
                                if(result){
                                    return res.json({"code":0,"msg":"导入成功"});
                                }else{
                                    console.log(err);
                                    return res.json({"code":100,"msg":"导入失败"});
                                }
                            })
                        }else{
                            return res.json({"code":200,"msg":"已存在相同数据，不能重复导入"});
                        }
                    }
                })
            }
        })
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}

/**
 * 成绩导入模板下载
 * @param req
 * @param res
 * @param next
 */
exports.record_download = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        var exlBuf = fs.readFileSync("../public/download/模板_成绩.xlsx");
        var fileName = "成绩导入模板";
        res.setHeader('Content-Type','application/vnd.openxmlformats');
        res.setHeader('Content-Disposition','attachment;filename='+encodeURI(fileName)+'.xlsx');
        res.write(exlBuf,'binary');
        res.end();
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}

/************************************成绩管理 end ***************************************************/


