import Component from "../../base";
import {
    createInputProp,
    createSelectProp
} from "../../prop";

class Button extends Component {
    constructor(config) {
        super(config);
    }
    preview() {
        return h(ElButton, {
            size: 'small'
        }, () => "确认");
    }
    render({ props, size: resize }) {
        return h(ElButton, {
            type: props.type,
            size: props.size,
            style: {
                width: resize.width + 'px',
                height: resize.height + 'px'
            }
        }, () => props.text || '按钮');
    }
    props() {
        return {
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
        };
    }
}

const config = {
    label: "按钮",
    category: [1],
    key: "button",
    weight: 1 >> 6,
}

const buttonComponent = new Button(config);

export {
    buttonComponent
}