import { objects as worksMock } from "@/types/work";
import { NextRequest, NextResponse } from "next/server";

export const GET = (request: NextRequest) => {
  const telegramUserIdParam =
    request.nextUrl.searchParams.get("telegramUserId");
  if (telegramUserIdParam == null) {
    throw Error("telegramUserId must be passed via query params");
  }
  const telegramUserId = parseInt(telegramUserIdParam);

  const works = worksMock.filter((work) =>
    work.authors.find((author) => author.telegramUserId == telegramUserId)
  );

  return NextResponse.json(works);
};
