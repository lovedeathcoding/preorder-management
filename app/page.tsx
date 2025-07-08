'use client'
import React, { useState, useEffect } from 'react';
import { PlusCircle, Package, Calendar, DollarSign, Camera, Link, Edit2, Trash2, AlertCircle, TrendingUp, Clock, CheckCircle2, FileText, Database, Wifi, WifiOff } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { th } from 'date-fns/locale/th';
import DashboardTab from './components/DashboardTab';
import PreordersTab from './components/PreordersTab';
import CategoriesTab from './components/CategoriesTab';
import PreorderForm from './components/PreorderForm';
import ThaiDatePicker from './components/ThaiDatePicker';
import { toFullThaiDate } from './util/util';

interface Preorder {
  id: number | string;
  productName: string;
  category: string;
  preorderLink: string;
  productImage: string | null;
  fullPrice: number;
  paidAmount: number;
  preorderDate: string;
  deliveryDate: string;
  deliveryMonth: string;
  paymentDetails: string;
  paymentSlip: string | null;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

const PreorderManagementSystem = () => {
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [categories, setCategories] = useState(['เสื้อผ้า', 'อุปกรณ์อิเล็กทรอนิกส์', 'เครื่องสำอาง', 'ของเล่น', 'หนังสือ', 'อื่นๆ']);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPreorder, setEditingPreorder] = useState<Preorder | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const [formData, setFormData] = useState<Omit<Preorder, 'id' | 'createdAt' | 'updatedAt'>>({
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
    notes: ''
  });

  const loadFromGrist = async () => {
    try {
      const response = await fetch('/api/preorder');
      if (response.ok) {
        const data = await response.json();
        const gristPreorders = data.records.map((record: any) => ({
          id: record.id,
          productName: record.fields.productName || '',
          category: record.fields.category || '',
          preorderLink: record.fields.preorderLink || '',
          productImage: record.fields.productImage || null,
          fullPrice: Number(record.fields.fullPrice) || 0,
          paidAmount: Number(record.fields.paidAmount) || 0,
          preorderDate: record.fields.preorderDate ?? '',
          deliveryDate: record.fields.deliveryDate ?? '',
          deliveryMonth: record.fields.deliveryMonth || '',
          paymentDetails: record.fields.paymentDetails || '',
          paymentSlip: record.fields.paymentSlip || null,
          notes: record.fields.notes || '',
          createdAt: record.fields.createdAt ?? new Date().toISOString(),
          updatedAt: record.fields.updatedAt || undefined,
        }));
        setPreorders(gristPreorders);
        setIsConnected(true);
        setSyncStatus('โหลดข้อมูลจาก Grist สำเร็จ');
      }
    } catch (error: any) {
      console.error('Error loading from Grist:', error);
      setSyncStatus('ไม่สามารถโหลดข้อมูลจาก Grist ได้');
      setIsConnected(false);
    }
  };

