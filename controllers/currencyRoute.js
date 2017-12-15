var getData = require('../models/dbsql');
var formidable = require('formidable');
var xlsx = require('node-xlsx');
var fs = require('fs');

//分页带排序查询
exports.pageWay = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
        try{
            var body = req.body;
            console.log(body);
            var filedArr = body.filedArr ? body.filedArr : '',
                dataArr = body.dataArr ? body.dataArr : '',
                selcode = body.selcode ? body.selcode : '',
                sellift = body.sellift ? body.sellift : '',
                page = body.page ? parseInt(body.page) : 1,
                num = body.num ? parseInt(body.num) : 12,
                tb_name = body.tb_name;
            if(tb_name ==""){
                res.json({"code": 1, "msg": "tb_name undefined"})
            }
            getData.select_data_orderby(tb_name,null,filedArr,dataArr,selcode,sellift,page,num,function (err,data) {
                if(data){
                    console.log(data);
                  return res.end(JSON.stringify({'code': 0, 'msg': " 查询数据成功","Q": data}));
                }else{
                    res.json({ "code": 100, "msg":"查询数据库错误"});
                }
            })
        }catch (e){
            res.json({ "code": 300, "msg":  "unkown error" });
        }

};


/**
 *显示图表
 */
exports.diplay_chart = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        var body = req.body;
        console.log(body);
        var condition = body.condition,
            tb_name = body.tb_name;
        if(tb_name ==""){
            res.json({"code": 1, "msg": "tb_name undefined"})
        }
        getData.select_data_chart(tb_name,condition,function (err,data) {
            if(data){
                console.log(data);
                var sum=0;                                 //此字段各类型数据的总数
                var number=[];                             //每个类型的数量集合
                for(var i=0;i<data.length;i++){
                    sum=sum+parseInt(data[i].counts);
                        number.push(data[i].counts);

                }
                var Percentage="";                       //百分比
                var perData=[];
                for(var k=0;k<number.length;k++){
                    var kkk={};
                    Percentage=(Math.round(number[k] / sum * 10000) / 100.00 + "%");
                    kkk.type = data[k][condition];
                    kkk.Percentage=Percentage;
                    perData.push(kkk);
                }
                console.log(perData);
                return res.end(JSON.stringify({'code': 0, 'msg': " 查询数据成功","Q": perData}));
            }else{
                res.json({ "code": 100, "msg":"查询数据库错误"});
            }
        })
    }catch (e){
        res.json({ "code": 300, "msg": "unkown error"});
    }

};

/**
 * 通用上传方法
 * @param req
 * @param res
 */
exports.upload = function (req,res,cb) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.uploadDir="../public/upload/files";
    form.parse(req,function (err,fileds,files) {
        var path = files.excl.path;
        if(path.split(".")[3] == 'xlsx' || path.split(".")[3] == 'xls'){
            cb(0,path);
        }else{
            return res.json({"code":300,"msg":"文件格式错误"});
        }
    })

}

/**
 * 获取系统当前标准时间（xxxx年xx月xx日xx时xx分）
 * @param callback
 */
exports.getTime = function (callback) {
    var time = new Date();
    var year = time.getFullYear(),
        month = time.getMonth()+1,
        day = time.getDate(),
        hour = time.getHours(),
        minute = time.getMinutes();
    var date = year+"年"+month+"月"+day+"日"+hour+"时"+minute+"分";
    callback(0,date);
}