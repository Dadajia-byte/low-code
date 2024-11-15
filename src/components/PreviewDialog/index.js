import {createVNode, render} from "vue";
import PreviewDialog from "./index.vue"

let vnode;

export function $previewDialog(option) {
    if (!vnode) {
        let el = document.createElement('div');
        vnode = createVNode(PreviewDialog, {option});
        render(vnode, el);
        document.body.appendChild(el);
    }

    let {showDialog} = vnode.component.exposed;
    showDialog(option);
}