  const saveToGrist = async (preorderData: any, isUpdate = false) => {
    try {

      let response;
      if (isUpdate) {
        response = await fetch('/api/preorder', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
                id: preorderData.id,
            fields: {
              ...preorderData,
              updatedAt: new Date().toISOString(),
            },
          }),
        });
      } else {
        delete preorderData.id;
        response = await fetch('/api/preorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...preorderData,
            createdAt: preorderData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to save to Grist: ${response.status}`);
      }
      const result = await response.json();
      setSyncStatus('บันทึกข้อมูลใน Grist สำเร็จ');
      return result;
    } catch (error: any) {
      console.error('Error saving to Grist:', error);
      setSyncStatus(`เกิดข้อผิดพลาดในการบันทึก: ${error.message}`);
      throw error;
    }
  };

  const deleteFromGrist = async (id: string) => {
    try {
      const response = await fetch('/api/preorder', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete from Grist: ${response.status}`);
      }
      setSyncStatus('ลบข้อมูลจาก Grist สำเร็จ');
    } catch (error: any) {
      console.error('Error deleting from Grist:', error);
      setSyncStatus(`เกิดข้อผิดพลาดในการลบ: ${error.message}`);
      throw error;
    }
  };

  const createGristDocument = async () => {
    setSyncStatus('API นี้ไม่รองรับการสร้าง Document ใหม่ กรุณาตั้งค่าใน Grist ก่อน');
  };

  const syncAllData = async () => {
    try {
      setIsLoading(true);
      setSyncStatus('กำลังซิงค์ข้อมูลทั้งหมด...');
      
      // First try to load from Grist
      await loadFromGrist();
      
      // If we have local data that's not in Grist, upload it
      const localData = localStorage.getItem('preorders');
      if (localData) {
        const localPreorders = JSON.parse(localData);
        for (const preorder of localPreorders) {
          try {
            await saveToGrist(preorder, false);
          } catch (error:any) {
            console.error('Error syncing preorder:', error);
          }
        }
      }
      
      setSyncStatus('ซิงค์ข้อมูลสำเร็จ');
    } catch (error:any) {
      console.error('Error syncing data:', error);
      setSyncStatus(`เกิดข้อผิดพลาดในการซิงค์: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPreorders = localStorage.getItem('preorders');
    if (savedPreorders && !isConnected) {
      setPreorders(JSON.parse(savedPreorders));
    }
    // ตรวจสอบการเชื่อมต่อ Grist อัตโนมัติ
    testGristConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- autosave form draft ---
  useEffect(() => {
    if (showAddForm) {
      localStorage.setItem('preorder-form-draft', JSON.stringify(formData));
    }
  }, [formData, showAddForm]);

  // --- load draft when open form ---
  useEffect(() => {
    if (showAddForm) {
      const draft = localStorage.getItem('preorder-form-draft');
      if (draft) {
        setFormData(JSON.parse(draft));
      }
    }
    // ถ้าปิดฟอร์ม ให้ล้าง draft
    if (!showAddForm) {
      localStorage.removeItem('preorder-form-draft');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddForm]);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e:any, fieldName:string) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e:any) => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: e.target.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newPreorder = {
        id: editingPreorder ? editingPreorder.id : Date.now(),
        ...formData,
        fullPrice: formData.fullPrice || 0,
        paidAmount: formData.paidAmount || 0,
        createdAt: editingPreorder ? editingPreorder.createdAt : new Date().toISOString()
      };
      // Save to Grist if connected
      if (isConnected) {
        await saveToGrist(newPreorder, !!editingPreorder);
      }
      // Update local state
      let updatedPreorders;
      if (editingPreorder) {
        updatedPreorders = preorders.map(p => p.id === editingPreorder.id ? newPreorder : p);
        setPreorders(updatedPreorders);
        setEditingPreorder(null);
      } else {
        updatedPreorders = [...preorders, newPreorder];
        setPreorders(updatedPreorders);
      }
      // save to localStorage เฉพาะตอนเพิ่ม/แก้ไข
      localStorage.setItem('preorders', JSON.stringify(updatedPreorders));
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
        notes: ''
      });
      setShowAddForm(false);
      // --- ลบ draft เมื่อบันทึกสำเร็จ ---
      localStorage.removeItem('preorder-form-draft');
      if (isConnected) {
        setSyncStatus('บันทึกข้อมูลสำเร็จ');
      }
    } catch (error:any) {
      console.error('Error saving preorder:', error);
      setSyncStatus(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (preorder: Preorder) => {
    setEditingPreorder(preorder);
    setFormData(preorder);
    setShowAddForm(true);
  };

  const handleDelete = async (id:string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
      try {
        setIsLoading(true);
        // Delete from Grist if connected
        if (isConnected) {
          await deleteFromGrist(id);
        }
        // Update local state
        const updatedPreorders = preorders.filter(p => p.id !== id);
        setPreorders(updatedPreorders);
        // save to localStorage หลังลบ
        localStorage.setItem('preorders', JSON.stringify(updatedPreorders));
        if (isConnected) {
          setSyncStatus('ลบข้อมูลสำเร็จ');
        }
      } catch (error:any) {
        console.error('Error deleting preorder:', error);
        setSyncStatus(`เกิดข้อผิดพลาดในการลบ: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getUpcomingDeliveries = () => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    return preorders.filter(preorder => {
      if (preorder.deliveryDate) {
        const deliveryDate = new Date(preorder.deliveryDate);
        return deliveryDate >= today && deliveryDate <= nextMonth;
      }
      return false;
    }).sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());
  };

  const getRecentPreorders = () => {
    return preorders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getCategoryStats = () => {
    const stats: { [key: string]: { count: number; totalAmount: number; paidAmount: number } } = {};
    categories.forEach((category:any) => {
      const categoryPreorders = preorders.filter((p:any) => p.category === category);
      stats[category] = {
        count: categoryPreorders.length,
        totalAmount: categoryPreorders.reduce((sum, p) => sum + p.fullPrice, 0),
        paidAmount: categoryPreorders.reduce((sum, p) => sum + p.paidAmount, 0)
      };
    });
    return stats;
  };

  const getTotalStats = () => {
    const totalOrders = preorders.length;
    const totalAmount = preorders.reduce((sum:number, p:any) => sum + p.fullPrice, 0);
    const totalPaid = preorders.reduce((sum:number, p:any) => sum + p.paidAmount, 0);
    const remainingAmount = totalAmount - totalPaid;
    
    return { totalOrders, totalAmount, totalPaid, remainingAmount };
  };

  const formatCurrency = (amount:number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const stats = getTotalStats();
  const categoryStats = getCategoryStats();
  const upcomingDeliveries = getUpcomingDeliveries();
  const recentPreorders = getRecentPreorders();

  // --- เพิ่มฟังก์ชันทดสอบการเชื่อมต่อ ---
  const testGristConnection = async () => {
    setIsLoading(true);
    setSyncStatus('กำลังทดสอบการเชื่อมต่อ Grist...');
    try {
      const res = await fetch('/api/preorder');
      if (res.ok) {
        setIsConnected(true);
        setSyncStatus('เชื่อมต่อ Grist สำเร็จ!');
      } else {
        setIsConnected(false);
        setSyncStatus('เชื่อมต่อ Grist ไม่สำเร็จ');
      }
    } catch (e) {
      setIsConnected(false);
      setSyncStatus('เชื่อมต่อ Grist ไม่สำเร็จ');
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันแปลงวันที่สำหรับ input type="date"
  function toDateInputValue(dateString: string, forInput: boolean = true) {
    if (!dateString) return '';
    // // ถ้าเป็น YYYY-MM-DD อยู่แล้ว
    // if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    //   if (forInput) return dateString;
    //   // dd-mm-yyyy (ปี พ.ศ.)
    //   const [y, m, d] = dateString.split('-');
    //   const buddhistYear = (parseInt(y, 10) + 543).toString();
    //   return `${d}-${m}-${buddhistYear}`;
    // }
    // ถ้าเป็นตัวเลขล้วน (timestamp วินาที)
    if (/^\d{10}$/.test(dateString)) {
      const d = new Date(Number(dateString) * 1000);
      if (isNaN(d.getTime())) return '';
      if (forInput) return d.toISOString().slice(0, 10);
      // dd-mm-yyyy (ปี พ.ศ.)
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const buddhistYear = (d.getFullYear() + 543).toString();
      return `${day}-${month}-${buddhistYear}`;
    }
    // ถ้าเป็นตัวเลข 13 หลัก (timestamp ms)
    if (/^\d{13}$/.test(dateString)) {
      const d = new Date(Number(dateString));
      if (isNaN(d.getTime())) return '';
      if (forInput) return d.toISOString().slice(0, 10);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const buddhistYear = (d.getFullYear() + 543).toString();
      return `${day}-${month}-${buddhistYear}`;
    }
    // ปกติ
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    if (forInput) return d.toISOString().slice(0, 10);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const buddhistYear = (d.getFullYear() + 543).toString();
    return `${day}-${month}-${buddhistYear}`;
  }

  registerLocale('th', th);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">ระบบบันทึกการพรีออเดอร์</h1>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <div className="flex items-center text-green-600">
                    <Wifi size={16} className="mr-1" />
                    <span className="text-sm">เชื่อมต่อ Grist</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <WifiOff size={16} className="mr-1" />
                    <span className="text-sm">ไม่เชื่อมต่อ</span>
                  </div>
                )}
                {syncStatus && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {syncStatus}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <PlusCircle size={20} />
                เพิ่มพรีออเดอร์
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'แดชบอร์ด', icon: TrendingUp },
              { id: 'preorders', label: 'รายการพรีออเดอร์', icon: Package },
              { id: 'categories', label: 'หมวดหมู่', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            stats={stats}
            recentPreorders={recentPreorders}
            upcomingDeliveries={upcomingDeliveries}
            formatCurrency={formatCurrency}
            formatDate={toFullThaiDate}
          />
        )}

        {/* Preorders Tab */}
        {activeTab === 'preorders' && (
          <PreordersTab
            preorders={preorders}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            formatCurrency={formatCurrency}
            formatDate={toFullThaiDate}
          />
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <CategoriesTab
            categoryStats={categoryStats}
            formatCurrency={formatCurrency}
          />
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <PreorderForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          isLoading={isLoading}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          editingPreorder={editingPreorder}
          setEditingPreorder={setEditingPreorder}
          categories={categories}
          toDateInputValue={toDateInputValue}
          
        />
      )}
    </div>
  );
};

export default PreorderManagementSystem;