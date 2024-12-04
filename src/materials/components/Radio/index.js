import Component from "../../base";
import {
    createTableProp,
    createSelectProp
} from "../../prop";

class Radio extends Component {
    constructor(config) {
        super(config);
    }
    preview() {
        return h(ElRadio, {
            label: '单选框',
            size: 'small'
        }, () => '单选框');
    }
    render({ props }) {
        return h(ElRadioGroup, {},
            () => (props.options || [{ label: "默认选项1", value: "1" }]).map((opt) => {
                return h(ElRadio, { value: opt.value, size: props.size }, () => opt.label);
            })
        );
    }
    props() {
        return {
            options: createTableProp(
              '单选选项',
              {
                options: [
                  { label: '绑定值', field: 'value' },
                  { label: '显示值', field: 'label' }
                ],
                key: 'label',
              },
            ),
            size: createSelectProp('选项大小', [
              { label: '小', value: 'small' },
              { label: '中等', value: 'medium' },
              { label: '大', value: 'large' },
            ]),
          };
    }
}

const config = {
    label: "单选框",
    category: [1],
    key: "radio",
    weight: 1 >> 4,
}

const radioComponent = new Radio(config);

export {
    radioComponent
}