import { NextResponse } from 'next/server';
import { addToWaitlistServer } from '@/lib/server/firestore';

export async function POST(req: Request) {
  const data = await req.json();
  const result = await addToWaitlistServer(data);
  return NextResponse.json(result);
}