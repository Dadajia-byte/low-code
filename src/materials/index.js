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
            const componentName = Object.keys(module)[0]; // 假设每个文件只有一个默认导出或命名导出
            const component = module[componentName];
            registerConfig.register(component);
        } catch (error) {
            console.error(`加载并注册 ${path} 组件失败:`, error);
        }
    }
}
// 调用注册组件的函数
await registerComponents();

