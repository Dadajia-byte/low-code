<template>
  <div class="editor" v-if="editorRef">
    <!-- 左侧物料堆 -->
    <div class="editor-left">
      <div draggable="true" @dragstart="e => dragStart(e, item)" @dragend="e => dragEnd(e, item)"
        class="editor-left-item" v-for="(item, index) in config.componentList" :key="index">
        <span>{{ item.label }}</span>
        <component :is="item.preview"></component>
      </div>
    </div>
    <!-- 顶部菜单栏 -->
    <div class="editor-top">
      <div v-for="(btn, index) in buttons" :key="index" @click="btn.handler" class="editor-top-button">
        <i :class="typeof btn.icon == 'function' ? btn.icon() : btn.icon" class="iconfont"></i>
        <span>{{ typeof btn.label == 'function' ? btn.label() : btn.label }}</span>
      </div>
      <el-button @click="console.log(EditorDataStore.formData)">测试</el-button>
    </div>
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
import EditorBlocks from '../EditorBlocks/index.vue';
import EditorOperator from '../EditorOperator/index.vue';
import { events } from '../../utils/event';
import { cloneDeep } from 'lodash'
import {
  useFocus,
  useMenuDragger,
  useBlockDragger,
  useCommand
} from "@/utils"
import { $dropdown } from "@/components/Dropdown";
import DropdownItem from "@/components/Dropdown/components/DropdownItem/index.vue";
import { $dialog } from '@/components/Dialog';
import {useEditorDataStore} from '@/store/index'
// const props = defineProps({
//   modelValue: { type: Object },
//   formData: { type: Object },
// })
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
    h(DropdownItem, { label: '删除', icon: "icon-shanchu", onClick: commands.delete }),
    h(DropdownItem, { label: '置顶', icon: "icon-dingceng", onClick: commands.placeTop }),
    h(DropdownItem, { label: '置底', icon: "icon-diceng", onClick: commands.placeBottom }),
    h(DropdownItem, {
      label: '查看', icon: "icon-yulan", onClick: () => {
        $dialog({
          title: '查看节点数据',
          content: JSON.stringify(block)
        })
      }
    }),
    h(DropdownItem, {
      label: '导入', icon: "icon-daoru", onClick: () => {
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
  ])
  $dropdown({
    el: e.target,// 以哪个元素作为基准
    content: () => contentVnode
  })
}

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
        const index = EditorDataStore.data.blocks.findIndex(block => block.id === newBlock.id);
        
        if (index !== -1) {
            EditorDataStore.data.blocks[index] = newBlock;
        }
  })
})
</script>



<style scoped lang="scss">
.editor {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  &-left,
  &-right {
    position: absolute;
    width: 270px;
    top: 0;
    bottom: 0;
    height: 100%;
  }

  &-left {
    left: 0;

    &-item {
      width: 250px;
      margin: 20px auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      padding: 20px;
      box-sizing: border-box;
      cursor: move;
      user-select: none;
      min-height: 90px;
      position: relative;

      >span {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgb(174, 177, 215);
        padding: 4px;
        color: #fff;
        // font-weight: 700;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: #ccc;
        opacity: 0.2;
        bottom: 0;
      }
    }
  }

  &-right {
    right: 0;
  }

  &-top {
    position: absolute;
    right: 280px;
    left: 280px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;

    &-button {
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      background-color: rgba(0, 0, 0, .3);
      user-select: none;
      cursor: pointer;
      color: #fff;

      .iconfont {
        font-size: 24px;
      }

      span {
        font-size: 12px;
      }

      &+& {
        margin-left: 3px;
      }
    }

  }

  &-container {
    padding: 80px 270px 0;
    height: 100%;
    box-sizing: border-box;

    &-canvas {
      height: 100%;
      overflow: scroll;

      &-content {
        margin: 20px auto;
        background-color: #f1f1f1;
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
    border: 3px dashed #409EFF;
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
  border-left: 1.5px dashed #409EFF;
}

.line-y {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1.5px dashed #409EFF;
}
</style>
