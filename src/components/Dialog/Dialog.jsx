/*
动态挂载组件，区别与直接写组件：
具体区别如下：

1. 动态挂载组件：

    传统组件：需要在 Vue 模板里直接使用 <ElDialog />，并通过传递 props 和 v-model 来控制显示状态。
    动态组件：通过 $dialog() 函数动态创建 DialogComponent 组件实例，挂载到 DOM 中。当需要显示对话框时，你只需调用这个函数，Vue 会自动把组件挂载到页面的 body 上并显示它。

2. 无需固定位置：

    传统组件：需要在 Vue 的模板中提前放置组件的位置。
    动态组件：组件的创建和挂载完全是动态的，不需要在模板中固定位置。

3. 灵活性更高：

    你可以在任何逻辑代码中调用 $dialog() 来展示对话框，适用于那些需要根据用户操作或异步数据返回后再动态生成和展示对话框的场景。

4. 封装性：

    通过 ctx.expose 你暴露了组件内部的方法（比如 showDialog），外界可以通过 VNode.component.exposed 来访问组件的这些方法。这种封装提供了更灵活的组件控制方式。

这种方式类似于使用服务（service）模式来创建组件，像 this.$message() 或者 this.$confirm() 的实现。
 */
// 该文件是jsx写法，仅作示例
import {ElDialog} from "element-plus"
import { createVNode, defineComponent, reactive, render } from "vue"

const DialogComponent = defineComponent({
    props:{
        option:{type:Object}
    },
    setup(props,ctx){
        const state = reactive({
            isShow:false
        })
        ctx.expose({ // 让外界可以调用里面的方法
            showDialog(option){
                state.isShow = true
            }
        })
        return ()=>{
            return 
            <ElDialog v-model={state.isShow}>
            </ElDialog>
        }
    }
})
let VNode;
export function $dialog(option) {
    // element-plus 中是有el-dialog组件的
    // 手动挂载组件 new SubComponent.$mount()
    let el = document.createElement('div');
    VNode = createVNode(DialogComponent,{option});// 将组件渲染成虚拟节点
    // 这里需要将el渲染到页面中
    render(VNode,el);
    document.body.appendChild(el)// 渲染成真实节点放置在真实页面中
    // 将组件渲染到el这个元素上
    let {showDialog} = VNode.component.exposed;
    showDialog(option)
}