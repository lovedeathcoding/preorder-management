import React from 'react';

interface DashboardTabProps {
  stats: any;
  recentPreorders: any[];
  upcomingDeliveries: any[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ stats, recentPreorders, upcomingDeliveries, formatCurrency, formatDate }) => {
  // ฟังก์ชันหาหมวดหมู่ที่มียอดซื้อสูงสุด พร้อมจำนวนออเดอร์
  const getTopCategory = () => {
    const categoryTotals: Record<string, { total: number; count: number }> = {};
    recentPreorders.forEach((preorder: any) => {
      if (preorder.category) {
        if (!categoryTotals[preorder.category]) {
          categoryTotals[preorder.category] = { total: 0, count: 0 };
        }
        categoryTotals[preorder.category].total += preorder.fullPrice || 0;
        categoryTotals[preorder.category].count += 1;
      }
    });
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1].total - a[1].total);
    if (sorted.length === 0) return null;
    return { category: sorted[0][0], total: sorted[0][1].total, count: sorted[0][1].count };
  };
  const topCategory = getTopCategory();

  // ฟังก์ชันเลือก emoji ตามชื่อหมวดหมู่ (ตัวอย่าง)
  const getCategoryEmoji = (category: string) => {
    if (!category) return '📦';
    if (category.includes('เสื้อ')) return '👕';
    if (category.includes('รองเท้า')) return '👟';
    if (category.includes('เครื่องสำอาง')) return '💄';
    if (category.includes('อาหาร')) return '🍱';
    if (category.includes('ของเล่น')) return '🧸';
    return '📦';
  };

  return (
    <div className="space-y-6">
      {/* Top Category Summary */}
      {topCategory && (
        <div className="relative overflow-hidden rounded-2xl shadow-2xl p-6 mb-5 animate-fade-in bg-gradient-to-br from-pink-50 via-yellow-50 to-white border-4 border-white">
          <div className="absolute -top-8 -right-8 opacity-30 text-[8rem] pointer-events-none select-none animate-pulse">{getCategoryEmoji(topCategory.category)}</div>
          <div className="relative z-10 flex items-center gap-4">
            <span className="h-14 w-14 flex items-center justify-center rounded-full bg-white bg-opacity-90 shadow-lg text-4xl border-2 border-pink-200 animate-bounce-slow">
              {getCategoryEmoji(topCategory.category)}
            </span>
            <div>
              <p className="text-xl font-extrabold text-pink-800 drop-shadow-[0_2px_8px_rgba(255,115,179,0.8)] tracking-wide">หมวดหมู่ยอดนิยม</p>
              <p className="text-2xl font-black text-yellow-900 drop-shadow-[0_2px_12px_rgba(255,255,0,0.7)] mt-1">{topCategory.category}</p>
              <div className="flex gap-4 mt-2">
                <span className="bg-white bg-opacity-90 rounded px-3 py-1 text-pink-600 font-bold shadow-lg drop-shadow-[0_2px_8px_rgba(236,72,153,0.7)] border border-pink-200">ยอดซื้อรวม: {formatCurrency(topCategory.total)}</span>
                <span className="bg-white bg-opacity-90 rounded px-3 py-1 text-amber-700 font-bold md:font-regular shadow-lg drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)] border border-yellow-200">ออเดอร์: {topCategory.count}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 border-2 border-white flex items-center">
          <span className="h-10 w-10 flex items-center justify-center rounded-full bg-white bg-opacity-90 shadow text-2xl border-2 border-sky-200 mr-4">📦</span>
          <div>
            <p className="text-sm text-blue-900 font-semibold drop-shadow">จำนวนออเดอร์</p>
            <p className="text-2xl font-extrabold text-blue-900 drop-shadow-lg">{stats.totalOrders}</p>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50 rounded-2xl shadow-xl p-6 border-2 border-white flex items-center">
          <span className="h-10 w-10 flex items-center justify-center rounded-full bg-white bg-opacity-90 shadow text-2xl border-2 border-pink-200 mr-4">💰</span>
          <div>
            <p className="text-sm text-pink-800 font-semibold drop-shadow">ยอดรวม</p>
            <p className="text-2xl font-extrabold text-pink-900 drop-shadow-lg">{formatCurrency(stats.totalAmount)}</p>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 rounded-2xl shadow-xl p-6 border-2 border-white flex items-center">
          <span className="h-10 w-10 flex items-center justify-center rounded-full bg-white bg-opacity-90 shadow text-2xl border-2 border-green-200 mr-4">✅</span>
          <div>
            <p className="text-sm text-green-900 font-semibold drop-shadow">จ่ายแล้ว</p>
            <p className="text-2xl font-extrabold text-green-900 drop-shadow-lg">{formatCurrency(stats.totalPaid)}</p>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-gradient-to-br from-red-50 via-amber-50 to-yellow-50 rounded-2xl shadow-xl p-6 border-2 border-white flex items-center">
          <span className="h-10 w-10 flex items-center justify-center rounded-full bg-white bg-opacity-90 shadow text-2xl border-2 border-red-200 mr-4">⚠️</span>
          <div>
            <p className="text-sm text-red-900 font-semibold drop-shadow">ยอดค้างจ่าย</p>
            <p className="text-2xl font-extrabold text-red-900 drop-shadow-lg">{formatCurrency(stats.remainingAmount)}</p>
          </div>
        </div>
      </div>
      {/* Recent Orders and Upcoming Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-pink-50 via-yellow-50 to-white border-2 border-white">
          <div className="p-6 border-b border-pink-200 flex items-center gap-2">
            <span className="text-2xl">🕒</span>
            <h3 className="text-lg font-extrabold text-pink-800 drop-shadow">พรีออเดอร์ล่าสุด</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPreorders.map((preorder: any) => (
                <div key={preorder.id} className="flex items-center justify-between p-4 bg-white bg-opacity-80 rounded-xl shadow border-l-4 border-pink-300">
                  <div className="flex items-center">
                    {preorder.productImage && (
                      <img src={preorder.productImage} alt={preorder.productName} className="w-12 h-12 rounded-lg object-cover mr-3 border-2 border-pink-200" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900 drop-shadow">{preorder.productName}</p>
                      <p className="text-sm text-pink-600 font-semibold flex items-center gap-1">{getCategoryEmoji(preorder.category)} {preorder.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-800 drop-shadow">{formatCurrency(preorder.fullPrice)}</p>
                    <p className="text-sm text-green-600 font-bold drop-shadow">จ่าย: {formatCurrency(preorder.paidAmount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Upcoming Deliveries */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-yellow-50 via-amber-50 to-white border-2 border-white">
          <div className="p-6 border-b border-yellow-200 flex items-center gap-2">
            <span className="text-2xl">🚚</span>
            <h3 className="text-lg font-extrabold text-yellow-900 drop-shadow">กำหนดส่งใกล้ถึง</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeliveries.map((preorder: any) => (
                <div key={preorder.id} className="flex items-center justify-between p-4 bg-white bg-opacity-80 rounded-xl shadow border-l-4 border-yellow-300">
                  <div>
                    <p className="font-bold text-gray-900 drop-shadow">{preorder.productName}</p>
                    <p className="text-sm text-yellow-900 font-semibold">กำหนดส่ง: {formatDate(preorder.deliveryDate)}</p>
                  </div>
                  <div className="text-right">
                    <span className="h-5 w-5 text-amber-600 ml-auto text-xl">⏰</span>
                    <p className="text-sm text-red-500 font-bold drop-shadow">{formatCurrency(preorder.fullPrice - preorder.paidAmount)} คงเหลือ</p>
                  </div>
                </div>
              ))}
              {upcomingDeliveries.length === 0 && (
                <p className="text-gray-500 text-center py-8">ไม่มีรายการที่ใกล้ถึงกำหนดส่ง</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab; 