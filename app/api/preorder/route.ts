import { NextRequest, NextResponse } from 'next/server';

const GRIST_API_KEY = process.env.NEXT_PUBLIC_GRIST_API_KEY!;
const GRIST_DOC_ID = process.env.NEXT_PUBLIC_GRIST_DOC_ID!;
const GRIST_BASE_URL = process.env.NEXT_PUBLIC_GRIST_BASE_URL!;

const TABLE = 'Preorders';

const gristHeaders = {
  'Authorization': `Bearer ${GRIST_API_KEY}`,
  'Content-Type': 'application/json',
};

export async function GET() {
 
  // ดึงข้อมูลทั้งหมดจาก Grist
  const res = await fetch(`${GRIST_BASE_URL}/${GRIST_DOC_ID}/tables/${TABLE}/records`, {
    headers: gristHeaders,
  });
   console.log(res)
  if(!res.ok){
    return NextResponse.json({ error: 'Failed to fetch data from Grist' }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  // เพิ่มข้อมูลใหม่
  const body = await req.json();
  const res = await fetch(`${GRIST_BASE_URL}/${GRIST_DOC_ID}/tables/${TABLE}/records`, {
    method: 'POST',
    headers: gristHeaders,
    body: JSON.stringify({ records: [{ fields: body }] }),
  });
 
  if(!res.ok){
    return NextResponse.json({ error: 'Failed to fetch data from Grist' }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  // แก้ไขข้อมูล (ต้องส่ง id และ fields)
  const body = await req.json();
  const res = await fetch(`${GRIST_BASE_URL}/${GRIST_DOC_ID}/tables/${TABLE}/records`, {
    method: 'PATCH',
    headers: gristHeaders,
    body: JSON.stringify({ records: [body] }),
  });
  if(!res.ok){
    return NextResponse.json({ error: 'Failed to fetch data from Grist' }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  // ลบข้อมูล (ต้องส่ง id)
  const body = await req.json();
  const res = await fetch(`${GRIST_BASE_URL}/${GRIST_DOC_ID}/tables/${TABLE}/records`, {
    method: 'DELETE',
    headers: gristHeaders,
    body: JSON.stringify({ records: [body.id] }),
  });
  if(!res.ok){
    return NextResponse.json({ error: 'Failed to fetch data from Grist' }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json(data);
} 