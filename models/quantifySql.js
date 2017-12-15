var db = require("./db");


//根据一级单位加载相关人员(模糊查询)
/*********************************************
 * 简介:根据一级单位加载相关人员(模糊查询)
 * string(tb_name)       要查询的表名
 * string(c_filed)       要查询的字段集合
 * string(d_filed)       查询匹配的一级单位字段名
 * string(d_data)        查询匹配的一级单位的值
 * string(e_filed)       模糊查询匹配的字段名
 * string(e_data)        模糊查询匹配的值
 * string(f_arr)         查询匹配的is_valid字段
 * string(f_data)        查询匹配的is_valid字段的值
 * function(callback)    回调函数
 *********************************************/
exports.select_quantifyData = function(tb_name,c_filed,d_filed,d_data,e_filed,e_data,f_arr,f_data,callback){
    c_filed = c_filed?c_filed:"*";

    var str = '';
    if(d_filed){
        str = " where "+d_filed+" = " + JSON.stringify(d_data);
        if(f_arr != null){
            str+= " and "+f_arr+" =" +JSON.stringify(f_data);
        }
        if(e_filed != null){
            str+= " and "+e_filed+" like '%"+e_data+"%'";
        }
    }else if(f_arr){
        str = " where "+f_arr+" = " + JSON.stringify(f_data);
        if(e_filed != null){
            str+= " and "+e_filed+" like '%"+e_data+"%'";
        }
    }else if(e_filed){
        str = " where "+e_filed+" like '%"+e_data+"%'";
    }
    var sqlselect = " SELECT "+ c_filed +" FROM "+ tb_name;
    if(str){
        sqlselect += str;
    }
    db.insert(null,sqlselect,function(err,data){
        if(err === 0){
            callback(0,data);
        }else{
            callback(err,null);
        }
    });
};