/**
 * 人员管理
 */

var getData = require('../models/dbsql');                       //通用sql查询
var getManageData = require('../models/manageSql');             //定制sql查询
var currency = require('../controllers/currencyRoute');
var crypto = require('crypto');
var ejsExcel = require("ejsexcel");
var xlsx = require('node-xlsx');
var async = require("async");
var fs = require("fs");


/************************************人员管理 start ***********************************************/
/**
 * 人员管理
 * @param req
 * @param res
 * @param next
 */
exports.getRecource = function (req,res,next) {
    // if(req.session && req.session.user){
    try{
        var dataArr =[];
        async.parallel([
                function(callback){
                    getData.select_data("t_resour",null,"type_id",1,null,null,function (err,data) {
                          if(data){
                              callback(null, data);
                          }
                        });
                },
                function(callback){
                    getData.select_data("t_resour",null,"type_id",9,null,null,function (err,datas) {
                        if(datas){
                            callback(null, datas);
                        }
                    });
                },
                function(callback){
                    getData.select_data("t_resour",null,"type_id",4,null,null,function (err,data) {
                        if(data){
                            callback(null, data);
                        }
                    });

                },
                function(callback){
                    getData.select_data("t_resour",null,"type_id",18,null,null,function (err,data) {
                        if(data){
                            callback(null, data);
                        }
                    });

                },
                function(callback){
                    getData.select_data("t_resour",null,"type_id",17,null,null,function (err,data) {
                        if(data){
                            callback(null, data);
                        }
                    });

                },
                function(callback){
                    getData.select_data("t_resour",null,"type_id",19,null,null,function (err,data) {
                        if(data){
                            callback(null, data);
                        }
                    });

                },
                function(callback){
                    getData.select_data("t_resour",null,"type_id",5,null,null,function (err,data) {
                        if(data){
                            callback(null, data);
                        }
                    });

                },
                function(callback){
                    getData.select_data("t_resour",null,"type_id",11,null,null,function (err,data) {
                        if(data){
                            callback(null, data);
                        }
                    });

                },
                function(callback){
                    getData.select_data("t_resour",null,"type_id",12,null,null,function (err,data) {
                        if(data){
                            callback(null, data);
                        }
                    });

                }
            ],
            function(err, results){
            if(results){
                for(var i=0;i<results.length;i++){
                    dataArr.push(results[i]);
                }
                return res.json({"code":0,"data":dataArr})
            }else{
                return res.json({"code":200,"msg":"查询失败"});
            }

            });

    }catch (e){
        return res.json({"code":300,"data":"unknow error"})
    }
    // }else{
    //     return res.redirect('/');
    // }
};

/**
 * 增加人员
 * @param req
 * @param res
 * @param next
 */
exports.add_people = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try {
        var id =query.id?query.id:"";
        var fileArr = Object.keys(query.data);
        var dataArr = [];
        for(var i in query.data){
            dataArr.push(query.data[i]);
        }
        //console.log(fileArr);
        //console.log(dataArr);
        getData.data_add_modify("t_person",fileArr,dataArr,null,null,function (err,data) {
            if(data){
                return res.json({"code":0,"msg":"保存成功"});
            }else{
                console.log(err);
                return res.json({"code":200,"msg":"保存失败"});
            }
        })
    }catch (e){
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
};

/**
 * 修改人员
 * @param req
 * @param res
 * @param next
 */
