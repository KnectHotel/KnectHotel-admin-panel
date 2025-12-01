import { NextResponse } from 'next/server';
import { dummyFoodPlans } from '@/data/foodPlans';

export async function GET() {
  return NextResponse.json(dummyFoodPlans);
}
