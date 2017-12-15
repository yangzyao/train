
var getData = require('../models/dbsql');                       //通用sql查询
var getManageData = require('../models/manageSql');             //定制sql查询
var crypto = require('crypto');
var os=require('os');

/************************************添加本单位用户 start *************************************************/
/**
 * 添加本单位用户
 * @param req
 * @param res
 * @param next
 */
exports.add_people = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        var body = req.body;
        console.log(body);
        var rid= body.id;
        var rigth_idData=[];
        var rigth_id="";
        var path = body.path;
        var name = body.name;
        var grade = body.class;
        var password = "1";
        var passwords = crypto.createHash('md5').update(password).digest('hex');
        var create_date = new Date();
        getData.select_data("t_user","class","id",rid,null,null,function (err,hrr) {
            console.log(hrr[0].class);
            if(hrr){
                if(hrr[0].class=="旅团"){
                    rigth_idData = [2,3,4,5,6,7,8,9];
                }else if(hrr[0].class=="营"){
                    rigth_idData=[2,3,4,5];
                }
                rigth_id =rigth_idData.join("|");
                console.log(rigth_id);
                var fieldArr = ['id','rid','class','picture_path','name','password','rigth_id','create_time'];
                var dataArr = [0,rid,grade,path,name,passwords,rigth_id,create_date];
                getData.select_data("t_user",null,"name",name,null,null,function (err,result) {
                    if(result ==""){
                        getData.into("t_user",fieldArr,dataArr,function (err,data) {
                            console.log(err);
                            if(data){
                                res.json({"code":0,"msg":"保存成功"});
                            }else{
                                res.json({"code":300,"msg":"保存失败"});
                            }
                        })
                    }else{
                        return res.json({"code":100,"msg":"用户名已存在"}) ;

                    }
                })
            }else{
                return res.json({"code":200,"msg":"查询失败"}) ;
            }
        })


    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
};

/************************************添加本单位用户 end *************************************************/

/************************************获取本机IP和计算机名 start ******************************************/
/**
 * 获取本机IP和计算机名
 * @param req
 * @param res
 * @param next
 */
exports.local_info = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
            var iptable={},
            ifaces=os.networkInterfaces();
        var hostname=os.hostname();
        for (var dev in ifaces) {
            ifaces[dev].forEach(function(details,alias){
                if (details.family=='IPv6') {
                    iptable[dev+(alias?':'+alias:'')]=details.address;
                }
            });
        }
        var data=[iptable.本地连接,hostname];
        res.json({"code":0,"msg":data})


    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
};

/************************************获取本机IP和计算机名 end ********************************************/

/************************************人员系统参数设置 start **********************************************/

/**
 * 点击人员选项设置后默认查询单位级别数据
 * @param req
 * @param res
 * @param next
 */
exports.get_resour = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try {
        var unit_type_id = 1;
        getData.select_data("t_resour",null,"type_id",unit_type_id,null,null,function (err,data) {
            if(data){
                //res.json({"code":0,"msg":"查询资源表成功","data":data});
                res.redirect('',{"code":0,"msg":"查询资源表成功","data":data});
            }else{
                res.json({"code":100,"msg":"查询资源表失败"});
            }
        })
    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 根据资源类型表id查询相关资源
 * @param req:type_id
 * @param res:msg,data
 * @param next
 */
exports.getResourByTypeid = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var query = req.body;
    try {
        var type_id = query.id;
        getData.select_data("t_resour",null,"type_id",type_id,null,null,function (err,data) {
            if(data){
                res.json({"code":0,"msg":"查询资源表成功","data":data});
            }else {
                res.json({"code":100,"msg":"查询资源表失败"});
            }
        })
    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 添加/修改资源
 * @param req
 * @param res
 * @param next
 */
exports.add_update_resour = function (req,res,next) {
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
        getData.data_add_modify("t_resour",fileArr,dataArr,"id",id,function (err,data) {
            if(data){
                if(id){
                    res.json({"code":0,"msg":"修改成功"});
                }else{
                    res.json({"code":0,"msg":"保存成功"});
                }

            }else {
                if (id){
                    res.json({"code":100,"msg":"修改失败"});
                }else {
                    res.json({"code":100,"msg":"保存失败"});
                }
            }
        })
    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 删除资源
 * @param req
 * @param res
 * @param next
 */
exports.delete_resour = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    var id = req.query.id;
    try {
        if(!id){
            res.redirect('back');
            return;
        }
        getData.delete_data("t_resour",null,"id",id,function (err,data) {
            if(data){
                res.json({"code":0,"msg":"删除失败"});
            }else {
                res.json({"code":100,"msg":"删除失败"});
            }
        })
    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/************************************人员系统参数设置 end ************************************************/

/************************************数据库备份/还原 start ***********************************************/

/**
 * 数据库备份
 * @param req
 * @param res
 * @param next
 */
exports.db_backup = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        var d = new Date();
        var date = d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日"+d.getHours()+"时"+d.getMinutes()+"分";
        var cmd = "mysqldump -h 127.0.0.1 -P 3306 -uroot -p123456 hktrain > D:/backup/数据库备份_"+date+".sql";
        exec(cmd,function (err,stdout,stderr) {
            if(!err){
                console.log("执行 ["+cmd+"] 成功");
                return res.json({"code":0,"msg":"数据库备份成功"});
            }else{
                console.log(err);
                return res.json({"code":100,"msg":"数据库备份失败"});
            }
        });
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/**
 * 数据库还原
 * @param req
 * @param res
 * @param next
 */
exports.db_restore = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // if(req.session && req.session.user){
    try{
        var psth = req.body.path;
        var cmd = "mysql -h 127.0.0.1 -uroot -p123456 hktrain < "+psth;
        exec(cmd,function (err,stdout,stderr) {
            if(!err){
                console.log("执行 ["+cmd+"] 成功");
                return res.json({"code":0,"msg":"数据库还原成功"});
            }else{
                console.log(err);
                return res.json({"code":100,"msg":"数据库还原失败"});
            }
        });
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
    // }else{
    //     res.redirect('/');
    // }
}

/************************************数据库备份/还原 end *************************************************/
