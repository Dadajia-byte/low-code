import { createVNode,render } from "vue";
import DropdownComponent from "./index.vue";
let vnode;
export function $dropdown(option) {
    if(!vnode) {
        let el = document.createElement('div');
        vnode = createVNode(DropdownComponent,{option});
        render(vnode,el);
        document.body.appendChild(el);
    }
    let {showDropdown} = vnode.component.exposed;
    showDropdown(option);
}