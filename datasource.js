/*
import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { app } from 'electron'

const STORE_PATH = app.getPath('userData') // 获取electron应用的用户目录

const adapter = new FileSync(path.join(STORE_PATH, '/globalData.json')) // 初始化lowdb读写的json文件名以及存储路径


//const db = Datastore(adapter) // lowdb接管该文件

*/


/*
https://blog.csdn.net/qq_15987295/article/details/79489036
针对lowdb自带的适配器：FileSync、FileAsync 和 LocalBrowser，有以下可选参数：

defaultValue: 文件不存在时的默认值；
serialize/deserialize: 写之前和读之后的操作。
const adapter = new FilSync('db.json',{
  serialize: (data) => encrypt((data)),
  deserialize: (data) => JSON.parse(decrypt(data))

 */





var require = require || window.parent.require;
var module = module || window.parent.module;

const _ = require('lodash');
const lodashId = require('lodash-id');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs');

/*const adapter = new FileSync('db.json')
const db = low(adapter)*/



// var projectName = 'testPlanProject';
//
// var dataPath = './data/'+projectName+'/';
//
// var adapter = new FileSync('./' + dataPath + 'db.json')
// var db = low(adapter)
// db._.mixin(lodashId)
// _.mixin(lodashId)



var projectName = 'testPlanProject';

var dataPath = './data/';

var adapter = new FileSync('./' + dataPath+projectName +"/"+ 'db.json')
var db = low(adapter)
db._.mixin(lodashId)
_.mixin(lodashId)


class DataSource {
    /*    var testdata = {
            posts: [
                {id: 1, body: 'one', published: false},
                {id: 2, body: 'two', published: true}
            ],
            comments: [
                {id: 1, body: 'foo', postId: 1},
                {id: 2, body: 'bar', postId: 2}
            ]
        }*/


    //切换json文件(数据库) 返回的是整个json
    setJson(jsonfile) {
        adapter = new FileSync('./' + dataPath+projectName+"/" + jsonfile)
        db = low(adapter)
        //console.log(lodashId)
        db._.mixin(lodashId)
        _.mixin(lodashId)
        return db.value();
    }

    //返回当前json
    getAllFromJson() {
        return db.value();
    }


    getProjectName() {
        return projectName;
    }


    setProjectName(inputProjectName) {
        projectName = inputProjectName;
    }


    getAllFromJson() {
        return (db.value());
    }


    //以数组形式返回对象的所有keys
    /*    this.getAllKeys  = function (obj) {
            return _.keys(obj);//return ['id', 'name', 'age']
        }*/

    getAllKeys(obj) {
        return _.keys(obj);//return ['id', 'name', 'age']
    }


    getAllKeys() {
        return _.keys(db.value());//return ['id', 'name', 'age']
    }


    //从数组集合中挑出一个key，将其值作为数组返回
    /*如   var array  = [
    {id: 0, name: "aaa", age: 33},
       {id: 1, name: "bbb", age: 25}
    ]
    getAllValuesByKey(array,'name')
    bar = ["aaa", "bbb"]*/
    getAllValuesByKey(key) {
        return _.map(db.value(), key)
    }

    getAllValuesByKey(array, key) {
        return _.map(array, key)
    }


    //根据 条件查找数组
    /*    如 var array  = [
            {id: 0, name: "aaa", age: 33},
            {id: 1, name: "bbb", age: 25}
        ]
        getFromArrayByAttr(array,'age',33)
        bar = {id: 0, name: "aaa", age: 33}*/
    findByAttr(array, attr, attrValue) {
        return _.find(array, [attr, attrValue]);
    }

    findByAttr(attr, attrValue) {
        return _.find(db.value(), [attr, attrValue]);
    }


    //查  根据条件获取对象
    /*    var object = { 'a': [{ 'b': { 'c': 3 } }] };

        getFromObject(object, 'a[0].b.c');
        // => 3

        getFromObject(object, ['a', '0', 'b', 'c']);
        // => 3*/
    getValue(obj, path) {
        //console.log(db)
        return _.get(obj, path)
    }


    getValue(path) {
        //console.log(db)
        return db.get(path).value()
    }


    //获取数组中数量或者对象中的key value数量
    getCount(path) {
        return db.get(path)
            .size()
            .value()
    }

