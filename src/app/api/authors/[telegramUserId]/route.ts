import { authorsMock } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export const GET = (_: NextRequest, params: { telegramUserId: string }) => {
  const telegramUserId = parseInt(params.telegramUserId);
  const author = authorsMock.find(
    (author) => author.telegramUserId == telegramUserId,
  );
  if (!author) {
    throw Error(`Failed to fetch author ${params.telegramUserId}`);
  }
  return NextResponse.json(author);
};
