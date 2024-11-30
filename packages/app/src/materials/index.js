class EditorConfig {
    constructor() {
        this.componentList = [];
        this.componentMap = {};
        this.category = [
            {title: '常用', id: 0},
            {title: '基础组件', id: 1},
            {title: '业务组件', id: 2},
            {title: '布局组件', id: 3},
            {title: '功能组件', id: 4},
            {title: '展示组件', id: 5},
            {title: '数据组件', id: 6},
            {title: '静态组件', id: 7},
            {title: '动态组件', id: 8},
            {title: '通用组件', id: 9},
            {title: '定制组件', id: 10},
        ];
    }

    register(component) {
        this.componentList.push(component);
        this.componentMap[component.key] = component;
    }
}

const editorConfig = new EditorConfig();

export let registerConfig = editorConfig;
// 使用 Vite 的 import.meta.glob 动态导入并注册组件
async function registerComponents() {
    const modules = import.meta.glob('./components/**/index.js');
    for (const [path, loadModule] of Object.entries(modules)) {
        try {
            const module = await loadModule();
            const componentNames = Object.keys(module)
            componentNames.forEach(componentName =>{                
                // 要求必须是具名导出，而且如果导出的是物料必须以Component结尾这样才能注册
                if (componentName.endsWith('Component')) registerConfig.register(module[componentName]);
            })
        } catch (error) {
            console.error(`加载并注册 ${path} 组件失败:`, error);
        }
    }
}
// 调用注册组件的函数
await registerComponents();

