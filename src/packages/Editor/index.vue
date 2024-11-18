<template>
  <div class="editor">
    <!-- 左侧物料堆 -->
    <div
      class="editor-left custom1-color"
      :style="{ left: isExpanded ? '-4.1429rem' : '.0714rem' }"
    >
      <el-text class="mx-1 editor-left-title" size="large">物料堆</el-text>
      <el-divider
        style="
          margin-left: 0.2857rem;
          width: 90%;
          margin-top: 0.2143rem;
          margin-bottom: 0.0714rem;
        "
      />
      <el-select filterable placeholder="search sth" class="editor-left-search">
        <template #prefix>
          <el-icon>
            <i-ep-Search />
          </el-icon>
        </template>
        <el-option />
      </el-select>
      <el-collapse
        v-model="activeNames"
        class="editor-left-menu"
        style="border-bottom: none"
      >
        <el-collapse-item
          v-for="menu in config.category"
          :title="menu.title"
          :name="menu.id"
          :key="menu.id"
        >
          <div class="editor-left-menu-content">
            <div
              class="editor-left-menu-content-row"
              v-for="item in config.componentList.filter(
                (i) => i.category.indexOf(menu.id) !== -1
              )"
              :key="item.key"
            >
              <div
                draggable="true"
                @dragstart="(e) => dragStart(e, item)"
                @dragend="(e) => dragEnd(e)"
                class="editor-left-menu-content-item"
              >
                <component :is="item.preview"></component>
              </div>
              <div class="editor-left-menu-content-item-label">
                {{ item.label }}
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div
        class="editor-left-expand"
        @click="toggleExpand"
        :style="{ right: !isExpanded ? '.1429rem' : '-0.2857rem' }"
      >
        <el-icon
          :style="{ transform: isExpanded ? 'rotate(180deg)' : 'none' }"
          style="font-size: 0.3143rem"
        >
          <i-ep-CaretLeft />
        </el-icon>
      </div>
    </div>
    <!-- 顶部菜单栏 -->
    <EditorTop
      :buttons="buttons"
      :editorOperatorStatus="editorOperatorStatus"
    ></EditorTop>
    <!-- 右侧属性控制栏 -->
    <div class="editor-right custom1-color">
      <EditorOperator
        :block="lastSelectBlock"
        :data="EditorDataStore.data"
        :updateContainer="commands.updateContainer"
        :updateBlock="commands.updateBlock"
      >
      </EditorOperator>
    </div>
    <!-- 中间画布 -->
    <div class="editor-container">
      <!-- 产生滚动条 -->
      <div class="editor-container-canvas">
        <!-- 产生内容区域 -->
        <div
          class="editor-container-canvas-content"
          ref="containerRef"
          :style="containerStyles"
          @mousedown="(e) => containerMouseDown(e)"
          @contextmenu.prevent="(e) => onContextMenu(e, null)"
          @wheel="(e) => handleMousewheel(e)"
        >
          <canvas
            ref="canvasRef"
            :width="containerStyles.width"
            :height="containerStyles.height"
            class="grid-canvas"
          ></canvas>
          <EditorBlocks
            v-for="(item, index) in EditorDataStore.data.blocks"
            :key="`${EditorDataStore.focusUpdate}${item.id}`"
            :class="{
              'editor-block-focus': item.focus,
            }"
            :block="item"
            @mousedown="(e) => blockMouseDown(e, item, index)"
            :focusBlocksNum="focusData.focus.length"
            @Contextmenu="(e) => onContextBlock(e, item)"
            :blockResizeMousedown="onMouseDown"
            :formData="EditorDataStore.formData"
          >
          </EditorBlocks>
          <!-- 辅助线 -->
          <div
            v-show="markline.x"
            class="line-x"
            :style="{ left: markline.x + 'px' }"
          ></div>
          <div
            v-show="markline.y"
            class="line-y"
            :style="{ top: markline.y + 'px' }"
          ></div>
          <!-- 选中的边界框 -->
          <div
            v-if="selectionBounds"
            class="selectionBounds"
            :style="{
              top: selectionBounds.top + 'px',
              left: selectionBounds.left + 'px',
              width: selectionBounds.width + 'px',
              height: selectionBounds.height + 'px',
            }"
            @mousedown="(e) => selectionBoundsMouseDown(e)"
            @contextmenu="(e) => onContextBlock(e, focusData.focus)"
          >
            <template
              v-if="
                focusData.focus
                  .map((item) => config.componentMap[item.key])
                  .reduce((pre, cur) => pre + cur.resize?.width, 0)
              "
            >
              <div
                class="block-resize block-resize-left"
                @mousedown="
                  (e) =>
                    onMouseDown(e, { horizontal: 'start', vertical: 'center' })
                "
              ></div>
              <div
                class="block-resize block-resize-right"
                @mousedown="
                  (e) =>
                    onMouseDown(e, { horizontal: 'end', vertical: 'center' })
                "
              ></div>
            </template>
            <template
              v-if="
                focusData.focus
                  .map((item) => config.componentMap[item.key])
                  .reduce((pre, cur) => pre + cur.resize?.height, 0)
              "
            >
              <div
                class="block-resize block-resize-top"
                @mousedown="
                  (e) =>
                    onMouseDown(e, { horizontal: 'center', vertical: 'start' })
                "
              ></div>
              <div
                class="block-resize block-resize-bottom"
                @mousedown="
                  (e) =>
                    onMouseDown(e, { horizontal: 'center', vertical: 'end' })
                "
              ></div>
            </template>
            <template
              v-if="
                focusData.focus
                  .map((item) => config.componentMap[item.key])
                  .reduce((pre, cur) => pre + cur.resize?.height, 0) &&
                focusData.focus
                  .map((item) => config.componentMap[item.key])
                  .reduce((pre, cur) => pre + cur.resize?.width, 0)
              "
            >
              <div
                class="block-resize block-resize-top-left"
                @mousedown="
                  (e) =>
                    onMouseDown(e, { horizontal: 'start', vertical: 'start' })
                "
              ></div>
              <div
                class="block-resize block-resize-top-right"
                @mousedown="
                  (e) =>
                    onMouseDown(e, { horizontal: 'end', vertical: 'start' })
                "
              ></div>
              <div
                class="block-resize block-resize-bottom-left"
                @mousedown="
                  (e) =>
                    onMouseDown(e, { horizontal: 'start', vertical: 'end' })
                "
              ></div>
              <div
                class="block-resize block-resize-bottom-right"
                @mousedown="
                  (e) => onMouseDown(e, { horizontal: 'end', vertical: 'end' })
                "
              ></div>
            </template>
          </div>
          <!-- 鼠标选中区域 -->
          <div
            v-if="mouseDrag.dragging"
            class="mouse-select-area"
            :style="{
              top: mouseSelectArea.top + 'px',
              left: mouseSelectArea.left + 'px',
              width: mouseSelectArea.width + 'px',
              height: mouseSelectArea.height + 'px',
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/* 编辑区 */
import EditorTop from "../EditorTop/index.vue";
import EditorBlocks from "../EditorBlocks/index.vue";
import EditorOperator from "../EditorOperator/index.vue";
import { events } from "../../utils/event";
import {
  useFocus,
  useMenuDragger,
  useBlockDragger,
  useBlockResize,
  useCommand,
  useMouseWheel,
} from "@/utils/DragCommand";
import { $dropdown } from "@/components/Dropdown";
import DropdownItem from "@/components/Dropdown/components/DropdownItem/index.vue";
import { $dialog } from "@/components/Dialog";
import { $previewDialog } from "../../components/PreviewDialog";
import { useEditorDataStore } from "@/store/index";

