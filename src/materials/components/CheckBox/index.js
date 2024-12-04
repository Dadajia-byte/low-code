import Component from "../../base";
import {
    createTableProp,
    createSelectProp
} from "../../prop";

class CheckBox extends Component {
    constructor(config) {
        super(config);
    }
    preview() {
        return h(ElCheckbox, {
            label: '多选框',
            size: 'small',
        }, () => '多选框');
    }
    render({ props }) {
        return h(ElCheckboxGroup, {
        }, () => (props.options || [{ label: "默认选项1", value: "1" }]).map(opt => {
            return h(ElCheckbox, { value: opt.value, size: props.size, label: opt.label },);
        })
        );
    }
    props() {
        return {
            options: createTableProp(
              '多选选项',
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
    label: "多选框",
    category: [1],
    key: "checkbox",
    weight: 1 >> 5,
}

const checkboxComponent = new CheckBox(config);

export {
    checkboxComponent
}