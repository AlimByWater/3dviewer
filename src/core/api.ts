import { PanelParams } from '@/types/panel';
import { Author, Slot } from '@/types/types';

export const fetchSlotByShortCode = async (
  shortCode: string,
): Promise<Slot> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/slots/by-link/${shortCode}`,
  );

  if (!res.ok) {
    let errorMessage = `Failed to fetch slot - ${shortCode}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Не удалось распарсить JSON ответ
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const saveWorkParams = async (workId: string, params: PanelParams) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/works/${workId}/panel`,
    {
      method: 'PUT',
      body: JSON.stringify(params),
    },
  );
  if (!res.ok) {
    throw Error('Failed to save params');
  }
};

export const fetchSlots = async (telegramUserId: number): Promise<Slot[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/slots/by-telegram-id/${telegramUserId}`,
  );
  if (!res.ok) {
    throw Error(`Failed to fetch slots by author ${telegramUserId}`);
  }
  const allSlots = (await res.json()) as Slot[];
  const publicSlots = allSlots.filter((slot) => slot.work.showWorkInList);
  return publicSlots;
};

export const fetchAuthors = async (): Promise<Author[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/`);
  if (!res.ok) {
    throw Error('Failed to fetch authors');
  }
  return res.json();
};
