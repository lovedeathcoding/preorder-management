import React from 'react';

interface PreordersTabProps {
  preorders: any[];
  handleEdit: (preorder: any) => void;
  handleDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const PreordersTab: React.FC<PreordersTabProps> = ({ preorders, handleEdit, handleDelete, formatCurrency, formatDate }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold text-gray-900">รายการพรีออเดอร์ทั้งหมด</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จ่ายแล้ว</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กำหนดส่ง</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การจัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {preorders.map((preorder: any) => (
            <tr key={preorder.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {preorder.productImage && (
                    <img src={preorder.productImage} alt={preorder.productName} className="w-10 h-10 rounded-lg object-cover mr-3" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{preorder.productName}</p>
                    {preorder.preorderLink && (
                      <a href={preorder.preorderLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                        ลิงค์
                      </a>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{preorder.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(preorder.fullPrice)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatCurrency(preorder.paidAmount)}</div>
                <div className="text-xs text-gray-500">คงเหลือ: {formatCurrency(preorder.fullPrice - preorder.paidAmount)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {preorder.deliveryDate ? formatDate(preorder.deliveryDate) : preorder.deliveryMonth || 'ไม่ระบุ'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(preorder)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(preorder.id)}
                    className="text-red-600 hover:text-red-900"
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
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">📦</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีรายการพรีออเดอร์</h3>
          <p className="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการเพิ่มรายการพรีออเดอร์แรกของคุณ</p>
        </div>
      )}
    </div>
  </div>
);

export default PreordersTab; 