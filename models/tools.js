/**
 * Created by Administrator on 2017/12/1.
 */
var getData = require('../models/dbsql');

exports.getDatas=function (data,cb) {
    console.log(data);
    var dataFiled=[];     //二级科目对应得字段名
    for(var a=0;a < data.length;a++) {
        console.log(a);
        var filed = ["second_subject", "cloumn", "cloumns"];
        getData.select_data("t_subject", filed, "second_subject", data[a], null, null, function (err, kid) {
            //console.log(kid[0].cloumn);
            if (err == 0) {
                getData.select_cloumn("t_general",kid[0].cloumn, function (err, exist) {
                    if (err == 0) {
                        //console.log(exist.length);
                        if(exist.length < 1){
                            dataFiled.push(kid);
                            //console.log(dataFiled);

                            if(a = data.length-1){
                                console.log(data.length);
                                cb(0,dataFiled);
                            }
                        }
                    } else {
                        res.end(JSON.stringify({'code': 120, 'msg': "查询失败"}));
                    }
                })
            } else {
                res.end(JSON.stringify({'code': 120, 'msg': "查询失败"}));
            }
        })
    }
    // console.log(dataFiled);
    // cb(0,dataFiled);
}


















