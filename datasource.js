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
  serialize: (data) => encrypt(JSON.stringify(data)),
  deserialize: (data) => JSON.parse(decrypt(data))

 */
const _ = require('lodash');
const lodashId = require('lodash-id');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')



/*const adapter = new FileSync('db.json')
const db = low(adapter)*/


var adapter = new FileSync('db.json')
var db = low(adapter)
db._.mixin(lodashId)

class DataSource{
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
    changeJson(jsonfile) {
        adapter = new FileSync(jsonfile)
        db = low(adapter)
        db._.mixin(lodashId)
        return db.value();
    }

    //返回当前json
    getJson() {
        return db.value();
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

    getAllValuesByKey(array,key) {
        return _.map(array, key)
    }



    //根据 条件查找数组
/*    如 var array  = [
        {id: 0, name: "aaa", age: 33},
        {id: 1, name: "bbb", age: 25}
    ]
    getFromArrayByAttr(array,'age',33)
    bar = {id: 0, name: "aaa", age: 33}*/
    findByAttr(array,attr,attrValue) {
        return _.find(array, [attr, attrValue]);
    }

    findByAttr(attr,attrValue) {
        return _.find(db.value(), [attr, attrValue]);
    }






    //查  根据条件获取对象
/*    var object = { 'a': [{ 'b': { 'c': 3 } }] };

    getFromObject(object, 'a[0].b.c');
    // => 3

    getFromObject(object, ['a', '0', 'b', 'c']);
    // => 3*/
    getValue(obj,path){
        //console.log(db)
        return _.get(obj,path)
    }



    getValue(path){
        //console.log(db)
        return db.get(path).value()
    }



    //获取数组中数量或者对象中的key value数量
    getCount(path){
       return db.get(path)
            .size()
            .value()
    }





    //改  根据条件获取对象的值 返回的是整个object对象



    setValue(path,value) {
        return db.set(path, value).write()
    }


    //删 移除属性
    removeAttr(path){
        return db.unset(path)
            .write()
    }

    //增  插入对象到数组中
    insertObjToArray(path,Obj){
        return  db.get(path)
            .push(Obj)
            .write()

    }

    //判断是否存在
    isExist(path){
       return db.has(path)
            .value()
    }


    test() {
        //db=changeJson('db.json');
        adapter = new FileSync('testPlanProject.json')
        db = low(adapter)
        console.log(db.get('testPlanProjectName').value());
        //console.log(lodashid.getById(testdata.posts, 1));
    }





}





//export default DataSource
module.exports = DataSource;
