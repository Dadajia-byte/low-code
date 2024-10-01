import {h,render} from 'vue'
import Login from './index.vue'
let vnode;
export function $Login(option) {
    if (!vnode) {
        let el = document.createElement('div');
        vnode = h(Login,{option});
        render(vnode,el);
        document.body.appendChild(el);
    }

    let { show } = vnode.component.exposed;
    show(option);
}