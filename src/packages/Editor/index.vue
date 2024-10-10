<template>
  <div class="editor" v-if="editorRef">
    <!-- 左侧物料堆 -->
    <div class="editor-left" :style="{ left: isExpanded ? '-290px' : '5px' }">
      <el-text class="mx-1 editor-left-title" size="large">物料堆</el-text>
      <el-divider style="margin-left: 20px; width: 90%;margin-top: 15px;margin-bottom: 5px;"/>
        <el-select
          filterable
          placeholder="nodo搜索,树形更好？"
          class="editor-left-search"
        >
          <template #prefix>
            <el-icon><i-ep-Search /></el-icon>
          </template>
          <el-option/>
        </el-select>
      <el-collapse v-model="activeNames" class="editor-left-menu">
        <el-collapse-item v-for="menu in config.category" :title="menu.title" :name="menu.id" :key="menu.id">
          <div class="editor-left-menu-content">
            <div class="editor-left-menu-content-row" v-for="item in config.componentList.filter(item=>item.category.indexOf(menu.id)!==-1)" :key="item.key">
              <div draggable="true" @dragstart="e => dragStart(e, item)" @dragend="e => dragEnd(e, item)"
                class="editor-left-menu-content-item" >
                <component :is="item.preview"></component>  
              </div>
              <div class="editor-left-menu-content-item-label">{{ item.label }}</div>
            </div>

          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="editor-left-expand" @click="toggleExpand" :style="{right:!isExpanded?'10px':'-20px'}">
        <el-icon :style="{ transform: isExpanded ? 'rotate(180deg)' : 'none' }" style="font-size: 22px; "><i-ep-CaretLeft /></el-icon>
      </div>
    </div>
    <!-- 顶部菜单栏 -->
    <EditorTop :buttons="buttons"></EditorTop>
    <!-- 右侧属性控制栏 -->
    <div class="editor-right">
      <EditorOperator :block="lastSelectBlock" :data="EditorDataStore.data" :updateContainer="commands.updateContainer"
        :updateBlock="commands.updateBlock">
      </EditorOperator>
    </div>
    <!-- 中间画布 -->
    <div class="editor-container">
      <!-- 产生滚动条 -->
      <div class="editor-container-canvas">
        <!-- 产生内容区域 -->
        <div class="editor-container-canvas-content" ref="containerRef" :style="containerStyles"
          @mousedown="containerMouseDown">
            <EditorBlocks 
              v-for="(item, index) in EditorDataStore.data.blocks" 
              :key="item.id" 
              :class="{ 'editor-block-focus': item.focus, 'editor-block-preview': previewRef }"
              :block="item" @mousedown="(e) => blockMouseDown(e, item, index)"
              @Contextmenu="(e) => onContextMenu(e, item)"
              :formData="EditorDataStore.formData"
              >
            </EditorBlocks>
          <!-- 辅助线 -->
          <div v-show="markline.x" class="line-x" :style="{ left: markline.x + 'px' }"></div>
          <div v-show="markline.y" class="line-y" :style="{ top: markline.y + 'px' }"></div>
        </div> 
      </div>
    </div>
    
  </div>
  <div v-if="!editorRef">
    <div class="editor-container-canvas-content" :style="containerStyles" style="margin: 0;">
      <div v-for="item in EditorDataStore.data.blocks" :key="item.id">
          
        <EditorBlocks class="editor-block-preview" :block="item" :formData="EditorDataStore.formData" />
      </div>
    </div>
    {{ EditorDataStore.formData }}
    <ElButton type="primary" @click="editorRef = true">继续编辑</ElButton>  
  </div>
</template>
<script setup>
/* 编辑区 */
import EditorTop from "../EditorTop/index.vue"
import EditorBlocks from '../EditorBlocks/index.vue';
import EditorOperator from '../EditorOperator/index.vue';
import { events } from '../../utils/event';
import {
  useFocus,
  useMenuDragger,
  useBlockDragger,
  useCommand
} from "@/utils/DragCommand"
import { $dropdown } from "@/components/Dropdown";
import DropdownItem from "@/components/Dropdown/components/DropdownItem/index.vue";
import { $dialog } from '@/components/Dialog';
import {useEditorDataStore} from '@/store/index'
const EditorDataStore = useEditorDataStore()
const emit = defineEmits(['update:modelValue']);
// 预览时 内容不再能操作，可以点击输入内容，方便看效果
const previewRef = ref(false)
const editorRef = ref(true)

