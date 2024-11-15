# 低代码平台

### 核心技术

vue3.4 + vite + element-plus + mitt

### 目标

在公司打工二次开发别的开源的低代码平台时，总时掺杂些杂七杂八的东西，所以希望能在空余时间开发一个easy嵌入的低代码开发平台easy<br/>
同时希望逐渐完善样式配置等，xiwang能做出高级感 ^ ^

### 几句话

写了一半才发现被单向数据流恶心坏了，同时传递数据的时候嵌了几层，在开发的时候就有点痛苦面具了，开始图方便用了mitt，想着开始就用pinia等状态库或许会好一点吧(
悲)，希望之后有空能改

### TodoList

#### 组件分类

之后按这个实现

1. **基础组件**
    - 按钮（Button）
    - 输入框（Input）
    - 单选框/复选框（Radio/Checkbox）
    - 下拉菜单（Dropdown/Select）
    - 文本框（Textarea）
    - 切换开关（Switch）
    - 标签（Tag）

2. **业务组件**
    - 用户管理表单
    - 订单列表
    - 商品展示卡片
    - 评论区
    - 登录/注册表单
    - 支付接口表单
    - 商品详情模块

3. **布局组件**
    - 栅格布局（Grid）
    - 弹性布局（Flexbox）
    - 容器（Container/Panel）
    - 侧边栏（Sidebar）
    - 页头/页脚（Header/Footer）
    - 选项卡（Tabs）
    - 折叠面板（Collapse）

4. **功能组件**
    - 文件上传（File Upload）
    - 富文本编辑器（Rich Text Editor）
    - 日期选择器（DatePicker）
    - 分页组件（Pagination）
    - 搜索框（Search）
    - 拖拽排序组件（Drag and Drop）
    - 图表组件（Charts：折线图、柱状图、饼图等）
    - 地图（Map）

5. **展示组件**
    - 图像（Image）
    - 文本展示（Text）
    - 图标（Icon）
    - 卡片（Card）
    - 进度条（Progress）
    - 通知/消息（Notification/Message）

6. **数据组件**
    - 数据表格（Table）
    - 表单（Form）
    - 列表（List）
    - 文件下载（Download）
    - 数据绑定组件（Data Binding）

7. **静态组件**
    - 文本（Text）
    - 图片（Image）
    - 分割线（Divider）

8. **动态组件**
    - 动态表单（Dynamic Form）
    - 弹窗（Modal/Popup）
    - 步骤条（Steps）
    - 动态加载（Lazy Load）
    - 手风琴组件（Accordion）

9. **通用组件**
    - 弹窗（Modal）
    - 对话框（Dialog）
    - 通知栏（Notification）
    - 提示框（Tooltip）

10. **定制组件**
    - 定制化的复杂表单
    - 定制的仪表盘组件
    - 特定业务场景的工作流引擎
    - API 绑定的表单或数据展示组件
   