import React from 'react';

interface CategoriesTabProps {
  categoryStats: { [key: string]: { count: number; totalAmount: number; paidAmount: number } };
  formatCurrency: (amount: number) => string;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({ categoryStats, formatCurrency }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold text-gray-900">สถิติตามหมวดหมู่</h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categoryStats).map(([category, stat]: any) => (
          <div key={category} className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">{category}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">จำนวนรายการ:</span>
                <span className="font-medium">{stat.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ยอดรวม:</span>
                <span className="font-medium">{formatCurrency(stat.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">จ่ายแล้ว:</span>
                <span className="font-medium text-green-600">{formatCurrency(stat.paidAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">คงเหลือ:</span>
                <span className="font-medium text-red-600">{formatCurrency(stat.totalAmount - stat.paidAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CategoriesTab; 