const config = inject('config');
// const data = EditorDataStore.data
// 获取data.json中的样式
const containerStyles = computed(() => ({
  width: `${EditorDataStore.data.container.width}px`,
  height: `${EditorDataStore.data.container.height}px`,
}))

const containerRef = ref(null)

// 1. 实现物料堆拖拽
const { dragStart, dragEnd } = useMenuDragger(containerRef, EditorDataStore.data)

// 2.获取焦点后即可直接拖拽
let {
  blockMouseDown,
  focusData, // 选中的节点列表
  containerMouseDown,
  lastSelectBlock, // 最后一个选中的节点
  clearBlockFocus, // 清除所有选中
} = useFocus(EditorDataStore.data, previewRef, (e) => {
  mousedown(e);
});
// 3. 实现组件拖拽
let { mousedown, markline } = useBlockDragger(focusData, lastSelectBlock, EditorDataStore.data)

// 用于保存可能使用的所有指令(操作)
const { commands } = useCommand(EditorDataStore.data, focusData);

// 右键菜单
const onContextMenu = (e, block) => {
  e.preventDefault();
  const contentVnode = h('div', {}, [
    h(DropdownItem, { label: '剪切', shortCut: "Ctrl+X", onClick: ()=>console.log('剪切')}),
    h(DropdownItem, { label: '复制', shortCut: "Ctrl+C", onClick: ()=>console.log('复制') }),
    h(DropdownItem, { label: '粘贴', shortCut: "Ctrl+V",divider:true, onClick: ()=>console.log('粘贴') }),
    h(DropdownItem, { label: '拷贝配置', shortCut: "Ctrl+Alt+C", onClick: ()=>console.log('拷贝样式') }),
    h(DropdownItem, { label: '粘贴配置', shortCut: "Ctrl+Alt+V",divider:true, onClick: ()=>console.log('粘贴样式') }),
    h(DropdownItem, { label: '下移一层', shortCut: "Ctrl+[", onClick:  ()=>console.log('上移一层')}),
    h(DropdownItem, { label: '上移一层', shortCut: "Ctrl+]", onClick: ()=>console.log('下移一层') }),
    h(DropdownItem, { label: '置顶', shortCut: "Ctrl+Shift+[", onClick: commands.placeTop }),
    h(DropdownItem, { label: '置底', shortCut: "Ctrl+Shift+]", divider:true, onClick: commands.placeBottom }),
    h(DropdownItem, {
      label: '查看', shortCut:'', onClick: () => {
        $dialog({
          title: '查看节点数据',
          content: JSON.stringify(block)
        })
      }
    }),
    h(DropdownItem, {
      label: '导入', shortCut:'', divider:true, onClick: () => {
        $dialog({
          title: '导入节点数据',
          content: '',
          footer: true,
          onConfirm(text) {
            commands.updateBlock(JSON.parse(text), block)
          }
        })
      }
    }),
    h(DropdownItem, { label: '删除', shortCut: "Delete", onClick: commands.delete }),
  ])
  $dropdown({
    el: e.target,// 以哪个元素作为基准
    content: () => contentVnode
  })
}

/* 左侧物料栏相关，后续可能拉到单独文件夹中 */
const isExpanded = ref(false)
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
const activeNames = ref([1])


