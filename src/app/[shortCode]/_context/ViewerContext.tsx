import { createContext, ReactNode, useContext, useReducer } from 'react';
import { Slot } from '@/types/types';

type ViewerAction = { type: 'slot_changed'; slot: Slot | null };

interface ViewerState {
  slot: Slot | null;
}

const initialState: ViewerState = {
  slot: null,
};

const ViewerContext = createContext<{
  state: ViewerState;
  dispatch: React.Dispatch<ViewerAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

const viewerReducer = (
  state: ViewerState,
  action: ViewerAction,
): ViewerState => {
  switch (action.type) {
    case 'slot_changed':
      return {
        slot: action.slot,
      };

    default:
      return state;
  }
};

export const useViewer = () => useContext(ViewerContext);

export const ViewerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(viewerReducer, initialState);

  return (
    <ViewerContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewerContext.Provider>
  );
};
