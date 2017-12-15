var getData = require('../models/dbsql');
var crypto = require('crypto');

/**
 * 首页
 */
exports.index = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");       //跨域访问
    res.render('index');
}

/**
 * 用户登录
 * username 用户名
 * password 密码
 */
exports.userLogin = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    console.log(query);
    try {
        var username=query.username;
        var password = query.password ;
        if (!username||!password) {
            res.json({ "code": 300, "msg": { "status": "fail", "error": "参数错误" } });
        } else {
            var md5password = crypto.createHash('md5').update(password).digest('hex');
            getData.select_data("t_user", null,"name",username ,null,null,function (err, result) {
                console.log(result);
                if (result.length!=""){
                    if(result[0].password ==md5password){
                        console.log(result[0].rigth_id);
                        if(result[0].rigth_id!=null){
                            var bb = result[0].rigth_id;
                            var cc = bb.toString().split("|");
                            getData.select_data("t_right",null,null,null,function (err,results) {
                                if(result){
                                    var resData =[];
                                    for(var a=0;a<cc.length;a++){
                                        for(var b =0;b<results.length;b++){
                                            if(cc[a] == results[b].id){
                                                resData.push(results[b]);
                                            }
                                        }
                                    }
                                    console.log(resData);
                                    res.end(JSON.stringify({"code": 200, "msg": "登录成功","right":resData}));
                                }

                            })
                        }else{
                            res.end(JSON.stringify({"code": 200, "msg": "登录成功"}));
                        }

                        // req.session.user = result[0];
                        // console.log(req.session.user);
                    }else{
                        res.end(JSON.stringify({"code": 300, "msg": "用户名或密码错误"}));
                    }
                } else {
                    res.end(JSON.stringify({"code": 300, "msg": "用户名或密码不正确"}));
                }
            })
        }
    } catch (e) {
        console.log(e);
        res.end(JSON.stringify({"code": 400, "msg": "unknown error"}));
    }
}

/**
 * 退出登录
 * @param req
 * @param res
 * @param next
 */

exports.userLoginout = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    if(req.session && req.session.user){
        try{
            delete req.session.user;
            res.redirect('/');
        } catch (e) {
            res.end(JSON.stringify({"code": 400, "msg": "unknown error"}));
        }
    }else{
        res.redirect('/');
    }

}

/**
 * 修改密码
 * @param req
 * @param res
 * @param next
 */
exports.updatePassword = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    try {
        var id = query.id;
        var nPass = query.newPass;
        var oPass = query.oldPass;
        var oldPass = crypto.createHash('md5').update(oPass).digest('hex');
        var newPass = crypto.createHash('md5').update(nPass).digest('hex');
        getData.select_data("t_user",null,"id",id,"is_valid",1,function (err, result) {
            if(result.length!=""){
                if(result[0].password ==oldPass){
                    getData.updata("t_user","password=?",newPass,"id",id,function (err,data) {
                        if(data){
                            res.end(JSON.stringify({"code": 0, "msg": "密码修改成功"}));
                        }else{
                            res.end(JSON.stringify({"code": 100, "msg": "密码修改失败"}));
                        }
                    })
                }else{
                    res.end(JSON.stringify({"code": 200, "msg": "原密码不正确，不允许修改"}));
                }
            }else{
                res.end(JSON.stringify({"code": 300, "msg": "该用户不存在!"}));
            }
        })

    }catch (e){
        console.log(e);
        res.end(JSON.stringify({"code": 400, "msg": "unknown error"}));
    }
}