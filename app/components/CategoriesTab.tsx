import React from 'react';

interface CategoriesTabProps {
  categoryStats: { [key: string]: { count: number; totalAmount: number; paidAmount: number } };
  formatCurrency: (amount: number) => string;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({ categoryStats, formatCurrency }) => {
  // ฟังก์ชันเลือก emoji ตามชื่อหมวดหมู่ (เหมือน DashboardTab)
  const getCategoryEmoji = (category: string) => {
    if (!category) return '📦';
    if (category.includes('เสื้อ')) return '👕';
    if (category.includes('รองเท้า')) return '👟';
    if (category.includes('เครื่องสำอาง')) return '💄';
    if (category.includes('อาหาร')) return '🍱';
    if (category.includes('ของเล่น')) return '🧸';
    return '📦';
  };

  // ฟังก์ชันเลือก gradient ตามชื่อหมวดหมู่
  const getCategoryGradient = (category: string) => {
    if (!category) return 'from-yellow-50 via-pink-50 to-white';
    if (category.includes('เสื้อ')) return 'from-sky-50 via-blue-50 to-purple-50';
    if (category.includes('รองเท้า')) return 'from-amber-50 via-orange-50 to-yellow-50';
    if (category.includes('เครื่องสำอาง')) return 'from-pink-50 via-fuchsia-50 to-purple-50';
    if (category.includes('อาหาร')) return 'from-lime-50 via-green-50 to-yellow-50';
    if (category.includes('ของเล่น')) return 'from-cyan-50 via-blue-50 to-yellow-50';
    return 'from-yellow-50 via-pink-50 to-white';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">สถิติตามหมวดหมู่</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categoryStats).map(([category, stat]: any) => (
            <div
              key={category}
              className={`relative overflow-hidden rounded-2xl shadow-xl p-6 border-2 border-white bg-gradient-to-br ${getCategoryGradient(category)} animate-fade-in`}
            >
              <div className="absolute -top-6 -right-6 opacity-20 text-[5rem] pointer-events-none select-none animate-pulse">{getCategoryEmoji(category)}</div>
              <div className="relative z-10 flex items-center gap-3 mb-4">
                <span className="h-10 w-10 flex items-center justify-center rounded-full bg-white bg-opacity-90 shadow text-2xl border-2 border-yellow-200">
                  {getCategoryEmoji(category)}
                </span>
                <h4 className="font-extrabold text-pink-800 text-lg drop-shadow-[0_2px_8px_rgba(236,72,153,0.5)]">{category}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-900 font-semibold">จำนวนรายการ:</span>
                  <span className="font-bold text-yellow-900 drop-shadow">{stat.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-900 font-semibold">ยอดรวม:</span>
                  <span className="font-bold text-pink-600 drop-shadow">{formatCurrency(stat.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-900 font-semibold">จ่ายแล้ว:</span>
                  <span className="font-bold text-green-600 drop-shadow">{formatCurrency(stat.paidAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-900 font-semibold">คงเหลือ:</span>
                  <span className="font-bold text-red-500 drop-shadow">{formatCurrency(stat.totalAmount - stat.paidAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab; 