
/*
 *列表区可以显示所有物料，key对应所有组件的映射关系
 */


function createEditorConfig() {
  // 物料列表
  const componentList = [];
  const componentMap = {};
  const register = (component) => {
    componentList.push(component);
    componentMap[component.key] = component;
  };
  const category = [
    { title: '常用', id: 0 },
    { title: '基础组件', id: 1 },
    { title: '业务组件', id: 2 },
    { title: '布局组件', id: 3 },
    { title: '功能组件', id: 4 },
    { title: '展示组件', id: 5 },
    { title: '数据组件', id: 6 },
    { title: '静态组件', id: 7 },
    { title: '动态组件', id: 8 },
    { title: '通用组件', id: 9 },
    { title: '定制组件', id: 10 },
  ]
  return {
    register,
    category,
    componentList,
    componentMap,
  };
}

export let registerConfig = createEditorConfig();

// 书写工厂函数便于配置
const createInputProp = (label) => ({ type: 'input', label })
const creatColorProp = (label) => ({ type: 'color', label })
const createSelectProp = (label, options) => ({ type: 'select', label, options })
const createTableProp = (label, table) => ({ type: 'table', label, table })


registerConfig.register({
  label: "文本",
  category: [1],
  preview: () => "普通文本",
  render: ({ props }) => h("span",
    {
      style: {
        color: props.color,
        fontSize: props.size
      },
      size: "small"

    },
    props.text || '请设置文本内容'),
  key: "text",
  props: {
    text: createInputProp('文本内容'),
    color: creatColorProp('字体颜色'),
    size: createSelectProp('字体大小', [
      { label: '小', value: '14px' },
      { label: '中', value: '20xp' },
      { label: '大', value: '24px' },
    ])
  },
  model: {}
});
registerConfig.register({
  label: "按钮",
  category: [1],
  resize: {
    width: true,
    height: true,//竖向也可以更改
  },
  preview: () => h(ElButton, {
    size: 'small'
  }, () => "确认"),
  render: ({ props, size: resize }) => h(ElButton, {
    type: props.type,
    size: props.size,
    style: {
      width: resize.width + 'px',
      height: resize.height + 'px'
    }
  }, () => props.text || '渲染按钮'),
  key: "button",
  props: {
    text: createInputProp('按钮内容'),
    type: createSelectProp('按钮类型', [
      { label: '文本', value: 'text' },
      { label: '默认', value: 'default' },
      { label: '基础', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '信息', value: 'info' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
    ]),
    size: createSelectProp('按钮大小', [
      { label: '小', value: 'small' },
      { label: '中等', value: 'medium' },
      { label: '大', value: 'large' },
    ])
  },
  model: {}
});
registerConfig.register({
  label: "输入框",
  category: [1],
  resize: {
    width: true, // 可以更改横向大小
  },
  preview: () => h(ElInput, {
    placeholder: "输入框",
    size: 'small'
  }, () => "我是预览输入框"),
  render: ({ size: resize }) => h(ElInput, {
    placeholder: "请输入内容",
    style: {
      width: resize.width + 'px'
    }
  }, () => "渲染输入框"),
  key: "input",
  model: {
    default: '绑定字段'
  }
});
//下拉框
registerConfig.register({
  label: '下拉框',
  category: [1],
  preview: () => h(ElSelect, {
    placeholder: '下拉框',
    size: 'small'
  }, () => '预览下拉框'),
  render: ({ props }) => h(ElSelect, {
    placeholder: props.text || '请设置下拉框预览内容',
    style: "width: 200px"
  },
    () => (props.options || []).map((opt, index) => {
      return h(ElOption, { label: opt.label, value: opt.value, key: index })
    }
    )),
  key: 'select',
  model: {
    default: '绑定字段'
  },
  props: {
    options: createTableProp(
      '下拉选项',
      {
        options: [
          { label: '绑定值', field: 'value' },
          { label: '显示值', field: 'label' }
        ],
        key: 'label',
      },

    ),
    text: createInputProp('下拉框预览'),
  }
})
//单选框
registerConfig.register({
  label: '单选框',
  category: [1],
  preview: () => h(ElRadio, {
    label: '单选框',
    size: 'small'
  }, () => '单选框'),
  render: ({ props }) => h(ElRadioGroup, {},
    () => (props.options || [{ label: "默认选项1", value: "1" }]).map((opt, index) => {
      return h(ElRadio, { value: opt.value, key: index, size: props.size }, () => opt.label);
    })
  ),
  
  key: 'radio',
  model: {
    default: '绑定字段'
  },
  props: {
    options: createTableProp(
      '单选选项',
      {
        options: [
          { label: '绑定值', field: 'value' },
          { label: '显示值', field: 'label' }
        ],
        key: 'label',
      },
    ),
    size: createSelectProp('选项大小', [
      { label: '小', value: 'small' },
      { label: '中等', value: 'medium' },
      { label: '大', value: 'large' },
    ]),
  }
})
//tag
registerConfig.register({
  label: '标签',
  category:[1],
  preview: () => h(ElTag, {
    size:'small'  
  },()=>'标签'),
  render: ({props}) => h(ElTag, {
    size:props.size,
    type:props.type,
  },()=>props.content),
  key: 'tag',
  props:{
    type:createSelectProp('标签类型',[
      { label: '基础', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '信息', value: 'info' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
    ]),
    size:createSelectProp('标签大小',[
      { label: '小', value: 'small' },
      { label: '中等', value: 'medium' },
      { label: '大', value: 'large' },
    ]),
    content:createInputProp('标签内容'),
  },
  model:{
  },

})
//开关
registerConfig.register({
  label: "开关",
  category:[1],
  preview: () => h(ElSwitch, {
    size:'small'  
  }),
  render: ({props}) => h(ElSwitch, {
    size:props.size,
    'active-text':props.activeText,
  }),
  key: "switch",
  props:{
    size:createSelectProp('按钮大小',[
      { label: '小', value: 'small' },
      { label: '中等', value: 'medium' },
      { label: '大', value: 'large' },
    ]),
    activeText:createInputProp('文字'),
  },
  model:{

  }
})