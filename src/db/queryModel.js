/**
 * 查询对象
 * @param {IndexedDBHelp} help 访问数据库的实例
 * @param {string} storeName 仓库名称（表名）
 * @param {any} key 主键值
 * @param {IDBTransaction} tranRequest 如果使用事务的话，需要传递开启事务时创建的连接对象
 * @returns 查询结果
 */
export default function queryModel(help, storeName, key, tranRequest = null) {
  // 定义一个 Promise 的实例
  return new Promise((resolve, reject) => {
    // 定义个函数，便于调用
    const _query = (__tran) => {
      const store = __tran.objectStore(storeName);
      const request = store.get(key); // 查询对象
      request.onsuccess = (event) => {
        resolve(event.target.result); // 返回查询结果
      };
      request.onerror = (event) => {
        reject(event.target.error); // 失败抛出错误
      };
    };

    if (tranRequest === null) {
      help.beginRead([storeName]).then((tran) => {
        // 自己开一个事务
        _query(tran);
      });
    } else {
      // 使用传递过来的事务
      _query(tranRequest);
    }
  });
}