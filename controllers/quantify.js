/**
 * 量化模块
 */

var getData = require('../models/dbsql');                   //通用sql查询
var getQuantifyData = require('../models/quantifySql');       //定制sql查询
var ejsExcel = require('ejsexcel');
var fs = require('fs');
var xlsx = require('node-xlsx');

/************************************量化管理 start *************************************************/

/**
 * 量化考评录入前加载一级单位
 * @param req
 * @param res
 * @param next
 */
exports.get_unit_first = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        var id = 1;
        //var id = req.session.user.id;
        getData.select_data("t_user","name","rid",id,null,null,function (err,data) {
            if(data){
                console.log(data);
                return res.json({"code":0,"msg":"查询成功","data":data});
            }else{
                return res.json({"code":200,"msg":"查询失败"});
            }
        })
    }catch(e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 根据一级单位加载相关人员
 * @param req
 * @param res
 * @param next
 */
exports.get_person = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try{
        var unit_first = query.unit_first;
        var name = query.name;
        getQuantifyData.select_quantifyData("t_person",null,"unit_first",unit_first,"name",name,"is_valid",1,function (err,data) {
            if(data){
                return res.json({"code":0,"data":data});
                //console.log(JSON.stringify(data));
            }else {
                return res.json({"code":200,"msg":"查询人员失败"});
            }
        })
    }catch(e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 根据人员类型加载一级项目
 * @param req
 * @param res
 * @param next
 */
exports.get_first_proj = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try{
        var person_type = query.person_type;
        getData.select_data("t_quantifyStandard","first_proj","person_type",person_type,null,null,function (err,data) {
            if(data){
                var d = [];
                for(var i=0;i<data.length;i++){
                    if(d.indexOf(data[i]) == -1){
                        d.push(data[i]);
                    }
                }
                return res.json({"code":0,"data":JSON.stringify(d)});
            }else{
                return res.json({"code":200,"msg":"查询一级项目失败"});
            }
        })
    }catch(e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 根据人员类型,一级项目加载二级项目
 * @param req
 * @param res
 * @param next
 */
exports.get_second_proj = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try{
        var person_type = query.person_type;
        var first_proj = query.first_proj;
        getData.select_data("t_quantifyStandard","second_proj","person_type",person_type,"first_proj",first_proj,function (err,data) {
            if(data){
                var d = [];
                for(var i=0;i<data.length;i++){
                    if(d.indexOf(data[i]) == -1){
                        d.push(data[i]);
                    }
                }
                //console.log(JSON.stringify(d));
                return res.json({"code":0,"msg":"查询二级项目成功","data":JSON.stringify(d)});
            }else{
                return res.json({"code":200,"msg":"查询二级项目失败"});
            }
        })
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 根据人员类型,二级项目加载情况说明与得分
 * @param req
 * @param res
 * @param next
 */
exports.get_description = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try{
        var person_type = query.person_type;
        var second_proj = query.second_proj;
        var c_filed = ["description","fraction"];
        getData.select_data("t_quantifyStandard",c_filed,"person_type",person_type,"second_proj",second_proj,function (err,data) {
            if(data){
                console.log(JSON.stringify(data));
                return res.json({"code":0,"msg":"查询成功","data":data});
            }else{
                return res.json({"code":200,"msg":"查询失败"});
            }
        })
    }catch(e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 量化录入
 * @param req
 * @param res
 * @param next
 */
exports.add_quantify = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try{
        var fileArr = Object.keys(query.data);
        var dataArr = [];
        for(var i in query.data){
            dataArr.push(query.data[i]);
        }
        getData.data_add_modify("t_inputQuantify",fileArr,dataArr,null,null,function (err,data) {
            if(data){
                return res.json({"code":0,"msg":"保存成功"});
            }else {
                return res.json({"code":200,"msg":"保存失败"});
            }
        })
    }catch(e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{\\\
    //     res.redirect('/');
    // }
}

/**
 * 量化记录导出
 * @param req
 * @param res
 * @param next
 */
exports.quantify_export = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var s=[];
    var names=[];
    var first_projs=[];
    var name=[];
    var first_proj=[];
    var scores=[];
    var score=0;
    var de_score=0;
    try{
        var exlBuf = fs.readFileSync("../public/template/quantify.xlsx");
        getData.select_data("t_inputQuantify",null,null,null,null,null,function (err,datas) {
            //console.log(err);
            if(datas){
                for(var i=0;i<datas.length;i++){
                    s.push(datas[i]);
                    names.push(datas[i].name);
                    first_projs.push(datas[i].first_proj);
                    scores.push(datas[i].fraction);
                }
                for(var j=0;j<names.length;j++){
                    if(name.indexOf(names[j]) == -1){
                        name.push(names[j]);
                    }
                }
                for(var k=0;k<first_projs.length;k++){
                    if(first_proj.indexOf(first_projs[k]) == -1){
                        first_proj.push(first_projs[k]);
                    }
                }
                for(var l=0;l<scores.length;l++){
                    if(Number(scores[l]) > 0){
                        score += scores[l];
                    }else if(Number(scores[l]) < 0){
                        de_score +=scores[l];
                    }
                }
                var data = [[{"name":"xx旅团量化记录表","record":"【量化记录统计】考评次数："+datas.length+"  考评人数："+name.length+"  考评项目数："+first_proj.length+" 考评总加分：+"+score+" 考评总扣分："+de_score+""}]];
                data.push(s);
                //console.log(data);
                ejsExcel.renderExcel(exlBuf,data).then(function (exlBuf2) {
                    res.setHeader('Content-Type','application/vnd.openxmlformats');
                    res.setHeader('Content-Disposition','attachment;filename=quantify.xlsx');
                    res.write(exlBuf2,'binary');
                    res.end();
                });
                //return res.json({"code":0,"msg":"导出成功"});
            }else {
                return res.json({"code":200,"msg":"导出失败"});
            }
        });
    }catch(e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 *量化标准导出
 * @param req
 * @param res
 * @param next
 */
exports.Qstandard_export =function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var data=[];
    try{
        var exlBuf = fs.readFileSync("../public/template/quantifyStandard.xlsx");
        getData.select_data("t_quantifyStandard",null,null,null,null,null,function (err,datas) {
            //console.log(err);
            if(datas){
                for(var i=0;i<datas.length;i++){
                    data.push(datas[i]);
                }
                //console.log(data);
                var fileName="量化标准";
                ejsExcel.renderExcel(exlBuf,data).then(function (exlBuf2) {
                    res.setHeader('Content-Type','application/vnd.openxmlformats');
                    res.setHeader('Content-Disposition','attachment;filename='+encodeURI(fileName)+'.xlsx');
                    res.write(exlBuf2,'binary');
                    res.end();
                });
                // res.json({"code":0,"msg":"导出成功"});
            }else {
                return res.json({"code":200,"msg":"导出失败"});
            }
        })
    }catch(e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}

/**
 * 量化标准导入
 * @param req
 * @param res
 * @param next
 */
exports.Qstandard_import = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        currency.upload(req,res,function (err,path) {
            if(err == 0){
                var obj = xlsx.parse(path);
                //var fileArr = Object.keys(obj[0].data);
                //删除上传后文件
                //fs.unlinkSync(re);
                var dataArr = [];
                var data = [];
                var c_filed=["person_type","first_proj","second_proj","description","fraction"];
                for(var i in obj[0].data){
                    dataArr.push(obj[0].data[i]);
                }
                for(var j=2;j<dataArr.length-1;j++){
                    data.push(dataArr[j]);
                }
                //将空的数据置为''
                for(var k=0;k<data.length;k++){
                    for(var a=0;a<5;a++){
                        if(data[k].length <= 5){
                            if(!data[k][4]){
                                data[k][4] = '';
                            }
                            if(!data[k][a]){
                                data[k][a] = '';
                            }
                        }
                    }
                }
                getData.insert_batch("t_quantifyStandard",c_filed,data,function (err,result) {
                    if(result){
                        return res.json({"code":0,"msg":"导入成功"});
                    }else{
                        return res.json({"code":200,"msg":"导入失败"});
                    }
                })
            }
        })
    }catch(e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}

/**
 * 量化标准导入模板下载
 * @param req
 * @param res
 * @param next
 */
exports.quantify_download = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        var exlBuf = fs.readFileSync("../public/download/模板_量化标准.xlsx");
        var fileName = "量化标准导入模板";
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

/************************************量化管理 end ***************************************************/