const EditorDataStore = useEditorDataStore();
// 预览时 内容不再能操作，可以点击输入内容，方便看效果
const previewRef = ref(false);
// 一个变量用于记录当前是抓手还是鼠标模式 default: true 鼠标模式
const editorOperatorStatus = ref(true);

const config = inject("config");
// 获取data.json中的样式
const containerStyles = computed(() => ({
  width: `${EditorDataStore.data.container.width}px`,
  height: `${EditorDataStore.data.container.height}px`,
}));

const containerRef = ref(null);
//画板背景
const canvasRef = ref(null);
const canvas = () => {
  let ctx = canvasRef.value;
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext("2d");
  } else {
    return;
  }
  const width = EditorDataStore.data.container.width;
  const height = EditorDataStore.data.container.height;
  ctx.clearRect(0, 0, width, height);
  if (EditorDataStore.data.container.grid) {
    drawGrid(width, height);
  }

  function drawGrid(width, height) {
    const gridSize = 6; // 网格大小

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.strokeStyle = "#e3e3e3";
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = "#e3e3e3";
      ctx.stroke();
    }
  }
};

const containerSize = computed(() => {
  return {
    width: EditorDataStore.data.container.width,
    height: EditorDataStore.data.container.height,
  };
});

// 使用 watch 监听 containerSize 的变化
watch(
  [() => containerSize.value, () => EditorDataStore.data.container.grid],
  () => {
    canvas();
  },
  { deep: true }
);
// 性能是否有点差？本质上是想要实现副作用的效果，即editorOperatorStatus变量变成false时，清除选中的节点（抓手模式不需要选中）
watch(editorOperatorStatus, () => {
  if (!editorOperatorStatus.value) {
    clearBlockFocus();
  }
});