    getCount() {
        return db.size().value()
    }


    //改  根据条件获取对象的值 返回的是整个object对象


    setValue(path, value) {
        return db.set(path, value).write()
    }


    //删 移除属性
    removeAttr(path) {
        return db.unset(path)
            .write()
    }

    //增  插入对象到数组中
    insertObjToArray(path, Obj) {
        return db.get(path)
            .push(Obj)
            .write()

    }

    //判断是否存在
    isExist(path) {
        return db.has(path)
            .value()
    }


    //返回module基本信息
    getModuleInfo() {
        this.setJson("modules.json");

        var size = db.value().length;
        //console.log(size)
        var obj = new Object();
        obj.text = "root";

        var modules = new Array();
        for (var i = 0; i < size; i++) {
            var temp = db.get([i]).value();

            var mymodule = new Object();
            mymodule.id = temp.id;
            mymodule.text = temp.moduleName;
            //console.log(temp.moduleId);
            //console.log(temp.moduleName);
            modules[i] = mymodule;
        }
        obj.children = modules;
        var result = new Array();
        result[0] = obj;
        return result
    }


    insertModule(newObject) {
        this.setJson("modules.json");

        try {
            db.insert(newObject).write();
        }
        catch (e) {
            console.log(e);
            return false
        }
        return true
    }


    /*    removeModule(inputModuleName){
            try{
                db.remove({ moduleName: inputModuleName }).write()
            }
            catch (e) {
                console.log(e);
                return false
            }
            return true
        }*/


    removeModule(inputModuleId) {
        this.setJson("modules.json");

        try {
            db.remove({id: inputModuleId}).write()
        }
        catch (e) {
            console.log(e);
            return false
        }
        return true
    }


    updateModule(newObject) {
        this.setJson("modules.json");

        try {
            var temp = new Object();
            temp.id = newObject.id;
            db.find(temp).assign(newObject).write();
        }
        catch (e) {
            console.log(e);
            return false
        }
        return true
    }


    //返回Case基本信息
    getCaseInfo(moduleId) {
        this.setJson("modules.json");

        //console.log(db.get([0]).value().testCases);
        //console.log(db.value());
        var mymodule = _.getById(db.value(), moduleId);
        //console.log(mymodule);
        var cases = mymodule.testCases;
        var casesArray = new Array();
        for (var i = 0; i < cases.length; i++) {
            var temp = new Object();
            //console.log(cases[i].caseName);
            //console.log(cases[i].status);
            //console.log(cases[i].comment);
            temp.id = cases[i].id;
            temp.caseName = cases[i].caseName;
            temp.comment = cases[i].comment;
            temp.status = cases[i].status;
            casesArray[i] = temp;
        }
        return casesArray;
    }


    insertCase(moduleId, object) {
        this.setJson("modules.json");

        /* var temp = new Object();*/
        //console.log(cases[i].caseName);
        //console.log(cases[i].status);
        //console.log(cases[i].comment);
        /*        temp.id  = object.id;
                temp.caseName  = object['Test Case Name'];
                temp.comment  = object.Comment;
                temp.status =  object.Execute;
                temp.scripts =  [];
                temp.datas =  [];*/


        var cases = db.find({id: moduleId}).get('testCases');
        //console.log(cases);
        /* var mymodule = _.getById(db.value(), moduleId);

         var cases =  mymodule.find("testCases");
  */
        var flag = false;
        try {
            cases.insert(object).write();
        } catch (e) {
            console.log(e)
            return false;
        }

        return true;
    }


    removeCase(caseId) {

        this.setJson("modules.json");

        var modules = db.value();


        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            //console.log(cases.value());

            /* var kase =  cases.find({ id: caseId }).value();

             if(kase!=undefined&&kase!=null){
                 return kase;
             }*/

            cases.remove({id: caseId}).write()
        }


