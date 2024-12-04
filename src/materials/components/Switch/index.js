import Component from "../../base";
import {
    createInputProp,
    createSelectProp
} from "../../prop";

class Switch extends Component {
    constructor(config) {
        super(config);
    }
    preview() {
        return h(ElSwitch, {
            size:'small'  
          });
    }
    render({ props }) {
        return  h(ElSwitch, {
            size:props.size,
            'active-text':props.activeText,
          });
    }
    props() {
        return{
            size:createSelectProp('按钮大小',[
              { label: '小', value: 'small' },
              { label: '中等', value: 'medium' },
              { label: '大', value: 'large' },
            ]),
            activeText:createInputProp('按钮提示'),
          };
    }
}

const config = {
    label: "开关",
    category: [1],
    key: "switch",
    weight: 1 >> 5,
}

const switchComponent = new Switch(config);

export {
    switchComponent
}