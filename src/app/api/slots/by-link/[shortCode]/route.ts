import { Slot, slotsMock } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export const GET = (
  _: NextRequest,
  { params }: { params: { shortCode: string } },
) => {
  const { shortCode } = params;

  const slots = slotsMock.filter((slot) => slot.link.short_code == shortCode);

  if (slots.length === 0) {
    return new NextResponse(`Slot not found`, { status: 404 });
  }

  return NextResponse.json<Slot>(slots[0]);
};
