// src/app/page.test.tsx
import React from 'react';
import { render } from '@testing-library/react'; // Or your preferred testing library
import SlotPage from './page'; // The component to test

// Mock dependencies
jest.mock('@telegram-apps/sdk-react', () => ({
  useLaunchParams: jest.fn(),
}));

// Mock next/navigation for useSearchParams
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'), // Preserve other exports
  useSearchParams: jest.fn(),
}));

// Mock the child component to check its props
jest.mock('./[shortCode]/page', () => ({
  __esModule: true, // This is important for ES6 modules
  default: jest.fn(() => <div>Mocked SlotDetailsPage</div>), // Mock component
}));
jest.mock('./[shortCode]/_context/ViewerContext', () => ({
  ViewerProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));


// Import mocked hooks/components for type safety if needed
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useSearchParams } from 'next/navigation'; // For typing if needed
import SlotDetailsPage from './[shortCode]/page';

describe('SlotPage', () => {
  let mockSearchGet: jest.Mock;

  beforeEach(() => {
    // Clear mock call history before each test
    (useLaunchParams as jest.Mock).mockClear();
    (SlotDetailsPage as jest.Mock).mockClear();
    
    // Reset and re-configure useSearchParams mock for each test
    mockSearchGet = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue({ get: mockSearchGet });
    (useSearchParams as jest.Mock).mockClear(); // Clear calls to useSearchParams itself
    mockSearchGet.mockClear(); // Clear calls to the 'get' method
  });

  it('should use startParam if provided, ignoring searchParams', () => {
    (useLaunchParams as jest.Mock).mockReturnValue({ startParam: 'fromStartParam' });
    mockSearchGet.mockReturnValue('fromQueryShouldBeIgnored');
    render(<SlotPage />);
    expect(SlotDetailsPage).toHaveBeenCalledWith(
      expect.objectContaining({ params: { shortCode: 'fromStartParam' } }),
      expect.anything()
    );
    expect(mockSearchGet).not.toHaveBeenCalled(); // searchParams.get should not be called
  });

  it('should use searchParams.get("shortCode") if startParam is undefined', () => {
    (useLaunchParams as jest.Mock).mockReturnValue({ startParam: undefined });
    mockSearchGet.mockReturnValue('fromQuery');
    render(<SlotPage />);
    expect(SlotDetailsPage).toHaveBeenCalledWith(
      expect.objectContaining({ params: { shortCode: 'fromQuery' } }),
      expect.anything()
    );
    expect(mockSearchGet).toHaveBeenCalledWith('shortCode');
  });

  it('should use searchParams.get("shortCode") if startParam is an empty string', () => {
    (useLaunchParams as jest.Mock).mockReturnValue({ startParam: '' });
    mockSearchGet.mockReturnValue('fromQueryIfStartEmpty');
    render(<SlotPage />);
    expect(SlotDetailsPage).toHaveBeenCalledWith(
      expect.objectContaining({ params: { shortCode: 'fromQueryIfStartEmpty' } }),
      expect.anything()
    );
    expect(mockSearchGet).toHaveBeenCalledWith('shortCode');
  });

  it('should use "404" if startParam is undefined and searchParams.get("shortCode") is null', () => {
    (useLaunchParams as jest.Mock).mockReturnValue({ startParam: undefined });
    mockSearchGet.mockReturnValue(null);
    render(<SlotPage />);
    expect(SlotDetailsPage).toHaveBeenCalledWith(
      expect.objectContaining({ params: { shortCode: '404' } }),
      expect.anything()
    );
    expect(mockSearchGet).toHaveBeenCalledWith('shortCode');
  });

  it('should use "404" if startParam is an empty string and searchParams.get("shortCode") is an empty string', () => {
    (useLaunchParams as jest.Mock).mockReturnValue({ startParam: '' });
    mockSearchGet.mockReturnValue('');
    render(<SlotPage />);
    expect(SlotDetailsPage).toHaveBeenCalledWith(
      expect.objectContaining({ params: { shortCode: '404' } }),
      expect.anything()
    );
    expect(mockSearchGet).toHaveBeenCalledWith('shortCode');
  });
  
  it('should prioritize startParam even if searchParams.get("shortCode") is also provided', () => {
    (useLaunchParams as jest.Mock).mockReturnValue({ startParam: 'fromStartParamAgain' });
    mockSearchGet.mockReturnValue('fromQueryShouldBeIgnored');
    render(<SlotPage />);
    expect(SlotDetailsPage).toHaveBeenCalledWith(
      expect.objectContaining({ params: { shortCode: 'fromStartParamAgain' } }),
      expect.anything()
    );
    expect(mockSearchGet).not.toHaveBeenCalled();
  });
});
