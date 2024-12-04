// 插件物料模式，将每个 物料 当作一个插件创建，参考webpack插件类形式
class Component {
    constructor(config) {
        this.label = config.label;
        this.category = config.category;
        this.key = config.key;
        this.weight = config.weight;
        this.model = config.model;
    }
    render() {
        return null
    }
    preview() {
        return null
    }
    props() {
        return null
    }
}


export default Component

/* config说明
    1. label: 物料名称 
    2. category: 物料分类，数组，具体类别见 ./index.js
    3. key: 物料唯一标识，一般填写物料英文，使用小驼峰命名
    4. weight: 物料权重，用于标识在分类中的前后，越大越前面

*/