// 1. 实现物料堆拖拽
const { dragStart, dragEnd } = useMenuDragger(
  containerRef,
  EditorDataStore.data
);

// 5. 实现滚轮缩放
let { handleMousewheel, scale } = useMouseWheel(containerRef);

// 2.获取焦点后即可直接拖拽
let {
  blockMouseDown,
  focusData, // 选中的节点列表
  containerMouseDown,
  lastSelectBlock, // 最后一个选中的节点
  clearBlockFocus, // 清除所有选中
  selectionBounds,
  selectionBoundsMouseDown,
  mouseSelectArea,
  mouseDrag,
} = useFocus(
  EditorDataStore.data,
  editorOperatorStatus,
  containerRef,
  scale,
  (e) => {
    mousedown(e);
  }
);

// 3. 实现组件拖拽
let { mousedown, markline } = useBlockDragger(
  focusData,
  lastSelectBlock,
  containerRef,
  scale,
  EditorDataStore.data,
  selectionBounds
);

// 4. 实现组件缩放
let { onMouseDown } = useBlockResize(
  focusData,
  selectionBounds,
  scale,
  EditorDataStore.data
);

// 用于保存可能使用的所有指令(操作)
const { commands } = useCommand(EditorDataStore.data, focusData, containerRef);

const onContextMenu = (e) => {
  if (!editorOperatorStatus.value) return;
  e.preventDefault();
  //添加返回位置函数
  e.getBoundingClientRect = () => {
    return {
      left: e.clientX,
      top: e.clientY,
    };
  };

  const contentVnode = h("div", {}, [
    h(DropdownItem, {
      label: "粘贴",
      shortCut: "Ctrl+V",
      disabled: EditorDataStore.clipboard.blocks.length < 1, // 剪切板没有就禁用
      onClick: (e) => commands.paste(e),
    }),
  ]);
  $dropdown({
    el: e,
    content: () => contentVnode,
  });
};
// 右键物块菜单
const onContextBlock = (e, block) => {
  if (!editorOperatorStatus.value) return; // 抓手模式不需要右键菜单
  e.stopPropagation();
  e.preventDefault();
  e.getBoundingClientRect = () => {
    return {
      left: e.clientX,
      top: e.clientY,
    };
  };
  let ifBlocks = false;
  if (Array.isArray(block)) ifBlocks = true;
  const contentVnode = h("div", {}, [
    h(DropdownItem, {
      label: "剪切",
      shortCut: "Ctrl+X",
      onClick: commands.cut,
    }),
    h(DropdownItem, {
      label: "复制",
      shortCut: "Ctrl+C",
      divider: true,
      onClick: commands.copy,
    }),
    /* h(DropdownItem, {
      label: "粘贴",
      shortCut: "Ctrl+V",
      divider: true,
      onClick: () => console.log("粘贴"),
    }), */
    h(DropdownItem, {
      label: "拷贝配置",
      shortCut: "Ctrl+Alt+C",
      onClick: () => console.log("拷贝样式"),
      disabled: ifBlocks,
    }),
    h(DropdownItem, {
      label: "粘贴配置",
      shortCut: "Ctrl+Alt+V",
      divider: true,
      onClick: () => console.log("粘贴样式"),
      disabled: ifBlocks,
    }),
    h(DropdownItem, {
      label: "下移一层",
      shortCut: "Ctrl+[",
      onClick: commands.placeDown,
    }),
    h(DropdownItem, {
      label: "上移一层",
      shortCut: "Ctrl+]",
      onClick: commands.placeUp,
    }),
    h(DropdownItem, {
      label: "置顶",
      shortCut: "Ctrl+Shift+[",
      onClick: commands.placeTop,
    }),
    h(DropdownItem, {
      label: "置底",
      shortCut: "Ctrl+Shift+]",
      divider: true,
      onClick: commands.placeBottom,
    }),
    h(DropdownItem, {
      label: "查看",
      shortCut: "",
      onClick: () => {
        $dialog({
          title: "查看节点数据",
          content: JSON.stringify(block),
        });
      },
      disabled: ifBlocks,
    }),
    h(DropdownItem, {
      label: "导入",
      shortCut: "",
      divider: true,
      onClick: () => {
        $dialog({
          title: "导入节点数据",
          content: "",
          footer: true,
          onConfirm(text) {
            commands.updateBlock(JSON.parse(text), block);
          },
        });
      },
      disabled: ifBlocks,
    }),
    h(DropdownItem, {
      label: "删除",
      shortCut: "Delete",
      onClick: commands.delete,
    }),
  ]);
  $dropdown({
    // el: e.target, // 以哪个元素作为基准
    el: e, // 原来是以某个元素为基准，现在变成鼠标位置
    content: () => contentVnode,
  });
};

