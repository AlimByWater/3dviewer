import { authorsMock } from "@/types/work";
import { NextRequest, NextResponse } from "next/server";

export const GET = (_: NextRequest) => {
  return NextResponse.json(authorsMock);
};
