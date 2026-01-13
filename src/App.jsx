import { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Package, 
  Sparkles, 
  Coffee, 
  TrendingDown,
  Award,
  ArrowUpDown,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
  User,
  LogOut,
  Mail,
  Lock,
  X,
  Settings2, ChevronLeft, Trash2
} from 'lucide-react';
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AuthModal from './components/AuthModal'; //身份验证弹窗组件
import AddItemModal from './components/AddItemModal'; //添加物品弹窗组件

// --- Main App Component ---
const App = () => {
  // State Management
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'price', direction: 'desc' });
  const [showAddModal, setShowAddModal] = useState(false);

  // Inside App component:
  // 用户登录和加载
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const categoriesRef = doc(db, "users", currentUser.uid, "metadata", "categories");
        const docSnap = await getDoc(categoriesRef);

        if (docSnap.exists()) {
          setCategoriesData(docSnap.data());
        } else {
          // 初始化默认分类数据
          const defaultCategories = {
            brands: {
              "Closet": [],
              "Beauty": [],
              "Appliances": []
            },
            subcategories: {
              "Closet": [],
              "Beauty": [],
              "Appliances": []
            }
          };
          await setDoc(categoriesRef, defaultCategories);
          setCategoriesData(defaultCategories);
        }
      } else {
        // 用户登出时清空分类数据或重置为默认值
        setCategoriesData({ brands: {}, subcategories: {} }); 
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // 不需要 setUser(null)
      // onAuthStateChanged 会自动处理
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 空数组表示初始状态
  const [items, setItems] = useState([]);

  // 品牌和子类别
  const [categoriesData, setCategoriesData] = useState({
    brands: {},
    subcategories: {}
  });

  const calculateCPU = (price, uses) => (uses === 0 ? price : price / uses);

  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => 
      (activeCategory === 'All' || item.category === activeCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = sortConfig.key === 'cpu' ? calculateCPU(a.price, a.uses) : a[sortConfig.key];
        let valB = sortConfig.key === 'cpu' ? calculateCPU(b.price, b.uses) : b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [items, activeCategory, searchQuery, sortConfig]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
    setSortConfig({ key, direction });
  };

  const logUsage = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, uses: item.uses + 1 } : item));
  };

  const totalItems = items.length;
  const avgCPU = totalItems > 0 
    ? (items.reduce((acc, item) => acc + calculateCPU(item.price, item.uses), 0) / totalItems).toFixed(2)
    : "0.00";
  
  // --- 子组件: 管理列表 (Sub-component: Management Views) ---

  return (
    <div className="flex h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden">
      
      {/* 1 Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center text-white font-serif italic text-xl">A</div>
          <h1 className="text-2xl font-serif italic tracking-tight">Aichaku</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
          {[
            { id: 'All', icon: LayoutDashboard, label: 'Overview' },
            { id: 'Journal', icon: Calendar, label: 'Daily Journal' },
            { id: 'Closet', icon: Package, label: 'Closet' },
            { id: 'Beauty', icon: Sparkles, label: 'Beauty' },
            { id: 'Appliances', icon: Coffee, label: 'Appliances' },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveCategory(nav.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === nav.id ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}
            >
              <nav.icon size={18} />
              {nav.label}
            </button>
          ))}
        </nav>

        {/* User Profile Section at Sidebar Bottom */}
        <div className="pt-6 border-t border-stone-100">
          {!user ? (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-stone-100 text-stone-900 text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-all border border-stone-200"
            >
              <User size={14} /> Sign In
            </button>
          ) : (
            <div className="group relative">
              <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-stone-50 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-white text-xs font-bold uppercase">
                  {user.email.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">My Account</p>
                  <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                </div>
              <button 
                onClick={handleLogout}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-500 transition-all"
                title="Log out"
              >
                <LogOut size={14} />
              </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2 Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-20 bg-white border-b border-stone-200 flex items-center justify-between px-8">
          <div className="flex items-center bg-stone-100 px-4 py-2 rounded-full w-96">
            <Search size={16} className="text-stone-400 mr-2" />
            <input 
              className="bg-transparent border-none outline-none text-sm w-full"
              placeholder="Search your collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-sm hover:bg-stone-800 transition-all"
          >
            <Plus size={18} /> Add New Item
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Inventory Value</p>
              <p className="text-3xl font-serif italic">${items.reduce((a,b) => a+b.price, 0).toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Avg. Cost Per Use</p>
              <p className="text-3xl font-serif italic">${avgCPU}</p>
            </div>
            <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Reward Earned</p>
                <p className="text-3xl font-serif italic text-amber-400">$0.00</p>
              </div>
              <Award size={40} className="text-amber-400 opacity-50" />
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <h2 className="font-serif text-lg">{activeCategory} Collection</h2>
              <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-stone-200 transition-all"><Filter size={16}/></button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-stone-900" onClick={() => requestSort('price')}>
                    Price <ArrowUpDown size={10} className="inline ml-1" />
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-stone-900" onClick={() => requestSort('uses')}>
                    Total Uses <ArrowUpDown size={10} className="inline ml-1" />
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-stone-900" onClick={() => requestSort('cpu')}>
                    Cost Per Use <ArrowUpDown size={10} className="inline ml-1" />
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredAndSortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} className="w-10 h-10 rounded-lg object-cover shadow-sm" alt="" />
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{item.brand}</td>
                    <td className="px-6 py-4 text-sm">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">{item.uses}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${calculateCPU(item.price, item.uses) < 10 ? 'text-emerald-600' : 'text-stone-900'}`}>
                        ${calculateCPU(item.price, item.uses).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => logUsage(item.id)}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-auto bg-stone-900 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase transition-all hover:scale-105 shadow-md"
                      >
                        <CheckCircle2 size={12} /> Log Use
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 3 弹窗 Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onAuthSuccess={(userData) => setUser(userData)} 
      />

      {/* 4 弹窗 Add Item Modal */}
      
      <AddItemModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        user={user}
        categoriesData={categoriesData}
        setCategoriesData={setCategoriesData}
      />
      
    </div>
  );
};

export default App;