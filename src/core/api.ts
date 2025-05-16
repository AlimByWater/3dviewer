import { PanelParams } from '@/types/panel'; // Revert import
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

// Revert function signature and body to use PanelParams
export const saveWorkParams = async (workId: string, params: PanelParams) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/works/${workId}/panel`,
    {
      method: 'PUT',
      // Remove Content-Type header if not needed by backend for this endpoint
      headers: {
        'Content-Type': 'application/json', // Keep if backend expects JSON
      },
      body: JSON.stringify(params), // Send only PanelParams
    },
  );
  if (!res.ok) {
    // Revert error handling if needed
    let errorMsg = 'Failed to save params';
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      // Ignore if parsing fails
    }
    throw Error(errorMsg); // Keep improved error message
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
