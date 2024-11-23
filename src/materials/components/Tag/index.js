import Component from "../../base";
import {
    createSelectProp,
    createInputProp
} from "../../prop";

class Tag extends Component {
    constructor(config) {
        super(config);
    }
    preview() {
        return h(ElTag, { size: 'small' }, () => '标签');
    }
    render({ props }) {
        return h(ElTag, {
            size: props.size,
            type: props.type,
        }, () => props.content);
    }
    props() {
        return {
            type: createSelectProp('标签类型', [
                { label: '基础', value: 'primary' },
                { label: '成功', value: 'success' },
                { label: '信息', value: 'info' },
                { label: '警告', value: 'warning' },
                { label: '危险', value: 'danger' },
            ]),
            size: createSelectProp('标签大小', [
                { label: '小', value: 'small' },
                { label: '中等', value: 'medium' },
                { label: '大', value: 'large' },
            ]),
            content: createInputProp('标签内容'),
        };
    }
}

const config = {
    label: "标签",
    category: [1],
    key: "tag",
    weight: 1 >> 1,
}

const tag = new Tag(config);

export {
    tag
}