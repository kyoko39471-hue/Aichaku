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
import { useAuth } from './hooks/useAuth';
import { useCategories } from './hooks/useCategories';
import { useItems } from './hooks/useItems';
import ItemsTable from './components/dashboard/ItemsTable';
import AuthModal from './components/modals/AuthModal';
import AddItemModal from './components/modals/AddItemModal';
import { calculateCPU, calculateAverageCPU, compareByCPU } from './utils/calculations';
 
// --- Main App Component ---
const App = () => {
  // State Management
  const { user, logout } = useAuth();   // 用户登录，用户登出
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'cpu', direction: 'desc' });
  const [showAddModal, setShowAddModal] = useState(false);

// Inside App component:

  // hook加载categories数据
  const { categoriesData, setCategoriesData } = useCategories(user);

  const {
    items,
    loading,
    addItem,
    logUsage,
    deleteItem,
    updateItem
  } = useItems(user);

  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => 
      (activeCategory === 'All' || item.category === activeCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (sortConfig.key) {
    result.sort((a, b) => {
      if (sortConfig.key === 'cpu') {
        return compareByCPU(a, b, sortConfig.direction);
      }

      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === 'brand' || sortConfig.key === 'subcategory') {
        valA = (valA || '').toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

    return result;
  }, [items, activeCategory, searchQuery, sortConfig]);

  // Sorting handler
  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
    setSortConfig({ key, direction });
  };

  const avgCPU = calculateAverageCPU(items).toFixed(2);
  
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
                onClick={logout}
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
                <p className="text-3xl font-serif italic text-amber-400">$5.00</p>
              </div>
              <Award size={40} className="text-amber-400 opacity-50" />
            </div>
          </div>

            {/* Data Table */}
            <ItemsTable
              items={filteredAndSortedItems}
              activeCategory={activeCategory}
              requestSort={requestSort}
              logUsage={logUsage}
              deleteItem={deleteItem}
              updateItem={updateItem}
              categoriesData={categoriesData}       // 之前忘了加了
              setCategoriesData={setCategoriesData} // 之前忘了加了
            />
          </div>
      </main>

      {/* 3 弹窗 Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => setShowAuthModal(false)}
      />

      {/* 4 弹窗 Add Item Modal */}
      
      <AddItemModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        user={user}
        categoriesData={categoriesData}
        setCategoriesData={setCategoriesData}
        addItem={addItem}   // 👈 新增
      />
      
    </div>
  );
};

export default App;