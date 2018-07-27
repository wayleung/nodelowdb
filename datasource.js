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

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

/*const adapter = new FileSync('db.json')
const db = low(adapter)*/


var adapter = new FileSync('db.json')
var db = low(adapter)


function DataSource(){

    this.queryValueByKey =  function(key){
        //console.log(db)
        return db.get(key).value()
    };
    
    this.selectJason = function (jsonfile) {
        adapter = new FileSync(jsonfile)
        db = low(adapter)
    }


}





//export default DataSource
module.exports = DataSource;
