import { useState, useEffect } from 'react';
import { X, Save, Sparkles, Tag, DollarSign, RotateCcw, Layers, Smile } from 'lucide-react';
import Icon from '../Icon';
import {
  CLOSET_ICON_NAMES,
  BEAUTY_ICON_NAMES,
  APPLIANCE_ICON_NAMES,
} from '../../icons/iconMap';

// --- 预设图标 / Emoji 库 ---
const ICON_SUGGESTIONS = {
  Closet: [
    ...CLOSET_ICON_NAMES.map(name => ({
      type: 'custom',
      value: name,
    })),
    { type: 'emoji', value: '👕' },
    { type: 'emoji', value: '👗' },
    { type: 'emoji', value: '👔' },
    { type: 'emoji', value: '👖' },
  ],
  Beauty: [
    ...BEAUTY_ICON_NAMES.map(name => ({
      type: 'custom',
      value: name,
    })),
    { type: 'emoji', value: '💄' },
    { type: 'emoji', value: '🧴' },
    { type: 'emoji', value: '💅' },
    { type: 'emoji', value: '✨' },
  ],
  Appliances: [
    ...APPLIANCE_ICON_NAMES.map(name => ({
      type: 'custom',
      value: name,
    })),
    { type: 'emoji', value: '💻' },
    { type: 'emoji', value: '📱' },
  ],
};
const renderEmojiLikeIcon = (icon, size = 24) => {
    if (!icon) return null;

    if (icon.type === 'emoji') {
      return <span style={{ fontSize: size }}>{icon.value}</span>;
    }   
    if (icon.type === 'custom') {
        return <Icon name={icon.value} size={size} />;
        }   
    return null;
};