/* 左侧物料栏相关，后续可能拉到单独文件夹中 */
const isExpanded = ref(false);
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
const activeNames = ref([1]);

// 所有可能使用的按钮
const buttons = [
  {
    label: "抓手",
    icon: "icon-zhuashou",
    handler: () => (editorOperatorStatus.value = false),
  },
  {
    label: "鼠标",
    icon: "icon-mouse",
    handler: () => (editorOperatorStatus.value = true),
  },
  { label: "撤销", icon: "icon-chehui", handler: commands.undo },
  { label: "重做", icon: "icon-zhongzuo", handler: commands.redo },
  {
    label: "导出",
    icon: "icon-daochu",
    handler: () => {
      $dialog({
        title: "导出JSON",
        content: JSON.stringify(EditorDataStore.data),
      });
    },
  },
  {
    label: "导入",
    icon: "icon-daoru",
    handler: () => {
      $dialog({
        title: "导入JSON",
        footer: true,
        onConfirm(text) {
          // data.value = JSON.parse(text); // 这样更改无法实现撤销和重做
          commands.updateContainer(JSON.parse(text));
        },
      });
    },
  },
  { label: "置顶", icon: "icon-dingceng", handler: commands.placeTop },
  { label: "置底", icon: "icon-diceng", handler: commands.placeBottom },
  { label: "删除", icon: "icon-shanchu", handler: commands.delete },
  {
    label: () => (previewRef.value ? "编辑" : "预览"),
    icon: () => (previewRef.value ? "icon-bianji" : "icon-yulan"),
    handler: () => {
      previewRef.value = !previewRef.value;
      $previewDialog({});
      clearBlockFocus();
    },
  },
];
onMounted(() => {
  canvas();
  events.on("block-updated", (newBlock) => {
    EditorDataStore.updateBlocks(newBlock);
  });
});
</script>

