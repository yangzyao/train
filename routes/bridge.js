var express = require('express');
var router = express.Router();
var login = require('../controllers/login');
var control = require('../controllers/control');
var manage = require('../controllers/manage');
var record = require('../controllers/record');
var currency = require('../controllers/currencyRoute');
var systemSet = require('../controllers/systemSet');
var plan = require('../controllers/plan');
var quantify = require('../controllers/quantify');


router.get('/', login.index);

/**
 * 用户管理
 */
router.post('/userLogin', login.userLogin);                             //用户登录
router.get('/userLoginout', login.userLoginout);                        //用户退出
router.post('/updatePassword',login.updatePassword);                    //修改密码

/**
 *科目管理
 */
router.post('/add_Subject', control.add_Subject);                       //添加科目
router.post('/update_Subject', control.update_Subject);                 //修改科目
// router.get('/assess_standard', control.assess_standard);               //考核标准
router.post('/delete_Subject', control.delete_Subject);                 //删除科目

/**
 *人员管理
 */
router.post('/add_people', manage.add_people);                          //添加人员
router.post('/update_people', manage.update_people);                    //编辑人员
router.get('/delete_people', manage.delete_people);                     //删除人员
router.get('/people_export',manage.people_export);                      //人员导出
router.post('/people_import',manage.people_import);                     //人员导入
router.get('/people_download',manage.people_download);                  //人员导入模板下载


/**
 *成绩管理
 */
router.get('/get_subject',record.get_subject);                           //成绩录入前查询二级科目和一级单位
router.get('/get_second_class',record.get_second_class);                //根据一级单位ID查询二级单位
router.get('/get_person',record.get_person);                            //根据一级单位和二级单位查学员
router.get('/get_subjectHtml',record.get_subjectHtml);                  //跳到成绩录入页面
router.post('/add_record', record.add_record);                          //成绩录入
router.get('/get_assessment',record.get_assessment);                    //编辑成绩前查询相关成绩标准
router.post('/update_record', record.update_record);                    //编辑成绩
router.post('/getRecource', manage.getRecource);
router.get('/record_export', record.record_export);                     //成绩导出
router.post('/record_import', record.record_import);                    //成绩导入
router.get('/record_download',record.record_download);                  //成绩导入模板下载

/**
 *成绩分析
 */
// router.post('/userLogin', poll.userLogin);


/**
 *计划管理
 */
router.get('/get_unit', plan.get_unit);                                 //新建计划或指示时查询单位
router.post('/add_plan',plan.add_plan);                                 //添加计划或指示
router.post('/push_plan',plan.push_plan);                               //推送计划或指示
router.get('/sup_delete_plan',plan.sup_delete_plan);                    //上级单位计划或指示
router.get('/jun_delete_plan',plan.jun_delete_plan);                    //上级单位计划或指示

/**
 *量化管理
 */
router.get('/get_unit_first', quantify.get_unit_first);                 //量化考评录入前加载一级单位
router.post('/get_person',quantify.get_person);                         //根据一级单位加载相关人员
router.post('/get_first_proj',quantify.get_first_proj);                 //根据人员类型加载一级项目
router.post('/get_second_proj',quantify.get_second_proj);               //根据人员类型,一级项目加载二级项目
router.post('/get_description',quantify.get_description);               //根据人员类型,二级项目加载情况说明与得分
router.post('/add_quantify',quantify.add_quantify);                     //量化录入
router.get('/quantify_export',quantify.quantify_export);                //量化记录导出
router.get('/Qstandard_export',quantify.Qstandard_export);              //量化标准导出
router.post('/Qstandard_import',quantify.Qstandard_import);             //量化标准导入
router.get('/quantify_download',quantify.quantify_download);            //量化标准导入模板下载



/**
 *系统设置
 */
router.post('/add_people', systemSet.add_people);                       //添加本单位用户
router.get('/local_info',systemSet.local_info);                         //获取本机IP和计算机名
router.get('/db_backup',systemSet.db_backup);                           //数据库备份
router.post('/db_restore',systemSet.db_restore);                        //数据库还原

//人员选项设置
router.get('/get_resour',systemSet.get_resour);                         //点击人员选项设置后默认查询单位级别数据
router.post('/getResourByTypeid',systemSet.getResourByTypeid);          //根据资源类型表id查询相关资源
router.post('/add_update_resour',systemSet.add_update_resour);          //添加/修改资源
router.get('/delete_resour',systemSet.delete_resour);                   //删除资源

/**
 *通用方法
 */
router.post('/pageWay', currency.pageWay);                              //通用分页方法
router.post('/diplay_chart', currency.diplay_chart);                    //显示图表

module.exports = router;
