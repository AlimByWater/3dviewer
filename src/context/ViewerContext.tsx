import { Slot } from '@/types/types';
import { createContext, ReactNode, useContext, useReducer } from 'react';

type Action = { type: 'slot_changed'; slot: Slot };

interface State {
  slot: Slot | null;
}

const initialState: State = {
  slot: null,
};

const ViewerContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const viewerReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'slot_changed':
      return { ...state, slot: action.slot };
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
