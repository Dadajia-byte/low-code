
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
  return {
    register,
    componentList,
    componentMap,
  };
}

export let registerConfig = createEditorConfig();

// 书写工厂函数便于配置
const createInputProp = (label)=>({type:'input',label})
const creatColorProp = (label) =>({type:'color',label})
const createSelectProp = (label,options)=>({type:'select',label,options})
const createTableProp = (label,table)=>({type:'table',label,table})

registerConfig.register({
  label: "预览文本",
  preview: () => "我是预览文本",
  render: ({props}) => h("span", 
    {
      style:{
        color:props.color,
        fontSize:props.size
      },
    }, 
    props.text || '渲染文本'),
  key: "text",
  props:{
    text:createInputProp('文本内容'),
    color:creatColorProp('字体颜色'),
    size:createSelectProp('字体大小',[
      { label: '小', value: '14px' },
      { label: '中', value: '20xp' },
      { label: '大', value: '24px' },
    ])
  },
  model:{}
});
registerConfig.register({
  label: "按钮",
  preview: () => h(ElButton, {}, ()=>"我是预览按钮"),
  render: ({props}) => h(ElButton, {
    type: props.type,
    size: props.size,
  }, ()=>props.text || '渲染按钮'),
  key: "button",
  props:{
    text:createInputProp('按钮内容'),
    type:createSelectProp('按钮类型',[
      { label: '文本', value: 'text' },
      { label: '默认', value: 'default' },
      { label: '基础', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '信息', value: 'info' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
    ]),
    size:createSelectProp('按钮大小',[
      { label: '小', value: 'small' },
      { label: '中等', value: 'medium' },
      { label: '大', value: 'large' },
    ])
  },
  model:{}
});
registerConfig.register({
  label: "输入框",
  preview: () => h(ElInput, { placeholder: "请输入内容" }, ()=>"我是预览输入框"),
  render: () =>  h(ElInput, { placeholder: "请输入内容"}, ()=>"渲染输入框"),
  key: "input",
  model:{ 
    default:'绑定字段'
  }
});

registerConfig.register({
  label:'下拉框',
  preview:()=>h(ElSelect,{modelValue:''},()=>'预览下拉框'),
  render:({props})=>h(ElSelect,{},()=>'渲染下拉框'),
  key:'select',
  model:{ 
    default:'绑定字段'
  },
  props:{
    options:createTableProp(
      '下拉选项',
      {
        options:[
          {label:'绑定值',field:'value'},
          {label:'显示值',field:'label'}
        ],
        key:'label',
      },
      
    )
  }
})

