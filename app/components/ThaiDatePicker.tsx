// @ts-nocheck
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { th } from 'date-fns/locale';

// Workaround: ถ้าไม่มี @types/react-datepicker ให้ประกาศ module ชั่วคราว
// declare module 'react-datepicker';

interface ThaiDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

const thaiMonths = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

function formatThaiDate(date: Date | null) {
  if (!date) return '';
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({
  selected,
  onChange,
  placeholder = 'เลือกวันที่',
  className = 'w-full px-3 py-2 border border-pink-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold text-pink-700',
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      locale={th}
      dateFormat="d MMMM yyyy"
      placeholderText={placeholder}
      className={className}
      renderCustomHeader={({ date, decreaseMonth, increaseMonth }: any) => (
        <div className="flex items-center justify-between mb-2 px-2">
          <button type="button" onClick={decreaseMonth} className="p-1 bg-pink-100 hover:bg-pink-200 rounded text-pink-600 font-bold">←</button>
          <span className="font-extrabold text-pink-700">
            {thaiMonths[date.getMonth()]} {date.getFullYear() + 543}
          </span>
          <button type="button" onClick={increaseMonth} className="p-1 bg-pink-100 hover:bg-pink-200 rounded text-pink-600 font-bold">→</button>
        </div>
      )}
      calendarStartDay={0} // Sunday
      customInput={
        <input
          type="text"
          value={selected ? formatThaiDate(selected) : ''}
          placeholder={placeholder}
          className={className}
          readOnly
        />
      }
    />
  );
};

export default ThaiDatePicker; 