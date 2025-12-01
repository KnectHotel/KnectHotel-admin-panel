import { NextResponse } from 'next/server';
import { dummyFoodPlans, dummyHotels } from '@/data/foodPlans';

export async function GET(_, { params }: any) {
  const { id } = params;
  const plan = dummyFoodPlans.find((p) => p._id === id);

  if (!plan) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(plan);
}
