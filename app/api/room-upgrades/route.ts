import { NextResponse } from 'next/server';
import { dummyRoomUpgrades } from '@/data/roomUpgrades';

export async function GET() {
  return NextResponse.json(dummyRoomUpgrades);
}
