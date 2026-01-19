# Ticket
-> AddItemsModal.jsx - 设计图标功能
    1) 能够设计图标并放到软件里，UI实现。
    2) firestore
-> ItemsTable.jsx
    1）图标问题
    1) beauty旁边是要写 subcategory的
    2）sorting：brand也要可以排序哦
    3）all collection存在的意义是什么？
    4）filter功能是死的
-> StatsGrid.jsx
    1) Reward Earned 没有计算公式，只是一个ui标签
-> Search: 不能search for brand？？？不能search for category？？？
-> 没有log 功能
-> 没有journal功能
-> 新用户没有试用功能

# Progress
16. AddItemsModal.jsx - firestore
    1) 
15. AddItemsModal.jsx - 能够设计图标并放到软件里，UI实现。
    1) 先生成了放图标的UI，加入了emoji
    2) use **nano-banana** to generate png icons，then, use python to write code (convert.py) to convert png into svg
    3) **folder:icons** and **iconMap.jsx** and **icon.jsx**
    4) edit convert.py so that **batch conversion** is achieved
    5) **use SVGO to reduce SVG file**
    6) generate more appliance and makeup items: "create an emoji based on your understanding of ..."
    7) generate folders in icons
    8) modify icon sizes
14. [x] ItemsTable.jsx - 2016.01.17
    1) [x] updated github
13. [x] useItems.js
12. [x] useAuth.js
11. [x] firestoreService.js
10. [x] calculations.js
9. [x] generate modals 这个文件夹
8. [x] modularization plan
7. fix subcategory & brands
    1) [x] Logout done
    2) [x] Subcategories done
    3) [x] Manus用完
    4) [x] 第3次用manus
    5) [x] 上传已有的代码
    6) [x] Manus两个questions
    7) [x] npm run build & deploy - git updated
    8) [x] remove pre-filled info
    9) [x] npm run build & depoy
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

# modularization

src/
├── main.jsx
├── App.jsx    //只做一件事：启动react应用
│
├── components/  //都是jsx
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── TopBar.jsx
│   │
│   ├── dashboard/     //关键区域
│   │   ├── StatsGrid.jsx
│   │   └── ItemsTable.jsx
│   │
│   └── modals/ //modal就是弹窗的意思
│       ├── AuthModal.jsx //登录弹窗
│       └── AddItemModal.jsx //添加物品弹窗
│
├── hooks/      //都是js，存放专门处理逻辑，不关心 UI
│   ├── useAuth.js
│   ├── useCategories.js
│   └── useItems.js
│
├── utils/
│   ├── calculations.js   // calculateCPU
│   ├── currency.js     // currency, number 把数字变成美金格式（$1,000.00）
│   └── date.js           // date formatting 处理日期
│
├── firebase.js //负责配置信息和初始化 Firebase 
└── services/      
    └── firestoreService.js //负责所有的增、删、改、查 App.jsx stops importing Firestore directly

