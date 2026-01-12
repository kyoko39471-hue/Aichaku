import React, { useState } from 'react';
import { X, Plus, Settings2, ChevronLeft, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- 1 子组件: 管理列表 (Sub-component: Management View) ---
const ManagementView = ({ title, list, onAdd, onRemove, onBack }) => {
  const [newItem, setNewItem] = useState('');
  return (
    <div className="space-y-6">
      {/* Header 比如categories */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-xl font-serif italic">{title}</h3>
      </div>

      {/* Add New Item 输入框和加号按钮 */}
      <div className="flex gap-2">
        <input 
          className="flex-1 bg-stone-50 border-stone-200 border rounded-xl px-4 py-2 outline-none focus:ring-2 ring-stone-200"
          placeholder={`New ${title.toLowerCase()} name...`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button 
          onClick={() => { onAdd(newItem); setNewItem(''); }}
          className="bg-stone-900 text-white px-4 py-2 rounded-xl hover:bg-stone-800 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Item List 列表展示 */}
      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {list.map(item => (
          <div key={item} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-stone-700">{item}</span>
            <button onClick={() => onRemove(item)} className="text-stone-400 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 2 主组件开始啦: 添加物品弹窗 (Main Component: Add Item Modal) ---
const AddItemModal = ({ isOpen, onClose, user, brands, setBrands, subcategories, setSubcategories }) => {

  // 2.1 UI 控制类 state（view / loading）
  const [view, setView] = useState('main');
  const [loading, setLoading] = useState(false);
  
  // 2.2 表单数据状态
  const [formData, setFormData] = useState({
    category: 'Closet',
    brand: '',
    itemName: '',
    subcategory: '',
    price: '',
    timesUsed: '0'
  });

  // 2.3 派生 / 辅助操作（addBrand / removeBrand / addSub / removeSub）添加和删除品牌与子类的函数
  const addBrand = (name) => { if (name && !brands.includes(name)) setBrands([...brands, name]); };
  const removeBrand = (name) => { setBrands(brands.filter(b => b !== name)); };
  const addSub = (name) => { if (name && !subcategories.includes(name)) setSubcategories([...subcategories, name]); };
  const removeSub = (name) => { setSubcategories(subcategories.filter(s => s !== name)); };

  //2.4 核心业务逻辑（handleAddItem）
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    // 暂时只处理登录用户，未来这里会增加 else { saveToIndexedDB() }
    if (!user) {
      alert("Guest mode (IndexedDB) is coming soon! Please sign in for now.");
      return;
    }

    setLoading(true);

    try {
      // 构造标准化的数据对象
      const newItem = {
        name: formData.itemName,
        category: formData.category,
        brand: formData.brand,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price) || 0,
        uses: parseInt(formData.timesUsed) || 0,
        
        // 核心元数据
        userId: user.uid,
        createdAt: serverTimestamp(), // 云端时间
        updatedAt: serverTimestamp(),
        
        // 预留字段：用于未来标记是否是从本地迁移过来的
        isSynced: true, 
        source: 'web-cloud'
      };

      // 写入路径：users/[uid]/items
      const itemsCollection = collection(db, "users", user.uid, "items");
      await addDoc(itemsCollection, newItem);

      // 成功后的处理
      setFormData({
        category: 'Closet',
        brand: '',
        itemName: '',
        subcategory: '',
        price: '',
        timesUsed: '0'
      });
      onClose();
      // 提示：在 PWA 中，静默成功通常比弹窗 alert 体验更好
      console.log("Item synced to cloud successfully!");

    } catch (error) {
      console.error("Firebase Save Error:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2.5. early return（isOpen）渲染部分
  if (!isOpen) return null;

  // 2.6. JSX return 主渲染返回
  return (
    // --- 弹窗背景和容器, 背景虚化，东西放中间---
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">

      {/* 弹窗内容 */}
      {isOpen && (
        //--- 弹窗白色容器，边角是圆角 ---
        <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden transition-all duration-300">
              {/* 内部填充区域 */}
            <div className="p-10">
                {/* 第一行，从上到下，从左到右：Header：Add to Collection, 标语，关闭按钮 */}
                {view === 'main' && (
                <div className="flex justify-between items-center mb-8">
                    <div>
                    <h3 className="text-3xl font-serif italic text-stone-900">Add to Collection</h3>
                    <p className="text-stone-400 text-sm mt-1 font-medium">Capture the details of your new piece</p>
                    </div>
                    <button onClick={() => { onClose(); setView('main'); }} className="bg-stone-100 p-2 rounded-full text-stone-400 hover:text-stone-600 transition-colors">
                    <X size={24} />
                    </button>
                </div>
                )}

                {/* Main Form View */}
                {view === 'main' && (
                <form className="space-y-6" onSubmit={handleAddItem}>
                    
                    {/* 1. 主要类别：衣橱，化妆品和电器。Category Selection */}
                    <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Core Category</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Closet', 'Beauty', 'Appliances'].map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData({...formData, category: cat})}
                            className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                            formData.category === cat 
                            ? 'bg-stone-900 text-white border-stone-900 shadow-lg' 
                            : 'bg-white text-stone-500 border-stone-100 hover:border-stone-300'
                            }`}
                        >
                            {cat}
                        </button>
                        ))}
                    </div>
                    </div>

                    {/* 2. 品牌和子类别：Brand & 4. Subcategory Grid */}
                    <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Brand</label>
                        <button type="button" onClick={() => setView('manage-brands')} className="text-stone-400 hover:text-stone-900 transition-colors">
                            <Settings2 size={14} />
                        </button>
                        </div>
                        <select 
                        required
                        className="w-full bg-stone-50 border-stone-200 border rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-stone-200"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        >
                        <option value="">Select Brand</option>
                        {brands.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Subcategory</label>
                        <button type="button" onClick={() => setView('manage-subs')} className="text-stone-400 hover:text-stone-900 transition-colors">
                            <Settings2 size={14} />
                        </button>
                        </div>
                        <select 
                        required
                        className="w-full bg-stone-50 border-stone-200 border rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-stone-200"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                        >
                        <option value="">Select Category</option>
                        {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    </div>

                    {/* 3. Item Name */}
                    <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Item Name</label>
                    <input 
                        required 
                        className="w-full bg-stone-50 border-stone-200 border rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-stone-200 shadow-inner" 
                        placeholder="e.g. Vintage Cashmere Sweater"
                        value={formData.itemName}
                        onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                    />
                    </div>

                    {/* 5. Price & 6. Times Used */}
                    <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Price ($)</label>
                        <input 
                        required 
                        type="number" 
                        step="0.01"
                        className="w-full bg-stone-50 border-stone-200 border rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-stone-200 shadow-inner" 
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Initial Times Used</label>
                        <input 
                        required 
                        type="number" 
                        className="w-full bg-stone-50 border-stone-200 border rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-stone-200 shadow-inner" 
                        placeholder="0"
                        value={formData.timesUsed}
                        onChange={(e) => setFormData({...formData, timesUsed: e.target.value})}
                        />
                    </div>
                    </div>

                    <button 
                    type="submit" 
                    className="w-full py-5 bg-stone-900 text-white rounded-[24px] font-bold uppercase tracking-[0.2em] text-sm shadow-xl hover:bg-stone-800 transition-all hover:-translate-y-1 active:translate-y-0"
                    >
                    Save to My Collection
                    </button>
                </form>
                )}

                {/* Management Views */}
                {view === 'manage-brands' && (
                <ManagementView 
                    title="Brands" 
                    list={brands} 
                    onAdd={addBrand} 
                    onRemove={removeBrand} 
                    onBack={() => setView('main')} 
                />
                )}
                {view === 'manage-subs' && (
                <ManagementView 
                    title="Subcategories" 
                    list={subcategories} 
                    onAdd={addSub} 
                    onRemove={removeSub} 
                    onBack={() => setView('main')} 
                />
                )}
            </div>
        </div>
     
      )}
    </div>
  );
};

export default AddItemModal;