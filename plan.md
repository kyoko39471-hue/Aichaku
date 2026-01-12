# To do
-> hook

# Progress
6. Implement the Firebase Firestore logic in "AddItemModal"
    1) [x] Firebase.js updated
    2) [x] AddItemModal.jsx import
    3) [x] hook
    4) loading
    5) key
    6) ManagementView
5. [x] modularization of "AddItemModal"
    1) add AddItemModal.jsx
    2) transfer code 
    3) test and edit
    4) update github
4. [x] modify "add to collection" UI: 
    1) basic category (selection: closet, beauty, or appliance)
    2) brand (selection: existing brands, add new brand, manage brand list)
    3) item name (just type in... )
    4) item subcategory (selection: existing category, add new category, manage category list)
    5) price
    6) initial times Used
3. [x] Modularize AuthModal
2. [x] Initialize firebase project & AuthModal
1. [x] connect to Github


# Note 
四、架构层面的评价（你现在在哪个阶段）

从这份代码可以看出：

你已经脱离“把逻辑写进 JSX”的阶段

开始有 数据模型意识

开始考虑 离线 / 同步 / 演进

目前的问题不是“React 不熟”，而是：

单个组件开始承担过多领域责任

下一阶段自然的演进方向是：

useAddItem() 自定义 hook

Brand/Subcategory 管理独立状态源

Modal 只负责 UI + 调度

但现在不拆是完全合理的。