/**
 * 计划模块
 */

var getData = require('../models/dbsql');                       //通用sql查询
var getManageData = require('../models/manageSql');             //定制sql查询
var crypto = require('crypto');

var xlsx = require('node-xlsx');
var fs = require('fs');
var ejsExcel = require('ejsexcel');

/************************************计划或指示管理 start *************************************************/
/**
 * 新建计划或指示时查询单位
 * @param req
 * @param res
 * @param next
 */
exports.get_unit = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        var c_filed = ["id","rid","name"];
        //var datas = req.session.user.name;
        getData.select_data("t_user",c_filed,null,null,"is_valid",1,function (err,data) {
            if(data){
                //res.redirect('',{"code":0,"msg":"查询成功","data":data,"datas":datas});
                res.json({"code":0,"msg":"查询成功","data":data});
            }else{
                res.json({"code":200,"msg":"查询失败"});
            }
        })
    }catch (e){
        console.log(e);
        res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 添加计划或指示
 * @param req
 * @param res
 * @param next
 */
exports.add_plan = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try {
        var fileArr = Object.keys(query.data);
        var dataArr = [];
        for(var i in query.data){
            dataArr.push(query.data[i]);
        }
        getData.data_add_modify("t_pushPlan",fileArr,dataArr,null,null,function (err,data) {
            if(data){
                res.json({"code":0,"msg":"保存成功"});
            }else {
                res.json({"code":200,"msg":"保存失败"});
            }
        })
    }catch (e){
        console.log(e);
        res.json({"code":300,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 推送计划或指示
 * @param req
 * @param res
 * @param next
 */
exports.push_plan = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try{
        var id = query.id;
        getData.updata("t_pushPlan","is_push=?",1,"id",id,function (err,data) {
            if(data){
                res.json({"code":0,"msg":"推送成功"});
            }else{
                res.json({"code":200,"msg":"推送失败"});
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
 * 上级单位删除计划或指示
 * @param req
 * @param res
 * @param next
 */
exports.sup_delete_plan =function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var id = req.query.id;
    try{
        getData.updata("t_pushPlan","is_valid=?",0,"id",id,function (err,data) {
            if(data){
                res.json({"code":0,"msg":"删除成功"});
            }else{
                res.json({"code":200,"msg":"删除失败"});
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
 * 下级单位删除计划或指示
 * @param req
 * @param res
 * @param next
 */
exports.jun_delete_plan =function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var id = req.query.id;
    try{
        getData.updata("t_pushPlan","is_valid2=?",0,"id",id,function (err,data) {
            if(data){
                res.json({"code":0,"msg":"删除成功"});
            }else{
                res.json({"code":200,"msg":"删除失败"});
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

/************************************计划或指示管理 end ***************************************************/
