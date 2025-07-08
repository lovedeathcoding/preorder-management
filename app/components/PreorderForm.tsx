import React, { useState, useEffect } from 'react';
import { formatUnixToLocalDate, toFullThaiDate } from '../util/util';
import ThaiDatePicker from './ThaiDatePicker';
import { TZDate } from '@date-fns/tz';
import TagInput from './TagInput';

interface PreorderFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (e: any) => void;
  handleFileChange: (e: any, fieldName: string) => void;
  isLoading: boolean;
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  editingPreorder: any;
  setEditingPreorder: React.Dispatch<React.SetStateAction<any>>;
  categories: string[];
  toDateInputValue: (dateString: string, forInput?: boolean) => string;
}

const PreorderForm: React.FC<PreorderFormProps> = ({
  formData,
  setFormData,
  handleSubmit,
  handleInputChange,
  handleFileChange,
  isLoading,
  showAddForm,
  setShowAddForm,
  editingPreorder,
  setEditingPreorder,
  categories,
  toDateInputValue,
}) => {
  const locale= "Asia/Bangkok"
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const now = new Date();
  const currentYear = now.getFullYear();
  const years = [currentYear, currentYear + 1];

  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  useEffect(() => {
    if (formData.deliveryMonth) {
      const [month, year] = formData.deliveryMonth.split(' ');
      setSelectedMonth(month || '');
      setSelectedYear(year || '');
    } else {
      setSelectedMonth('');
      setSelectedYear('');
    }
  }, [formData.deliveryMonth, showAddForm]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      setFormData((prev: any) => ({ ...prev, deliveryMonth: `${selectedMonth} ${selectedYear}` }));
    } else {
      setFormData((prev: any) => ({ ...prev, deliveryMonth: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

 //  console.log(formatUnixToLocalDate(formData.preorderDate))
  const preorderDate = formatUnixToLocalDate(formData.preorderDate)
  const deliveryDate = formatUnixToLocalDate(formData.deliveryDate)
   // ? new Date(preorderDate)
   //: null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-pink-100 via-yellow-100 to-red-100 rounded-2xl shadow-2xl border-4 border-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pink-200 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <h3 className="text-lg font-extrabold text-pink-700 drop-shadow">
            {editingPreorder ? 'แก้ไขพรีออเดอร์' : 'เพิ่มพรีออเดอร์ใหม่'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">ชื่อสินค้า *</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">หมวดหมู่</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">แท็ก</label>
            <TagInput
              tags={Array.isArray(formData.tags) ? formData.tags : (typeof formData.tags === 'string' && formData.tags ? formData.tags.split(',').map((t:string) => t.trim()).filter((t:string) => t) : [])}
              setTags={tagsArr => setFormData((prev: any) => ({ ...prev, tags: tagsArr }))}
              placeholder="พิมพ์แท็กแล้วกด Enter หรือ ,"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">ลิงค์พรีออเดอร์</label>
            <input
              type="url"
              name="preorderLink"
              value={formData.preorderLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">รูปสินค้า</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'productImage')}
              className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            />
            {formData.productImage && (
              <img src={formData.productImage} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-md shadow-lg" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">ราคาเต็ม *</label>
              <input
                type="number"
                name="fullPrice"
                value={formData.fullPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">จำนวนเงินที่จ่าย</label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              />
            </div>
          </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">วันที่พรีออเดอร์</label>
              <ThaiDatePicker
                selected={preorderDate}
                onChange={(date: Date | null) => setFormData((prev: any) => ({ ...prev, preorderDate: date ? date.toISOString() : '' }))}
                placeholder="เลือกวันที่"
                className="w-full px-3 py-2 border border-pink-200 rounded-md bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">วันที่รับสินค้า</label>
              <ThaiDatePicker
                selected={deliveryDate}
                onChange={(date: Date | null) => setFormData((prev: any) => ({ ...prev, deliveryDate: date ? date.toISOString() : '' }))}
                placeholder="เลือกวันที่"
                className="w-full px-3 py-2 border border-pink-200 rounded-md bg-white"
              />
              {/* {formData.deliveryDate && (
                <div className="text-xs text-gray-500 mt-1">{toFullThaiDate(formData.deliveryDate)}</div>
              )} */}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">หรือเดือนที่รับสินค้า</label>
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="w-1/2 px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="">เลือกเดือน</option>
                {thaiMonths.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="w-1/2 px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="">เลือกปี</option>
                {years.map(year => (
                  <option key={year + 543} value={String(year + 543)}>{year + 543}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">รายละเอียดการโอนเงิน</label>
            <textarea
              name="paymentDetails"
              value={formData.paymentDetails}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">สลิปการโอน</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'paymentSlip')}
              className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            />
            {formData.paymentSlip && (
              <img src={formData.paymentSlip} alt="Payment slip" className="mt-2 w-20 h-20 object-cover rounded-md shadow-lg" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">หมายเหตุ</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingPreorder(null);
                setFormData({
                  productName: '',
                  category: '',
                  preorderLink: '',
                  productImage: null,
                  fullPrice: 0,
                  paidAmount: 0,
                  preorderDate: '',
                  deliveryDate: '',
                  deliveryMonth: '',
                  paymentDetails: '',
                  paymentSlip: null,
                  notes: '',
                  tags: ''
                });
              }}
              className="px-4 py-2 text-sm font-medium text-pink-700 bg-pink-100 border border-pink-200 rounded-md hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-500 border border-transparent rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              {isLoading ? 'กำลังบันทึก...' : (editingPreorder ? 'อัพเดท' : 'เพิ่มพรีออเดอร์')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreorderForm; 