<style scoped lang="scss">
@import "@/styles/mixin.scss";
.editor {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;

  &-left,
  &-right {
    position: absolute;
    top: 0.4286rem;
    bottom: 0;
    height: 100%;
    @include out-z-index;
  }

  &-left {
    left: 0.0714rem;
    border-radius: 0.2857rem;
    width: 4.2857rem;
    border: #e3e3e3 0.0143rem solid;
    background-color: #fff;
    height: calc(100% - 1.4286rem);
    box-shadow: 0.0714rem 0.0571rem 0.1143rem rgba(0, 0, 0, 0.15);
    transition: all 0.5s;
    // overflow: hidden;
    &-title {
      display: flex;
      margin-left: 0.5rem;
      margin-top: 0.2857rem;
      font-size: 0.3143rem;
    }

    &-search {
      margin-left: 0.2857rem;
      width: 90%;
    }

    &-menu {
      margin-left: 0.4143rem;
      width: 89%;
      margin-top: 0.1429rem;
      overflow-y: auto;
      height: 80%;
      padding-right: 0.0571rem;
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
        margin-top: 0.0714rem;
        margin-right: 0.0714rem;
        // border-bottom: #e0dfff .0143rem solid;
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
        min-height: 0.5714rem;
        position: relative;
        border-radius: 0.0714rem;
        border: 0.0143rem dashed #6965db;
        padding: 0 0.0571rem;

        &-label {
          font-size: 0.1714rem;
          color: #7d7d7d;
          width: 100%;
          text-align: center;
        }

        &:hover {
          border: 0.0143rem solid #6965db;
        }

        &::after {
          content: "";
          @include out-z-index;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
    }

    &-expand {
      display: flex;
      justify-content: center;
      align-items: center;
      @include out-z-index;
      position: absolute;
      right: 0.1429rem;
      top: 0.2857rem;
      border: #e3e3e3 0.0143rem solid;
      border-radius: 0.2143rem;
      height: 0.4286rem;
      width: 0.4286rem;
      box-shadow: 0.0286rem 0.0286rem 0.0714rem rgba(0, 0, 0, 0.15);
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
    right: -4.4286rem;
  }

  &-container {
    padding: 0.5714rem 2.8571rem 0;
    height: 95%;
    margin-bottom: 0.5714rem;
    box-sizing: border-box;
    border: #e3e3e3 0.0143rem solid;

    &-canvas {
      height: 100%;
      overflow: scroll;

      &-content {
        margin: 0.5714rem auto;
        // background-color: #f1f1f1;
        position: relative;
        border-radius: 0.1429rem;
        border: #e3e3e3 0.0286rem dashed;
      }
    }
  }
}

.editor-block {
  position: absolute;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @include out-z-index;
  }
}

.editor-block-focus {
  &::after {
    content: "";
    position: absolute;
    top: -0.0571rem;
    left: -0.0571rem;
    width: calc(100% + 0.0857rem);
    height: calc(100% + 0.0857rem);
    border-radius: 0.0286rem;
    border: 0.0143rem solid #6965db;
  }
}

.line-x {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 0.0143rem dashed #6965db;
  @include modal-z-index;
}

.line-y {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 0.0143rem dashed #6965db;
  @include modal-z-index;
}

.selectionBounds {
  position: absolute;
  border: #6965db dashed 0.0143rem;
  @include modal-z-index;
}

.mouse-select-area {
  position: absolute;
  background-color: rgba(105, 101, 219, 0.15);
  border: #6965db solid 1px;
  @include topest-z-index;
}

$pre: "block-resize";
.#{$pre} {
  position: absolute;
  width: 0.0857rem;
  height: 0.0857rem;
  background-color: #fff;
  border: 0.0143rem solid #6965db;
  border-radius: 0.0286rem;
  user-select: none;
}

.#{$pre}-top {
  top: -0.0571rem;
  left: calc(50% - 0.0429rem);
  cursor: n-resize; /* 设置为向上箭头光标 */
}

.#{$pre}-bottom {
  bottom: -0.0571rem;
  left: calc(50% - 0.0429rem);
  cursor: s-resize; /* 设置为向下箭头光标 */
}

.#{$pre}-left {
  left: -0.0571rem;
  top: calc(50% - 0.0429rem);
  cursor: w-resize; /* 设置为向左箭头光标 */
}

.#{$pre}-right {
  right: -0.0571rem;
  top: calc(50% - 0.0429rem);
  cursor: e-resize; /* 设置为向右箭头光标 */
}

.#{$pre}-top-left {
  top: -0.0571rem;
  left: -0.0571rem;
  cursor: nw-resize; /* 设置为西北箭头光标 */
}

.#{$pre}-top-right {
  top: -0.0571rem;
  right: -0.0571rem;
  cursor: ne-resize; /* 设置为东北箭头光标 */
}

.#{$pre}-bottom-left {
  bottom: -0.0571rem;
  left: -0.0571rem;
  cursor: sw-resize; /* 设置为西南箭头光标 */
}

.#{$pre}-bottom-right {
  bottom: -0.0571rem;
  right: -0.0571rem;
  cursor: se-resize; /* 设置为东南箭头光标 */
}
</style>
