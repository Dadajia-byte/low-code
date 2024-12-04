import Component from "../../base";
import {
    createTableProp,
    createInputProp
} from "../../prop";

class Select extends Component {
    constructor(config) {
        super(config);
    }
    preview() {
        return h(ElSelect, {
            placeholder: '下拉框',
            size: 'small'
        }, () => '预览下拉框');
    }
    render({ props }) {
        return h(ElSelect, {
            placeholder: props.text || '请设置下拉框预览内容',
            style: "width: 200px"
        },
            () => (props.options || []).map((opt) => {
                return h(ElOption, { label: opt.label, value: opt.value })
            }
            ));
    }
    props() {
        return {
            options: createTableProp(
                '下拉选项',
                {
                    options: [
                        { label: '绑定值', field: 'value' },
                        { label: '显示值', field: 'label' }
                    ],
                    key: 'label',
                },

            ),
            text: createInputProp('下拉框预览'),
        };
    }
}

const config = {
    label: "下拉框",
    category: [1],
    key: "select",
    weight: 1 >> 3,
}

const selectComponent = new Select(config);

export {
    selectComponent
}