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