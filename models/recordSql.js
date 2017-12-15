var db = require("./db");

exports.select_user = function (data,callback){
    var sqlStrs = "select * from t_record where unit_first=? and unit_second =? and check_time=? and second_class=?";
    // var data = ["t_subject","type"];
    // var sqlStrs ="select 1 from information_schema.columns where table_name=? and column_name=?";
    db.insert(data,sqlStrs,function(err,datas){
        if(err === 0){
            callback(0,datas);
        }else{
            callback(err,null);
        }
    });
};