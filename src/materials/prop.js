// 书写工厂函数便于配置
const createInputProp = (label) => ({type: 'input', label})
const creatColorProp = (label) => ({type: 'color', label})
const createSelectProp = (label, options) => ({type: 'select', label, options})
const createTableProp = (label, table) => ({type: 'table', label, table})

export {
    createInputProp,
    creatColorProp,
    createSelectProp,
    createTableProp
}