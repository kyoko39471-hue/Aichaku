import { ArrowUpDown, CheckCircle2, Filter, Pencil, Trash2} from 'lucide-react';
import { calculateCPU } from '../../utils/calculations';
import Icon from '../Icon';
import { useState } from 'react'; 
import EditItemModal from '../modals/EditItemModal';

const renderItemIcon = (item, size = 40) => {
  if (!item.iconType || !item.iconValue) return null;

  if (item.iconType === 'emoji') {
    return <span style={{ fontSize: size }}>{item.iconValue}</span>;
  }

  if (item.iconType === 'custom') {
    return <Icon name={item.iconValue} size={size} />;
  }

  return null;
};

const ItemsTable = ({
  items,
  activeCategory,
  requestSort,
  logUsage,
  deleteItem,
  updateItem, // <-- NEW PROP
  user, // <-- NEW PROP
  categoriesData, 
  setCategoriesData, 
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleEditClick = (item) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };
  console.log('categoriesData:', categoriesData);
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
        <h2 className="font-serif text-lg">{activeCategory} Collection</h2>
        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-stone-200 transition-all">
          <Filter size={14} /> 
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100">
            <th className="px-6 py-4">Item</th>
            <th 
              className="px-6 py-4 cursor-pointer hover:text-stone-900"
              onClick={() => requestSort('brand')}
            >
              Brand <ArrowUpDown size={10} className="inline ml-1" />
            </th>

            <th
              className="px-6 py-4 cursor-pointer hover:text-stone-900"
              onClick={() => requestSort('price')}
            >
              Price <ArrowUpDown size={10} className="inline ml-1" />
            </th>

            <th
              className="px-6 py-4 cursor-pointer hover:text-stone-900"
              onClick={() => requestSort('uses')}
            >
              Total Uses <ArrowUpDown size={10} className="inline ml-1" />
            </th>

            <th
              className="px-6 py-4 cursor-pointer hover:text-stone-900"
              onClick={() => requestSort('cpu')}
            >
              Cost Per Use <ArrowUpDown size={10} className="inline ml-1" />
            </th>

            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stone-50">
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-stone-50/50 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center shadow-sm">
                    {renderItemIcon(item, 24)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter">
                      {item.category}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-sm">{item.brand}</td>
              <td className="px-6 py-4 text-sm">${item.price.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm">{item.uses}</td>

              <td className="px-6 py-4">
                <span
                  className={`text-sm font-bold ${
                    calculateCPU(item.price, item.uses) < 10
                      ? 'text-emerald-600'
                      : 'text-stone-900'
                  }`}
                >
                  ${calculateCPU(item.price, item.uses).toFixed(2)}
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {/* Log Usage Button */}
                  <button
                    title="Log Usage"
                    onClick={() => logUsage(item.id)}
                    className="p-2 bg-stone-100 text-stone-400 hover:bg-stone-900 hover:text-white rounded-xl transition-all shadow-sm"
                  >
                    <CheckCircle2 size={12} /> 
                  </button>

                  {/* Edit Item Button */}
                  <button
                    title="Edit Item"
                    onClick={() => handleEditClick(item)} // <-- UPDATE HANDLER
                    className="p-2 bg-stone-100 text-stone-400 hover:bg-stone-900 hover:text-white rounded-xl transition-all shadow-sm"
                  >
                    <Pencil size={15} />
                  </button>

                  {/* Delete Item Button */}
                  <button 
                    onClick={() => deleteItem(item.id)}
                    title="Delete Item"
                    className="p-2 bg-stone-100 text-stone-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* RENDER THE MODAL */}

      {isEditModalOpen && itemToEdit && (
        <EditItemModal 
          isOpen={isEditModalOpen} 
          onClose={handleCloseModal}
          item={itemToEdit}
          categoriesData={categoriesData}
          updateItem={updateItem}
        />
      )}
    </div>
  );
};

export default ItemsTable;
