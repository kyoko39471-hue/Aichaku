# Ticket
-> sandbox
-> JournalPage 
    1) UI需要修改一下，目前每一条entry都占有一行的记录，太占用空间了。 比如只显示10天，剩下的load more
-> ItemsTable.jsx
    1) filter功能是死的
        - All Items
        - Best Value (CPU < $3)
        - Neglected (< 5 uses)
        - New Arrivals (Added Recently)
        - Cost-Heavy (CPU>$20)
    2) Search: 不能search for brand？？？不能search for category？？？
-> StatsGrid.jsx
    1) reward design: Reward = Σ（每个 item 的 CPU 下降量
-> Other: 新用户没有试用功能
-> Daily Journal Page: “Quick log recent”: show last ~20 items based on lastUsedAt (requires a paginated query like orderBy('lastUsedAt','desc') limit(20)), or based on recent journal events (no need to scan all items).

# Progress
 25. Journal Page - delete function
 24. Journal Page - fixed an error
 23. Journal Page 
  Daily journal Page

    Goal: Record a true per-day usage journal where each “Log Usage” click creates a distinct event (duplicates allowed), and display events grouped by category for that day.

  - Data model (Firestore):
      - Day container: users/{uid}/journalDays/{YYYY-MM-DD}
      - Event stream: users/{uid}/journalDays/{YYYY-MM-DD}/events/{eventId} (one doc per log action)
  - Event document (per log action):
      - Required: createdAt (server timestamp), itemId
      - Snapshot fields (to keep history stable + survive deletes): category (Closet/Beauty/Appliances), itemName, brand
      - Optional snapshots if useful later: subcategory, iconType, iconValue, price
  - Logging behavior:
      - Each tap appends a new event doc for that date.
      - Logging the same item multiple times creates multiple event docs (shown multiple times).
  - Display behavior (Daily view):
      - Header shows the selected date (e.g. Jan 30, 2026).
      - Events are grouped by category using the snapshot category.
      - Only render category sections that have at least one event that day (no empty “Appliances” section).
      - Within each category, show events in chronological order; duplicates remain visible.
  - Edits and deletes:
      - Editing an item later does not rewrite old journal entries for the snapshot fields you keep stable (category/itemName/brand remain as logged).
      - Deleting an item does not affect existing journal events because they contain the snapshot fields needed for display.
  - Implementation shape (for later coding):
      - Add Firestore service functions to create/read day + append events.
      - Add a useJournal(selectedDate) hook to load that day’s events and expose logEvent(item) and date navigation helpers.
      - Implement src/pages/DailyJournal.jsx as UI that consumes useJournal + items list for picking/logging.
  -  keep journaling driven by ItemsTable.jsx “Log Usage”.
      - Implement a single service function that does both writes: increment uses on the item + append a journalDays/{YYYY-MM-DD}/events/{eventId} doc with snapshot fields.
      - useItems.logUsage(itemId) calls that unified function, so every existing log action automatically produces a journal event.
  - Daily Journal page (initially view-first):
      - DailyJournal.jsx loads journalDays/{date}/events and renders grouped sections (only categories that exist that day).
      - No “pick any item” UI needed to meet your journaling workflow.

• Start with Firestore + hook, then UI.

22. ItemsTable.jsx - sorting
    1) [x] log
    2) [x] render subcategory
    3) [x] subcategory can be sorted
    4) [x] subcategory & brand need to be toLowerCase();
    5) [x] by default怎么是price呢？应该是category
21. ItemsTable.jsx - delete & edit - Jan 26 2026
20. EditItemModal.jsx - Jan 26 2026
    1) [x] designed the UI
    2) [x] all the way to brand & subcategory
    3) [x] Item Name
    4) [x] Price & Times Used
    5) [x] submit button
    6) [x] EditItemModal.jsx testing
19. firestoreService.js 有了edit功能。
18. ItemsTable.jsx - design
    1) log, edit, delete three button appearances 
    2) filter selections design
        - All Items
        - Best Value (CPU < $3)
        - Neglected (< 5 uses)
        - New Arrivals (Added Recently)
        - Cost-Heavy (CPU>$20)
    3) reward design: Reward = Σ（每个 item 的 CPU 下降量）
17. AddItemsModal.jsx - default icon setup 
16. AddItemsModal.jsx - firestore
    1) git push
    2) firestore can store the icons now
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

