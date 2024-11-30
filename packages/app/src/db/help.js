import _beginTran from './begin-tran.js'
import _addModel from './model-add.js'
import _deleteModel from './deleteModel.js'
import _queryModel from './queryModel.js'
import _updateModel from './updateModel.js'

/**
 * indexedDB 的 help，基础功能的封装
 * * 打开数据库，建立对象仓库，获取连接对象，实现增删改查
 * * info 的结构：
 * * * dbFlag: '' // 数据库标识，区别不同的数据库
 * * * dbConfig: { // 连接数据库
 * * * * dbName: '数据库名称',
 * * * * ver: '数据库版本',
 * * * },
 * * * stores: {
 * * * * storeName: { // 对象仓库名称
 * * * * * id: 'id', // 主键名称
 * * * * * index: { // 可以不设置索引
 * * * * * * name: ture, // key：索引名称；value：是否可以重复
 * * * * * }
 * * * * }
 * * * },
 * * * init: (help) => {} // 完全准备好之后的回调函数
 */
export default class IndexedDBHelp {
    constructor(info) {
        this.myIndexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB
        if (!this.myIndexedDB) {
            console.log('您的浏览器不支持IndexedDB')
        }
        // 数据库名称和版本号
        this._info = {
            dbName: info.dbConfig.dbName,
            ver: info.dbConfig.ver
        }
        // 记录连接数据库的对象， IDBDatabase 类型，因为open是异步操作，所以不能立即获得。
        this._db = null

        // 记录仓库状态。new：新库或者版本升级后；old：有对象仓库了。
        this._storeState = 'pending'

        /**
         * 注册回调事件。
         * * 如果组件读写 indexedDB 的时还没有准备好的话，
         * * 可以来注册一个事件，等准备好了之后回调。
         */
        this._regCallback = []

        // 打开数据库，异步操作，大概需要几毫秒的时间。
        this.dbRequest = this.myIndexedDB.open(this._info.dbName, this._info.ver)

        // 第一次，或者版本升级时执行，根据配置信息建立表
        this.dbRequest.onupgradeneeded = (event) => {
            this._storeState = 'new'
            const db = event.target.result
            // console.log('【2】新建或者升级数据库 onupgradeneeded --- ', db)

            for (const key in info.stores) {
                const store = info.stores[key]
                if (db.objectStoreNames.contains(key)) {
                    // 已经有仓库，验证一下是否需要删除原来的仓库
                    if (store.isClear) {
                        // 删除原对象仓库，没有保存数据
                        db.deleteObjectStore(key)
                        // 建立新对象仓库
                        const objectStore = db.createObjectStore(key, {keyPath: store.id})
                        // 建立索引
                        for (const key2 in store.index) {
                            const unique = store.index[key2]
                            objectStore.createIndex(key2, key2, {unique: unique})
                        }
                    }
                } else {
                    // 没有对象仓库，建立
                    const objectStore = db.createObjectStore(key, {keyPath: store.id}) /* 自动创建主键 autoIncrement: true */
                    // 建立索引
                    for (const key2 in store.index) {
                        const unique = store.index[key2]
                        objectStore.createIndex(key2, key2, {unique: unique})
                    }
                }
            }
        }

        // 数据库打开成功，记录连接对象
        this.dbRequest.onsuccess = (event) => {
            this._db = event.target.result // dbRequest.result
            // console.log('【1】成功打开数据库 onsuccess --- ', this._db)
            // 修改状态
            if (this._storeState === 'pending') {
                this._storeState = 'old'
            }
            // 调用初始化的回调
            if (typeof info.init === 'function') {
                info.init(this)
            }
            // 调用组件注册的回调
            this._regCallback.forEach(fn => {
                if (typeof fn === 'function') {
                    fn()
                }
            })
        }

        // 处理出错信息
        this.dbRequest.onerror = (event) => {
            // 出错
            console.log('打开数据库出错：', event.target.error)
        }
    }

    // 挂载其他操作
    // 读写事务
    beginWrite(storeName) {
        return _beginTran(this, storeName, 'readwrite')
    }

    // 只读事务
    beginRead(storeName) {
        return _beginTran(this, storeName, 'readonly')
    }

    // 添加数据
    addModel(storeName, model, tranRequest = null) {
        return _addModel(this, storeName, model, tranRequest = null)
    }

    // 删除数据
    deleteModel(storeName, model, tranRequest = null) {
        return _deleteModel(this, storeName, model, tranRequest = null)
    }

    // 查询数据
    queryModel(storeName, model, tranRequest = null) {
        return _queryModel(this, storeName, model, tranRequest = null)
    }

    // 更新数据
    updateModel(storeName, model, tranRequest = null) {
        return _updateModel(this, storeName, model, tranRequest = null)
    }
}