exports.update_people = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query=req.body;
    try{
        var id =query.id;
        var fileArr = Object.keys(query.data);
        var dataArr = [];
        for(var i in query.data){
            dataArr.push(query.data[i]);
        }
        if(!id){
            res.redirect('back');
            return;
        }
        getData.data_add_modify("t_person",fileArr,dataArr,"id",id,function (err,data) {
            if(data){
                return res.json({"code":0,"msg":"修改成功"});
            }else{
                console.log(err);
                return res.json({"code":200,"msg":"修改失败"});
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
 * 删除人员
 * @param req
 * @param res
 * @param next
 */
exports.delete_people = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        var id=req.query.id;
        if(!id){
            res.redirect('back');
            return;
        }
        getData.updata("t_person","is_valid=?",0,"id",id,function (err,data) {
            if(data){
                return res.json({"code":0,"msg":"删除成功"});
            }else{
                return res.json({"code":200,"msg":"删除失败"});
            }
        })
    }catch (e){
        return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
};

/**
 * 人员导出
 * @param req
 * @param res
 * @param next
 */
exports.people_export = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var data=[[{"name":"xx旅团人员记录表"}]];
    var s=[];
    var man=0;
    var re1=[],
        re2=[],
        re3=[],
        re4=[],
        re5=[],
        re6=[],
        re7=[];
    try{
        var exlBuf = fs.readFileSync("../public/template/person.xlsx");
        async.parallel([
            function (cb) {
                getData.select_data("t_person",null,null,null,"is_valid",1,function (err,datas) {
                    cb(err,datas);
                })
            },
            function (cb) {
                getData.select_count("t_person","person_type","is_valid",1,function (err,re1) {
                    cb(err,re1);
                })
            },
            function (cb) {
                getData.select_count("t_person","education","is_valid",1,function (err,re2) {
                    cb(err,re2);
                })
            },
            function (cb) {
                getData.select_count("t_person","nation","is_valid",1,function (err,re3) {
                    cb(err,re3);
                })
            },
            function (cb) {
                getData.select_count("t_person","political_visage","is_valid",1,function (err,re4) {
                    cb(err,re4);
                })
            },
            function (cb) {
                getData.select_count("t_person","origin_place","is_valid",1,function (err,re5) {
                    cb(err,re5);
                })
            },
            function (cb) {
                getData.select_count("t_person","specialty","is_valid",1,function (err,re6) {
                    cb(err,re6);
                })
            },
            function (cb) {
                getData.select_count("t_person","single_parent","is_valid",1,function (err,re7) {
                    cb(err,re7);
                })
            }
        ],function (err,result) {
           for(var a=0;a<result[0].length;a++){
               s.push(result[0][a]);
               if(result[0][a].sex == "男"){
                   man+=1;
               }
           }
           //人员类型
            for(var b=0;b<result[1].length;b++){
               for(var name in result[1][b]){
                   re1.push(result[1][b][name]);
               }
            }
            var person_type =re1.join(" ");
            //文化程度
            for(var c=0;c<result[2].length;c++){
                for(var name in result[2][c]){
                    re2.push(result[2][c][name]);
                }
            }
            var education = re2.join(" ");
            //民族
            for(var d=0;d<result[3].length;d++){
                for(var name in result[3][d]){
                    re3.push(result[3][d][name]);
                }
            }
            var nation = re3.join(" ");
            //政治面貌
            for(var e=0;e<result[4].length;e++){
                for(var name in result[4][e]){
                    re4.push(result[4][e][name]);
                }
            }
            var political_visage = re4.join(" ");
            //籍贯
            for(var f=0;f<result[5].length;f++){
                for(var name in result[5][f]){
                    re5.push(result[5][f][name]);
                }
            }
            var origin_place = re5.join(" ");
            //特长
            for(var g=0;g<result[6].length;g++){
                for(var name in result[6][g]){
                    re6.push(result[6][g][name]);
                }
            }
            var specialty = re6.join(" ");
            //是否单亲
            for(var h=0;h<result[7].length;h++){
                for(var name in result[7][h]){
                    re7.push(result[7][h][name]);
                }
            }
            var single_parent = re7.join(" ");
            var data=[[{"name":"xx旅团人员记录表","record":"【性别】男"+Number(man)+" 女"+Number(result[0].length-man)+" 【人员类型】"+person_type+" 【文化程度】"+education+
                        " 【民族】"+nation+" 【政治面貌】"+political_visage+" 【籍贯】"+origin_place+" 【特长】"+specialty+" 【是否单亲】"+single_parent}]];
            data.push(s);
            var date="";
            currency.getTime(function (err,dates) {
                if(err == 0){
                    date = dates;
                }
            });
            var fileName = "xx旅团人员记录表_"+date;
            ejsExcel.renderExcel(exlBuf,data).then(function (exlBuf2) {s
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
 * 人员导入
 * @param req
 * @param res
 * @param next
 */
exports.people_import = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        var c_filed=["unit_first","unit_second","unit_third","unit_fourth","name",
            "card_id","sex","person_type","brith_day","education","nation","political_visage",
            "household","origin_place","specialty","single_parent","address","remark","only_child"];
        currency.upload(req,res,function (err,path) {
            if(err == 0){
                var obj = xlsx.parse(path);
                //var fileArr = Object.keys(obj[0].data);
                //删除上传后文件
                //fs.unlinkSync(re);
                var dataArr = [];
                var data = [];
                for(var i in obj[0].data){
                    dataArr.push(obj[0].data[i]);
                }
                for(var j=2;j<dataArr.length;j++){
                    data.push(dataArr[j]);
                }
                var filed = ["card_id"];
                getData.select_data("t_person",filed,null,null,null,null,function (err,datas) {
                    if(datas){
                        for(var i=0;i<datas.length;i++){
                            for(var j=0;j<data.length;j++){
                                if(data[j][5] == datas[i].card_id){
                                    data.splice(j,1);
                                    j=j-1;
                                }
                            }
                        }
                        if(data.length > 0){
                            //将空的数据置为''
                            for(var k=0;k<data.length;k++){
                                for(var a=0;a<19;a++){
                                    if(data[k].length <= 19){
                                        if(!data[k][18]){
                                            data[k][18] = '';
                                        }
                                        if(!data[k][a]){
                                            data[k][a] = '';
                                        }
                                    }
                                }
                            }
                            //console.log(data);
                            getData.insert_batch("t_person",c_filed,data,function (err,result) {
                                if(result){
                                    return res.json({"code":0,"msg":"导入成功"});
                                }else{
                                    console.log(err);
                                    return res.json({"code":100,"msg":"导入失败"});
                                }
                            });
                        }else{
                            return res.json({"code":200,"msg":"已存在相同数据，不能重复导入"});
                        }
                    }
                })
            }
        });
    }catch (e){
        console.log(e);
       return res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     return res.redirect('/');
    // }
}

/**
 * 人员导入模板下载
 * @param req
 * @param res
 * @param next
 */
exports.people_download = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        var exlBuf = fs.readFileSync("../public/download/模板_人员.xlsx");
        var fileName = "人员花名册导入模板";
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

/************************************人员管理 end ***********************************************/

