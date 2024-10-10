// 定义一个将 Vue 响应式对象转换为普通 JavaScript 对象的函数
const _vueToObject = (obj) => {
if (obj == null) return {};
if (Array.isArray(obj)) {
    return obj.map(item => _vueToObject(item));
}
if (typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
        result[key] = _vueToObject(obj[key]);
    }
    }
    return result;
}
return obj;
};
/**
 * 更新对象
 * @param {IndexedDBHelp} help 访问数据库的实例
 * @param {string} storeName 仓库名称（表名）
 * @param {Object} model 对象
 * @param {IDBTransaction} tranRequest 如果使用事务的话，需要传递开启事务时创建的连接对象
 * @returns 更新结果
 */
export default function updateModel(help, storeName, model, tranRequest = null) {
  // 取对象的原型，便于保存 reactive
  const _model = _vueToObject(model);

  // 定义一个 Promise 的实例
  return new Promise((resolve, reject) => {
    // 定义个函数，便于调用
    const _update = (__tran) => {
      const store = __tran.objectStore(storeName);
      const request = store.put(_model); // 更新对象
      request.onsuccess = (event) => {
        resolve(event.target.result); // 返回更新结果
      };
      request.onerror = (event) => {
        reject(event.target.error); // 失败抛出错误
      };
    };

    if (tranRequest === null) {
      help.beginWrite([storeName]).then((tran) => {
        // 自己开一个事务
        _update(tran);
      });
    } else {
      // 使用传递过来的事务
      _update(tranRequest);
    }
  });
}