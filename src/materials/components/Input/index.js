import Component from "../../base";


class Input extends Component {
    constructor(config) {
        super(config);
    }
    preview() {
        return h(ElInput, {
            placeholder: "输入框",
            size: 'small'
        }, () => "我是预览输入框");
    }
    render({ size: resize }) {
        return h(ElInput, {
            placeholder: "请输入内容",
            style: {
                width: resize.width + 'px'
            }
        }, () => "渲染输入框");
    }
    props() {
        return {
        };
    }
}

const config = {
    label: "输入框",
    category: [1],
    key: "input",
    weight: 1 >> 2,
    model: {
        default: '绑定字段'
    },
}

const inputComponent = new Input(config);

export {
    inputComponent
}