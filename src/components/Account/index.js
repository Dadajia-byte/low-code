import {h,render} from 'vue'
import Account from './index.vue'
let vnode;
export function $Account(option) {
    if (!vnode) {
        let el = document.createElement('div');
        vnode = h(Account,{option});
        render(vnode,el);
        document.body.appendChild(el);
    }

    let { show } = vnode.component.exposed;
    show(option);
}