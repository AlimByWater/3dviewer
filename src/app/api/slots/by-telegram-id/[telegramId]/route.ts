import { slotsMock } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export const GET = (
  _: NextRequest,
  { params }: { params: { telegramId: string } },
) => {
  const telegramUserId = parseInt(params.telegramId);

  const slots = slotsMock.filter(
    (slot) => slot.work.authors[0].telegramUserId == telegramUserId,
  );

  return NextResponse.json(slots);
};
