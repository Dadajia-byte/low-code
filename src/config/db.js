export const dbInfo = {
  dbFlag: 'project-meta-db', // 数据库标识，区分不同的数据库。如果项目里只有一个，那么不需要加这个标识
  dbConfig: {
    dbName: 'low-code', // 数据库名称
    ver: 2
  },
  stores: { // 数据库里的表（对象仓库）
    moduleMeta: { // 模块的meta {按钮,列表,分页,查询,表单若干}
      id: 'moduleId',
      index: {},
      isClear: false
    },
    menuMeta: { // 菜单用的meta
      id: 'menuId',
      index: {},
      isClear: false
    },
    serviceMeta: { // 后端API的meta，在线演示用。
      id: 'moduleId',
      index: {},
      isClear: false
    }
  },
  init: (help) => {
    // 数据库建立好了
    console.log('inti事件触发：indexedDB 建立完成 ---- help：', help)
  }
}
