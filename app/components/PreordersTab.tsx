import React from 'react';

interface PreordersTabProps {
  preorders: any[];
  handleEdit: (preorder: any) => void;
  handleDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const getCategoryEmoji = (category: string) => {
  if (!category) return '📦';
  if (category.includes('เสื้อ')) return '👕';
  if (category.includes('รองเท้า')) return '👟';
  if (category.includes('เครื่องสำอาง')) return '💄';
  if (category.includes('อาหาร')) return '🍱';
  if (category.includes('ของเล่น')) return '🧸';
  return '📦';
};

const PreordersTab: React.FC<PreordersTabProps> = ({ preorders, handleEdit, handleDelete, formatCurrency, formatDate }) => (
  <div className="bg-white rounded-lg shadow md:mx-0 mx-1">
    <div className="p-3 md:p-6 border-b">
      <h3 className="text-base md:text-lg font-semibold text-gray-900">รายการพรีออเดอร์ทั้งหมด</h3>
    </div>
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-pink-50">
      <table className="min-w-[600px] md:min-w-full divide-y divide-gray-200 text-xs md:text-sm">
        <thead className="bg-gradient-to-r from-pink-50 via-yellow-50 to-white">
          <tr>
            <th className="px-6 py-2 md:py-3 text-left text-xs md:text-sm lg:text-base font-bold text-pink-800 uppercase tracking-wider drop-shadow">สินค้า</th>
            <th className="px-6 py-2 md:py-3 text-left text-xs md:text-sm lg:text-base font-bold text-yellow-900 uppercase tracking-wider drop-shadow">หมวดหมู่</th>
            <th className="px-6 py-2 md:py-3 text-left text-xs md:text-sm lg:text-base font-bold text-pink-800 uppercase tracking-wider drop-shadow">ราคา</th>
            <th className="px-6 py-2 md:py-3 text-left text-xs md:text-sm lg:text-base font-bold text-green-800 uppercase tracking-wider drop-shadow">จ่ายแล้ว</th>
            <th className="px-6 py-2 md:py-3 text-left text-xs md:text-sm lg:text-base font-bold text-amber-800 uppercase tracking-wider drop-shadow">กำหนดส่ง</th>
            <th className="px-6 py-2 md:py-3 text-left text-xs md:text-sm lg:text-base font-bold text-gray-900 uppercase tracking-wider drop-shadow">การจัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {preorders.map((preorder: any) => (
            <tr key={preorder.id} className="hover:bg-pink-50 hover:shadow-lg transition-all">
              <td className="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {preorder.productImage && (
                    <img src={preorder.productImage} alt={preorder.productName} className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover mr-2 md:mr-3 shadow" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 text-xs md:text-sm">{preorder.productName}</p>
                    {preorder.preorderLink && (
                      <a href={preorder.preorderLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm flex items-center gap-1">
                        ลิงค์
                      </a>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm flex items-center gap-1 md:gap-2 text-yellow-800 font-bold">
                <span className="text-xl">{getCategoryEmoji(preorder.category)}</span>
                {preorder.category}
              </td>
              <td className="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-pink-600 font-bold drop-shadow">{formatCurrency(preorder.fullPrice)}</td>
              <td className="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm">
                <div className="text-sm text-green-600 font-bold drop-shadow">{formatCurrency(preorder.paidAmount)}</div>
                <div className="text-xs text-red-500 font-bold drop-shadow">คงเหลือ: {formatCurrency(preorder.fullPrice - preorder.paidAmount)}</div>
              </td>
              <td className="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-amber-700 font-bold drop-shadow">
                {preorder.deliveryDate ? formatDate(preorder.deliveryDate) : preorder.deliveryMonth || 'ไม่ระบุ'}
              </td>
              <td className="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                <div className="flex space-x-1 md:space-x-2">
                  <button
                    onClick={() => handleEdit(preorder)}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-900 font-bold px-2 md:px-3 py-1 rounded shadow transition-all text-xs md:text-sm"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(preorder.id)}
                    className="bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-900 font-bold px-2 md:px-3 py-1 rounded shadow transition-all text-xs md:text-sm"
                  >
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {preorders.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <div className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400">📦</div>
          <h3 className="mt-2 text-xs md:text-sm font-medium text-gray-900">ไม่มีรายการพรีออเดอร์</h3>
          <p className="mt-1 text-xs md:text-sm text-gray-500">เริ่มต้นด้วยการเพิ่มรายการพรีออเดอร์แรกของคุณ</p>
        </div>
      )}
    </div>
  </div>
);

export default PreordersTab; 