// 所有可能使用的按钮
const buttons = [
  { label: '撤销', icon: 'icon-chehui', handler: commands.undo },
  { label: '重做', icon: 'icon-zhongzuo', handler: commands.redo },
  {
    label: '导出', icon: 'icon-daochu', handler: () => {
      $dialog({
        title: '导出JSON',
        content: JSON.stringify(EditorDataStore.data)
      })
    },
  },
  {
    label: '导入', icon: 'icon-daoru', handler: () => {
      $dialog({
        title: '导入JSON',
        footer: true,
        onConfirm(text) {
          // data.value = JSON.parse(text); // 这样更改无法实现撤销和重做
          commands.updateContainer(JSON.parse(text))
        }
      })
    },
  },
  { label: '置顶', icon: 'icon-dingceng', handler: commands.placeTop },
  { label: '置底', icon: 'icon-diceng', handler: commands.placeBottom },
  { label: '删除', icon: 'icon-shanchu', handler: commands.delete },
  {
    label: () => previewRef.value ? '编辑' : '预览',
    icon: () => previewRef.value ? 'icon-bianji' : 'icon-yulan',
    handler: () => {
      previewRef.value = !previewRef.value;
      clearBlockFocus()
    }
  },
  {
    label: '关闭', icon: 'icon-guanbi', handler: () => {
      editorRef.value = false
    }
  }
]
onMounted(()=>{
    events.on('block-updated',(newBlock)=>{
      // 假设 data.value.blocks 是一个数组，通过 newBlock 的某个唯一标识来查找并替换
        // const index = EditorDataStore.data.blocks.findIndex(block => block.id === newBlock.id);
        
        // if (index !== -1) {
        //   console.log(newBlock);
        //   EditorDataStore.data.blocks.splice(index, 1, newBlock);
        // }
        EditorDataStore.updateBlocks(newBlock)
  })
})
</script>



<style scoped lang="scss">
.editor {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;

  &-left,
  &-right {
    position: absolute;
    top: 30px;
    bottom: 0;
    height: 100%;
  }

  &-left {
    left: 5px;  
    border-radius: 20px;
    width: 300px;
    border: #e3e3e3 1px solid;
    background-color: #fff;
    height: 800px;
    height: calc(100% - 100px);
    box-shadow: 5px 4px 8px rgba(0, 0, 0, 0.15);
    transition: all .5s;
    &-title {
      display: flex;
      margin-left: 35px;
      margin-top: 20px;
      font-size: 22px;
    }
    &-search {
      margin-left: 20px;
      width: 90%;
    }
    &-menu {
      margin-left: 29px;
      width: 89%;
      margin-top: 10px;
      overflow-y: auto;
      height: 85%;
      padding-right: 4px;
      scrollbar-gutter: stable;
      
    }
    &-menu-content {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;


        &-row {

          width: 48%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 5px;
          margin-right: 5px;
          // border-bottom: #e0dfff 1px solid;

        }
        &-item {
          
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white;
          box-sizing: border-box;
          cursor: move;
          user-select: none;
          min-height: 40px;
          position: relative;
          border-radius: 5px;
          border: 1px dashed #6965db;
          padding: 0 4px;

          &-label {
            font-size: 12px;
            color: #7d7d7d;
            width: 100%;
            text-align: center;
          }
          &:hover {
            border:1px solid #6965db;
          }

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            // background-color: #ccc;
            opacity: 0.2;
            bottom: 0;
          }
        }
      }
    
    
    &-expand {
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      position: absolute;
      right: 10px;
      top: 20px;
      border: #e3e3e3 1px solid;
      border-radius: 15px;
      height: 30px;
      width: 30px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
      background-color: #ffffff;
      transition: transform 0.8s;
      cursor: pointer;
      &:hover {
        background-color: #e0dfff;
        color: white;
      }
    }
  }

  &-right {
    right: -310px;
  }



  &-container {
    padding: 40px 200px 0;
    height: 95%;
    margin-bottom: 40px;
    box-sizing: border-box;
    border: #e3e3e3 1px solid;
    z-index: 1;

    &-canvas {
      height: 100%;
      overflow: scroll;
      border-radius: 40px;
      border: #e3e3e3 2px dashed;
      &-content {
        margin: 40px auto;
        // background-color: #f1f1f1;
        position: relative;
      }
    }
  }
}

.editor-block {
  position: absolute;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.editor-block-focus {
  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    border-radius: 2px;
    border: 1px solid #6965db;
  }
}

.editor-block-preview {
  &::after {
    display: none;
  }
}

.line-x {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 1px dashed #6965db;
}

.line-y {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #6965db;
}
</style>
