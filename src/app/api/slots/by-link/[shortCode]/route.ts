import { slotsMock } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export const GET = (
  _: NextRequest,
  { params }: { params: { shortCode: string } },
) => {
  const { shortCode } = params;

  const slots = slotsMock.filter((slot) => slot.link.short_code == shortCode);

  return NextResponse.json(slots);
};
