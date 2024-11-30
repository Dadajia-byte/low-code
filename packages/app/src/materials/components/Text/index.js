import Component from "../../base";
import {
    createColorProp,
    createInputProp,
    createSelectProp
} from "../../prop";

class Text extends Component {
    constructor(config) {
        super(config);    
    }
    preview() {
        return '普通文本'
    }
    render({ props }) {
        return h("span", {
            style: {
                color: props.color,
                fontSize: props.size
            },
            size: "small"
        }, props.text || '请设置文本内容');
    }
    props() {
        return {
            text: createInputProp('文本内容'),
            color: createColorProp('字体颜色'),
            size: createSelectProp('字体大小', [
                {label: '小', value: '14px'},
                {label: '中', value: '20px'},
                {label: '大', value: '24px'},
            ])
        }
    }
}

const config = {
    label: "文本",
    category: [1],
    key: "text",
    weight: 1,
}

// 后续拓展可以新写几个别的Text类覆盖preview和render，然后再写几个config
const textComponent = new Text(config);

export {
    textComponent,
}