const EditItemModal = ({ isOpen, onClose, item, categoriesData, updateItem }) => {

    /* EditItemModal 说明：
        ├─ 1. useState        （本地表单状态）
        ├─ 2. useEffect       （用 props 初始化 / 同步 state）
        ├─ 3. handleChange    （所有字段变化逻辑）
        ├─ 4. handleSubmit    （唯一的提交出口）
        └─ 5. return (UI)     （纯渲染）
    */

    /* 数据结构： 
    
        name,
        category,
        brand,
        subcategory,
        price,
        uses,
        iconType,
        iconValue    

    */

    const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    subcategory: '',
    price: '',
    uses: '',
    icon: { type: null, value: null },
    });

    const [showIconPicker, setShowIconPicker] = useState(false);
    const [iconTouched, setIconTouched] = useState(false);
    const [view, setView] = useState('main'); 

    useEffect(() => {
        if (!item) return;

        const category = item.category ?? '';

        const icon =
            item.iconType && item.iconValue
                ? { type: item.iconType, value: item.iconValue }
                : { type: null, value: null };

        const validIcons = ICON_SUGGESTIONS[category] ?? [];

        const isIconValid = validIcons.some(
            i => i.type === icon.type && i.value === icon.value
        );

        setFormData({
            name: item.name ?? '',
            category,
            brand: item.brand ?? '',
            subcategory: item.subcategory ?? '',
            price: item.price?.toString() ?? '',
            uses: item.uses?.toString() ?? '',
            icon: isIconValid ? icon : { type: null, value: null },
        });
    }, [item]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (newCategory) => {
        setFormData(prev => {
        // 如果用户已经选过 icon，就不动 icon
        if (iconTouched) {
            return {
            ...prev,
            category: newCategory,
            };
        }

        // 否则，自动切换为该分类的默认 icon
        return {
            ...prev,
            category: newCategory,
            icon: ICON_SUGGESTIONS[newCategory]?.[0] ?? null,
        };
        });
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;

    const updates = {
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand,
        subcategory: formData.subcategory,
        price: Number(formData.price) || 0,
        uses: Number(formData.uses) || 0,
        iconType: formData.icon?.type ?? null,
        iconValue: formData.icon?.value ?? null,
    };

    await updateItem(item.id, updates);
    onClose();
    };

    if (!isOpen) return null;

    return (
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
                            <h3 className="text-3xl font-serif italic text-stone-900">Update the Item</h3>
                            <p className="text-stone-400 text-sm mt-1 font-medium">Update the details of your existing piece</p>
                            </div>

                            <button onClick={() => { onClose(); setView('main'); }} className="bg-stone-100 p-2 rounded-full text-stone-400 hover:text-stone-600 transition-colors">
                            <X size={24} />
                            </button>
                        </div>
                        )}

                        {/* 图标选择预览区 */}
                        <div className="flex justify-center mb-4">
                            <div className="relative group">
                                <button 
                                    type="button"
                                    onClick={() => setShowIconPicker(!showIconPicker)}
                                    className="w-24 h-24 rounded-3xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center text-4xl hover:border-stone-900 hover:bg-white transition-all shadow-inner group"
                                >
                                    {renderEmojiLikeIcon(formData.icon, 36)}
                                    <div className="absolute -bottom-2 -right-2 bg-stone-900 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Smile size={14} />
                                    </div>
                                </button>

                                {/* 图标选择浮窗 */}
                                {showIconPicker && (
                                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-white border border-stone-100 shadow-2xl rounded-2xl p-4 z-10 animate-in fade-in zoom-in duration-200">
                                    <div className="grid grid-cols-5 gap-2">
                                    {ICON_SUGGESTIONS[formData.category]?.map((icon, index) => (
                                        <button
                                        key={`${icon.type}-${icon.value}-${index}`}
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, icon });
                                            setIconTouched(true);
                                            setShowIconPicker(false);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 rounded-lg transition-colors"
                                        >
                                        {renderEmojiLikeIcon(icon, 20)}
                                        </button>
                                    ))}
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>

                        {/* Main Form View */}
                        {view === 'main' && (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            
                            {/* 1. 主要类别：衣橱，化妆品和电器。Category Selection */}
                            <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Core Category</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Closet', 'Beauty', 'Appliances'].map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => handleCategoryChange(cat)}
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
                                    </div>
                                    
                                    <select 
                                    required
                                    className="w-full bg-stone-50 border-stone-200 border rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-stone-200"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                    >
                                    <option value="">Select Brand</option>
                                    {categoriesData?.brands?.[formData.category]?.map(b => (<option key={b} value={b}>{b}</option>))}
                                    </select>
                                    
                                </div>  
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Subcategory</label>
                                    </div>

                                    <select 
                                    required
                                    className="w-full bg-stone-50 border-stone-200 border rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-stone-200"
                                    value={formData.subcategory}
                                    onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                                    >
                                    <option value="">Select Subcategory</option>
                                    {categoriesData.subcategories[formData.category]?.map(s => <option key={s} value={s}>{s}</option>)}
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
                                    value={formData.name}
                                    onChange={(e) => 
                                        setFormData(prev => ({
                                            ...prev, 
                                            name: e.target.value
                                        }))
                                    }
                                />
                            </div>

                            {/* 4. Price & Times Used */}
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
                                    onChange={(e)=>
                                        setFormData(prev => ({
                                            ...prev,
                                            price: e.target.value
                                        }))
                                    }   
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Initial Times Used</label>
                                <input 
                                    required 
                                    type="number" 
                                    className="w-full bg-stone-50 border-stone-200 border rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-stone-200 shadow-inner" 
                                    placeholder="0"
                                    value={formData.uses}
                                    onChange={(e)=>
                                        setFormData(prev => ({
                                            ...prev,
                                            price: e.target.value
                                        }))
                                    }  
                                />
                            </div>
                            </div>
                            {/* 5. 提交按钮 */}
                            <button 
                            type="submit" 
                            className="w-full py-5 bg-stone-900 text-white rounded-[24px] font-bold uppercase tracking-[0.2em] text-sm shadow-xl hover:bg-stone-800 transition-all hover:-translate-y-1 active:translate-y-0"
                            >
                            Save to My Collection
                            </button>
                        </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

}

export default EditItemModal;
