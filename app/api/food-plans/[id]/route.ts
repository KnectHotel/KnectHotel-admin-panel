import { NextRequest, NextResponse } from 'next/server';
import { dummyFoodPlans } from '@/data/foodPlans';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  const plan = dummyFoodPlans.find((p) => p._id === id);

  if (!plan) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(plan);
}
