import { ArrowUpDown, CheckCircle2, Filter } from 'lucide-react';
import { calculateCPU } from '../../utils/calculations';

const ItemsTable = ({
  items,
  activeCategory,
  requestSort,
  logUsage
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
        <h2 className="font-serif text-lg">{activeCategory} Collection</h2>
        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-stone-200 transition-all">
          <Filter size={16} />
        </button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100">
            <th className="px-6 py-4">Item</th>
            <th className="px-6 py-4">Brand</th>

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
                  <img
                    src={item.image}
                    className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    alt=""
                  />
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
  );
};

export default ItemsTable;
