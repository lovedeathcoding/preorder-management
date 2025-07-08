import React from 'react';

interface DashboardTabProps {
  stats: any;
  recentPreorders: any[];
  upcomingDeliveries: any[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ stats, recentPreorders, upcomingDeliveries, formatCurrency, formatDate }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <span className="h-8 w-8 text-blue-600"><i className="icon-package" /></span>
          <div className="ml-4">
            <p className="text-sm text-gray-500">จำนวนออเดอร์</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <span className="h-8 w-8 text-green-600"><i className="icon-dollar-sign" /></span>
          <div className="ml-4">
            <p className="text-sm text-gray-500">ยอดรวม</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <span className="h-8 w-8 text-blue-600"><i className="icon-check-circle2" /></span>
          <div className="ml-4">
            <p className="text-sm text-gray-500">จ่ายแล้ว</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPaid)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <span className="h-8 w-8 text-red-600"><i className="icon-alert-circle" /></span>
          <div className="ml-4">
            <p className="text-sm text-gray-500">ยอดค้างจ่าย</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.remainingAmount)}</p>
          </div>
        </div>
      </div>
    </div>
    {/* Recent Orders and Upcoming Deliveries */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">พรีออเดอร์ล่าสุด</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentPreorders.map((preorder: any) => (
              <div key={preorder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {preorder.productImage && (
                    <img src={preorder.productImage} alt={preorder.productName} className="w-12 h-12 rounded-lg object-cover mr-3" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{preorder.productName}</p>
                    <p className="text-sm text-gray-500">{preorder.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(preorder.fullPrice)}</p>
                  <p className="text-sm text-gray-500">จ่าย: {formatCurrency(preorder.paidAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Upcoming Deliveries */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">กำหนดส่งใกล้ถึง</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingDeliveries.map((preorder: any) => (
              <div key={preorder.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <div>
                  <p className="font-medium text-gray-900">{preorder.productName}</p>
                  <p className="text-sm text-gray-600">กำหนดส่ง: {formatDate(preorder.deliveryDate)}</p>
                </div>
                <div className="text-right">
                  <span className="h-5 w-5 text-amber-600 ml-auto"><i className="icon-clock" /></span>
                  <p className="text-sm text-gray-600">{formatCurrency(preorder.fullPrice - preorder.paidAmount)} คงเหลือ</p>
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

export default DashboardTab; 