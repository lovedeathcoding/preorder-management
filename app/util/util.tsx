
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * แปลง Unix timestamp เป็นวันที่ในรูปแบบที่มนุษย์อ่านได้
 * @param {number} unixTimestamp - Unix timestamp (เช่น 1751932800)
 * @param {string} [formatStr='yyyy-MM-dd'] - รูปแบบวันที่
 * @param {string} [timeZone='Asia/Bangkok'] - timezone
 * @returns {string|null}
 */
export function formatUnixToLocalDateStr(
  unixTimestamp: string | number,
  formatStr: string = 'yyyy-MM-dd',
  timeZone: string = 'Asia/Bangkok'
) {
  try {
    let ts: number;
    if (typeof unixTimestamp === 'string') {
      ts = Number(unixTimestamp);
      if (isNaN(ts)) throw new Error('Unix timestamp string ไม่ถูกต้อง');
    } else {
      ts = unixTimestamp;
    }
    const date = new Date(ts * 1000); // แปลงจาก seconds → milliseconds
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, formatStr);
  } catch (error) {
    console.error('Invalid Unix timestamp:', error);
    return null;
  }
}
export function formatUnixToLocalDate(
    unixTimestamp: string | number,
    formatStr: string = 'yyyy-MM-dd',
    timeZone: string = 'Asia/Bangkok'
  ) {
    try {
      let ts: number;
      if (typeof unixTimestamp === 'string') {
        ts = Number(unixTimestamp);
        if (isNaN(ts)) throw new Error('Unix timestamp string ไม่ถูกต้อง');
      } else {
        ts = unixTimestamp;
      }
      const date = new Date(ts * 1000); // แปลงจาก seconds → milliseconds
      const zonedDate = toZonedTime(date, timeZone);
      return zonedDate;
    } catch (error) {
      console.error('Invalid Unix timestamp:', error);
      return null;
    }
  }

export function toFullThaiDate(input: string | number | Date): string {
  let d: Date;
  if (typeof input === 'number') {
    // ถ้าเป็น timestamp วินาที (10 หลัก)
    if (input.toString().length === 10) {
      d = new Date(input * 1000);
    } else {
      // timestamp มิลลิวินาที (13 หลัก)
      d = new Date(input);
    }
  } else if (typeof input === 'string') {
    // ถ้าเป็น string ที่เป็นตัวเลขล้วน
    if (/^\d{10}$/.test(input)) {
      d = new Date(Number(input) * 1000);
    } else if (/^\d{13}$/.test(input)) {
      d = new Date(Number(input));
    } else {
      d = new Date(input);
    }
  } else {
    d = input;
  }
  if (isNaN(d.getTime())) return '-';
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}
