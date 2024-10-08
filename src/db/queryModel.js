export default function getModel(storeName, keyPathValue = null, indexName = null, indexValue = null, tranRequest = null) {
  return new Promise((resolve, reject) => {
    const _query = (__tran) => {
      let objectStore;
      if (indexName && indexValue) {
        objectStore = __tran.objectStore(storeName).index(indexName);
        const request = objectStore.get(indexValue);
        request.onsuccess = (event) => resolve(event.target.result);
      } else if (keyPathValue !== null) {
        objectStore = __tran.objectStore(storeName);
        const request = objectStore.get(keyPathValue);
        request.onsuccess = (event) => resolve(event.target.result);
      } else {
        objectStore = __tran.objectStore(storeName);
        const request = objectStore.openCursor();
        const results = [];
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            results.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
      }
      request.onerror = (err) => reject(err);
    };

    if (tranRequest === null) {
      this.beginRead([storeName]).then((__tran) => _query(__tran));
    } else {
      _query(tranRequest);
    }
  });
}