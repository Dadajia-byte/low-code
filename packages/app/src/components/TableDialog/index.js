import {createVNode, render} from "vue";
import TableDialog from "./index.vue"

let vnode;

export function $tableDialog(option) {
    if (!vnode) {
        let el = document.createElement('div');
        vnode = createVNode(TableDialog, {option});
        render(vnode, el);
        document.body.appendChild(el);
    }

    let {show} = vnode.component.exposed;
    show(option);
}