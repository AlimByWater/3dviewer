import { authorsMock } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export const GET = (_: NextRequest) => {
  return NextResponse.json(authorsMock);
};