        /* return (db.remove({ objectPageName: inputObjectPageName }).write());*/
    }


    //异步用不了?
    // removeCaseByArray(caseIdArray) {
    // this.setJson("modules.json");

    // for (var i = 0; i < caseIdArray.length; i++) {

    // this.removeCase(caseIdArray[i].id);
    // }


    // }

    updateCase(object) {
        /*        var temp = new Object();*/
        //console.log(cases[i].caseName);
        //console.log(cases[i].status);
        //console.log(cases[i].comment);
        /*        temp.id  = object.id;
                temp.caseName  = object['Test Case Name'];
                temp.comment  = object.Comment;
                temp.status =  object.Execute;*/


        this.setJson("modules.json");

        var caseId = object.id;


        var modules = db.value();


        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            //console.log(cases.value());

            /* var kase =  cases.find({ id: caseId }).value();

             if(kase!=undefined&&kase!=null){
                 return kase;
             }*/

            cases.find({id: caseId}).assign(object).write();
        }


    }


    //返回script信息
    /* getScriptInfo(moduleId,caseId){
         this.setJson("modules.json");


         var mymodule = _.getById(db.value(), moduleId);
         var cases = mymodule.testCases;
         var kase = _.getById(cases, caseId);
         console.log(kase);
         var scripts = kase.scripts;
         var scriptsArray = new Array();
         for(var i =0;i<scripts.length;i++){
             var temp = new Object();
             temp.Step  = scripts[i].step;
             temp.Keyword =  scripts[i].keword;
             temp['Object Name']  = scripts[i].objectName;
             temp['Parameter Values']  = scripts[i].parameterValues;
             temp['Expected Values']  = scripts[i].expectedValues;
             temp['Output Values']  = scripts[i].outputValues;
             temp.Comments  = scripts[i].comment;
             scriptsArray[i] = temp;
         }
         return (scriptsArray);
     }*/

    getScriptInfo(caseId) {
        /*
                this.setJson("modules.json");

                var modules  = db.value();
                for(var i =0;i<modules.length;i++){
                    var mymodule = db.get('['+i+']').value();
                    var kase =  _.getById(mymodule.testCases,caseId);
                    if(kase!=undefined&&kase!=null){
                        return kase;
                    }
                }
        */


        //var kase = _.getById(db.value(), caseId);


        this.setJson("modules.json");

        var modules = db.value();

        var kase;
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            //console.log(cases.value());

            var temp = cases.find({id: caseId});

            if (temp != undefined && temp != null) {
                kase = temp;
                break;
            }
        }

        var scripts = kase.get("scripts").value();

        return scripts;


    }


    insertScript(caseId, object) {

        this.setJson("modules.json");

        var modules = db.value();

        var kase;
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            console.log(cases.value());

            var temp = cases.find({id: caseId});
            console.log(temp.value());

            if (temp != undefined && temp != null) {
                kase = temp;
                break;
            }
        }

        //console.log(kase.value());

        var scripts = kase.get("scripts");

        console.log(scripts.value());

        var flag = false;
        try {
            scripts.insert(object).write();
        } catch (e) {
            console.log(e)
            return false;
        }

        return true;

    }


    removeScript(scriptId) {

        this.setJson("modules.json");

        var modules = db.value();

        //var script;
        var scripts = [];
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            //console.log(cases);

            //console.log(cases.value().length);

            for (var j = 0; j < cases.value().length; j++) {
                var kase = cases.get('[' + i + ']');

                scripts = kase.get("scripts");

                var temp = scripts.find({id: scriptId});
                //console.log(temp.value());

                if (temp != undefined && temp != null) {
                    //script = temp;
                    scripts.remove({id: scriptId}).write();
                    break;
                }

            }


        }


    }


    updateScript(object) {
        this.setJson("modules.json");

        var modules = db.value();

        var scriptId = object.id;
        console.log(scriptId)

        //var script;
        var scripts = [];
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            //console.log(cases);

            //console.log(cases.value().length);

            for (var j = 0; j < cases.value().length; j++) {
                var kase = cases.get('[' + i + ']');

                scripts = kase.get("scripts");
                console.log(scripts.value());

                var temp = scripts.find({id: scriptId});
                console.log(temp.value());

                if (temp != undefined && temp != null) {
                    //script = temp;
                    scripts.find({id: scriptId}).assign(object).write();
                    break;
                }

            }


        }
    }



    getDataKeys(caseId){
        this.setJson("modules.json");

        var modules = db.value();

        var kase;
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            //console.log(cases.value());

            var temp = cases.find({id: caseId});

            if (temp != undefined && temp != null) {
                kase = temp;
                break;
            }
        }

        var data = kase.get("datas").value()[0];

        //剔除id这个key
        var keys = _.keys(data);

        var index =  keys.indexOf ('id');

        if (index > -1) {
            keys.splice(index,1);
        }

        //return keys;
        var array =  new Array(keys.length);
        for(var i=0;i<keys.length;i++){
            var temp = new Object();
            temp.field = keys[i];
            temp.title = keys[i];
            array[i] = temp;
        }

        return array;


    }


    getDataInfo(caseId) {
        /*
                this.setJson("modules.json");

                var modules  = db.value();
                for(var i =0;i<modules.length;i++){
                    var mymodule = db.get('['+i+']').value();
                    var kase =  _.getById(mymodule.testCases,caseId);
                    if(kase!=undefined&&kase!=null){
                        return kase;
                    }
                }
        */


        //var kase = _.getById(db.value(), caseId);


        this.setJson("modules.json");

        var modules = db.value();

        var kase;
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            //console.log(cases.value());

            var temp = cases.find({id: caseId});

            if (temp != undefined && temp != null) {
                kase = temp;
                break;
            }
        }

        var datas = kase.get("datas").value();

        return datas;


    }


    insertData(caseId, object) {

        this.setJson("modules.json");

        var modules = db.value();

        var kase;
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            console.log(cases.value());

            var temp = cases.find({id: caseId});
            console.log(temp.value());

            if (temp != undefined && temp != null) {
                kase = temp;
                break;
            }
        }

        //console.log(kase.value());

        var datas = kase.get("datas");

        console.log(datas.value());

        var flag = false;
        try {
            datas.insert(object).write();
        } catch (e) {
            console.log(e)
            return false;
        }

        return true;

    }


    //insertDataColumn(caseId,keyValueObject){
    insertDataColumn(caseId,key,value){
        this.setJson("modules.json");
        var modules = db.value();

        var kase;
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            console.log(cases.value());

            var temp = cases.find({id: caseId});
            console.log(temp.value());

            if (temp != undefined && temp != null) {
                kase = temp;
                break;
            }
        }

        //console.log(kase.value());

        var datas = kase.get("datas");

        datas.value();

        try {
            for (var i = 0; i < datas.value().length; i++) {
                var dataId = datas.value()[i].id;
                //console.log(datas.value()[i]);
                datas.value()[i][key] = value;
                var temp = datas.value()[i];
                //console.log(datas.value()[i]);
                //console.log("dataId",dataId);
                this.removeData(dataId);
                this.insertData(caseId, temp);
            }
        }catch (e) {
            console.log(e);
            return false
        }

        return true;


        //this.insertData(caseId,)

    }


    removeData(dataId) {

        this.setJson("modules.json");

        var modules = db.value();

        //var data;
        var datas = [];
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            //console.log(cases);

            //console.log(cases.value().length);

            for (var j = 0; j < cases.value().length; j++) {
                var kase = cases.get('[' + i + ']');

                datas = kase.get("datas");

                var temp = datas.find({id: dataId});
                //console.log(temp.value());

                if (temp != undefined && temp != null) {
                    //data = temp;
                    return datas.remove({id: dataId}).write();
                    break;
                }

            }


        }


    }


    updateData(object) {
        this.setJson("modules.json");

        var modules = db.value();

        var dataId = object.id;

        //var data;
        var datas = [];
        for (var i = 0; i < modules.length; i++) {
            var mymodule = db.get('[' + i + ']');

            var cases = mymodule.get("testCases");

            //console.log(cases);

            //console.log(cases.value().length);

            for (var j = 0; j < cases.value().length; j++) {
                var kase = cases.get('[' + i + ']');

                datas = kase.get("datas");

                var temp = datas.find({id: dataId});
                //console.log(temp.value());

                if (temp != undefined && temp != null) {
                    //data = temp;
                    datas.find({id: dataId}).assign(object).write();
                    break;
                }

            }


        }
    }


    //pageinfo


    getObjectPageInfo(){
        this.setJson("objectPages.json");

        var size = db.value().length;
        //console.log(size)
        var obj = new Object();
        obj.text = "root";

        var objectPages = new Array();
        for (var i = 0; i < size; i++) {
            var temp = db.get([i]).value();

            var myObjectPage = new Object();
            myObjectPage.id = temp.id;
            myObjectPage.text = temp.objectPageName;
            //console.log(temp.moduleId);
            //console.log(temp.moduleName);
            objectPages[i] = myObjectPage;
        }
        obj.children = objectPages;
        var result = new Array();
        result[0] = obj;
        return result
    }




    /*    getObjectPage(inputObjectPageName) {

            this.setJson("objectPages.json");

            var temp = new Object();
            temp.objectPageName = inputObjectPageName;
            console.log(temp)
            return (db.find(temp).value());
        }*/

    getObjectPage(id) {

        this.setJson("objectPages.json");

        var temp = new Object();
        temp.id = id;
        //console.log(temp)
        return (db.find(temp).get('objectElements').value());
    }



    insertObjectElement(objectPageId,object){
        this.setJson("objectPages.json");
        var temp = new Object();
        temp.id = objectPageId;
        //console.log(temp)
        var objectElements  = db.find(temp).get('objectElements');

        try {
            objectElements.insert(object).write();
        } catch (e) {
            console.log(e)
            return false;
        }

        return true;

    }



    removeObjectElement(objectElementId){
        this.setJson("objectPages.json");

        var objectElement;
        for(var i =0;i<db.value().length;i++){
            var objectElements  = db.get('['+i+']').get('objectElements');
            /* for(var i=0;i<objectElements.value().length;i++){
                 if(objectElements.get('['+i+']').value().id == objectElementId){
                     return objectElements.get('['+i+']').value();
                 }
             }*/
            return objectElements.remove({id: objectElementId}).write();
        }

    }

    ////异步用不了?
    // removeObjectElementByArray(array){
    // this.setJson("objectPages.json");

    // for(var i =0;i<array.length;i++){
    // return this.removeObjectElement(array[i].id);
    // }

    // }




    updateObjectElement(object){
        this.setJson("objectPages.json");

        var objectElement;
        for(var i =0;i<db.value().length;i++){
            var objectElements  = db.get('['+i+']').get('objectElements');
            /* for(var i=0;i<objectElements.value().length;i++){
                 if(objectElements.get('['+i+']').value().id == objectElementId){
                     return objectElements.get('['+i+']').value();
                 }
             }*/
            var temp = new Object();
            temp.id = object.id;

            return objectElements.find(temp).assign(object).write();
        }

    }




    insertObjectPage(object) {
        this.setJson("objectPages.json");

        var flag = false;
        try {
            db.insert(object).write();
        } catch (e) {
            console.log(e)
            return false;
        }

        return true;
    }


    removeObjectPage(id) {
        this.setJson("objectPages.json");

        return (db.remove({id: id}).write());
    }


    updateObjectPage(object) {
        this.setJson("objectPages.json");

        var temp = new Object();
        temp.objectPageName = object.objectPageName;
        return db.find(temp).assign(object).write();
    }



    /*  getGlobalDataInfo(){
          this.setJson("globalDatas.json");

          var size = db.value().length;
          //console.log(size)
          var obj = new Object();
          obj.text = "root";

          var globalDatas = new Array();
          for (var i = 0; i < size; i++) {
              var temp = db.get([i]).value();

              var myGlobalData = new Object();
              myGlobalData.id = temp.id;
              myGlobalData.text = temp.key;
              //console.log(temp.moduleId);
              //console.log(temp.moduleName);
              globalDatas[i] = myGlobalData;
          }
          obj.children = objectPages;
          var result = new Array();
          result[0] = obj;
          return result
      }*/


    getGlobalDataInfo(){
        this.setJson("globalDatas.json");

        return  db.value();
    }



    //返回gloabaldata信息
    getGlobalData(globaldataId) {
        this.setJson("globalDatas.json");

        console.log(db.value());
        var globaldata = _.getById(db.value(), globaldataId);
        return (globaldata);
    }


    insertGlobalData(object) {
        this.setJson("globalDatas.json");


        //console.log(db.get('[0]').value());
        var flag = false;
        try {
            db.insert(object).write();
        } catch (e) {
            console.log(e)
            return false;
        }

        return true;
    }


    /*
        //批量删除 按条件
        removeGlobalData(){
           return db.remove({ key: 'url22' })
                .write()
        }*/


    removeGlobalData(gloabalDataId) {

        this.setJson("globalDatas.json");

        return (db.remove({id: gloabalDataId}).write());
    }


    updateGlobalData(object) {
        this.setJson("globalDatas.json");

        var temp = new Object();
        temp.id = object.id;
        return (db.find(temp).assign(object).write());
    }


    //KeyWord



    getKeyWordInfo(){
        adapter = new FileSync('./config/keyWords.json');
        db = low(adapter)
        //console.log(lodashId)
        db._.mixin(lodashId)
        _.mixin(lodashId)

        return  db.value();
    }





    //project



    getProjectInfo(){
        adapter = new FileSync('./config/testPlanProject.json');
        db = low(adapter)
        //console.log(lodashId)
        db._.mixin(lodashId)
        _.mixin(lodashId)

        return  db.value();
    }



    //返回gloabaldata信息
    getProject(projectId) {
        adapter = new FileSync('./config/testPlanProject.json');
        db = low(adapter)
        //console.log(lodashId)
        db._.mixin(lodashId)
        _.mixin(lodashId)

        console.log(db.value());
        var projectData = _.getById(db.value(), projectId);
        return projectData;
    }


    insertProject(object) {
        adapter = new FileSync('./config/testPlanProject.json');
        db = low(adapter)
        //console.log(lodashId)
        db._.mixin(lodashId)
        _.mixin(lodashId)


        //console.log(db.get('[0]').value());
        var flag = false;
        try {
            db.insert(object).write();
        } catch (e) {
            console.log(e)
            return false;
        }

        return true;
    }




    removeProject(projectId) {

        adapter = new FileSync('./config/testPlanProject.json');
        db = low(adapter)
        //console.log(lodashId)
        db._.mixin(lodashId)
        _.mixin(lodashId)

        return (db.remove({id: projectId}).write());
    }


    updateProject(object) {
        adapter = new FileSync('./config/testPlanProject.json');
        db = low(adapter)
        //console.log(lodashId)
        db._.mixin(lodashId)
        _.mixin(lodashId)


        var temp = new Object();
        temp.id = object.id;
        return (db.find(temp).assign(object).write());
    }







    createFile(fileDir,fileName,text){
        // fs.writeFile("./data/test/test.json","[]",'utf8',function(error){
        fs.writeFile(fileDir+fileName,text,'utf8',function(error){
            if(error){
                throw error;
            }
        });
    }

    createFileDirectory(fileDir){
        if(!fs.existsSync(fileDir)){
        // if(!fs.existsSync("./data/test")){
            fs.mkdirSync(fileDir);
        }
    }


    createProject(projectName){

        console.log(this.setProjectName(projectName));
        console.log(this.createFileDirectory(dataPath+projectName));
        console.log(this.createFile(dataPath+projectName+"/","globalDatas.json","[]"));
        console.log(this.createFile(dataPath+projectName+"/","modules.json","[]"));
        console.log(this.createFile(dataPath+projectName+"/","objectPages.json","[]"));
    }

    updateFileDirectory(fileDir,newFileDir){
        console.log(fs.existsSync(fileDir));
        if(fs.existsSync(fileDir)){
            // if(!fs.existsSync("./data/test")){
            console.log("1");
            fs.renameSync(fileDir,newFileDir);
        }
    }





    test() {

        // this.createFileDirectory("./data/test");
        // this.createFile("./data/test/","test.json","[]");

        //db=changeJson('db.json');
        // adapter = new FileSync('testPlanProject.json')
        // db = low(adapter)
        // console.log(db.get('testPlanProjectName').value());
        //console.log(lodashid.getById(testdata.posts, 1));




    }


}


//export default DataSource
module.exports = DataSource;

/*module.exports = {
    DataSource : DataSource,
    getDataSource: function(inputProjectName) {
        projectName  = inputProjectName;
        return DataSource;
    }
}*/

// module.exports.getDataSource  function(inputProjectName,inputJsonfile) {
//       adapter = new FileSync('./'+inputProjectName+'/'+inputJsonfile)
//         db = low(adapter)
//         //console.log(lodashId)
//         db._.mixin(lodashId)
//         _.mixin(lodashId)
// 		return DataSource;
// };
