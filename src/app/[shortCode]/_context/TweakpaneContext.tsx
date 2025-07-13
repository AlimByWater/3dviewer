import { Pane as Tweakpane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import * as TweakpaneFileImportPlugin from 'tweakpane-plugin-file-import';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { PanelParams } from '@/types/panel';
import * as api from '@/core/api';
import { useViewer } from './ViewerContext';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { Slot } from '@/types/types';
import { configTweakpane, convertSlotToPanelParams } from '@/utils/tweakpane';

type TweakpaneAction =
  | { type: 'init_pane'; pane: Tweakpane }
  | { type: 'pane_destroyed' }
  | { type: 'params_updated'; params: PanelParams }
  | { type: 'set_saving'; saving: boolean };

interface TweakpaneState {
  pane: Tweakpane | null;
  params: PanelParams | null;
  isSaving: boolean; // Cтатус сохранения
}

const initialState: TweakpaneState = {
  pane: null,
  params: null,
  isSaving: false,
};

const TweakpaneContext = createContext<{
  state: TweakpaneState;
  dispatch: React.Dispatch<TweakpaneAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

const tweakpaneReducer = (
  state: TweakpaneState,
  action: TweakpaneAction,
): TweakpaneState => {
  switch (action.type) {
    case 'init_pane':
      return { ...state, pane: action.pane };

    case 'pane_destroyed':
      return { ...state, pane: null, params: null };

    case 'params_updated':
      return { ...state, params: action.params };

    case 'set_saving':
      return { ...state, isSaving: action.saving };

    default:
      return state;
  }
};

export const useTweakpane = () => useContext(TweakpaneContext);

export const TweakpaneProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(tweakpaneReducer, initialState);
  const { state: viewerState } = useViewer();
  const lp = useLaunchParams();
  const paramsRef = useRef<PanelParams | null>(null);
  const prevSlot = useRef<Slot | null>(null);

  // Синхронизация ref с параметрами
  useEffect(() => {
    if (paramsRef.current) {
      Object.assign(paramsRef.current, state.params);
      if (state.pane) {
        state.pane.refresh();
      }
    }
  }, [state.params, state.pane]);

  // Инициализация/разрушение панели
  useEffect(() => {
    if (!viewerState.slot) return;

    const shouldShowPane =
      process.env.NEXT_PUBLIC_BASE_PATH === '/local' ||
      viewerState.slot.work.showPanel === true ||
      lp.initData?.user?.id === viewerState.slot.work.authors[0].telegramUserId;

    if (state.pane) {
      if (
        !shouldShowPane ||
        (prevSlot.current && prevSlot.current.id != viewerState.slot.id)
      ) {
        // Если панель существует, но она не должна отображаться или изменился слот,
        // уничтожаем её
        state.pane?.dispose();
        dispatch({ type: 'pane_destroyed' });
      }
    } else {
      if (shouldShowPane) {
        // Если панели нет, но она должна отображаться,
        // создаём её
        const pane = new Tweakpane({
          title: 'Model parameters',
          expanded: false,
        });
        pane.registerPlugin(EssentialsPlugin);
        pane.registerPlugin(TweakpaneFileImportPlugin);

        const panelParams = convertSlotToPanelParams(viewerState.slot);
        paramsRef.current = configTweakpane({
          pane: pane,
          initialParams: panelParams,
          onParamsUpdate: (key, value) => {
            if (!paramsRef.current) return;

            const newParams = {
              ...paramsRef.current,
              [key]: value,
            };

            dispatch({ type: 'params_updated', params: newParams });
          },
          onSaveClick: async (button) => {
            // Keep the null check for safety
            if (!viewerState.slot || !paramsRef.current) {
              console.error('Cannot save: slot or params are missing.');
              return;
            }
            try {
              dispatch({ type: 'set_saving', saving: true });

              button.disabled = true;
              button.title = '...';

              // Pass only PanelParams (paramsRef.current)
              await api.saveWorkParams(
                viewerState.slot.work.id,
                paramsRef.current,
              );

              button.title = 'Saved!';
              await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (e) {
              console.error('Failed to save work params:', e); // Keep logging
              button.title = `Error!`; // Keep improved error message
              await new Promise((resolve) => setTimeout(resolve, 2000)); // Keep longer timeout
            } finally {
              button.disabled = false;
              button.title = 'Save';
            }
          },
        });

        dispatch({ type: 'init_pane', pane });
        dispatch({ type: 'params_updated', params: panelParams });
      } else {
        // Если панели нет и она не должна отображаться,
        // инициализируем только параметры
        const panelParams = convertSlotToPanelParams(viewerState.slot);
        dispatch({ type: 'params_updated', params: panelParams });
      }
    }

    prevSlot.current = viewerState.slot;
  }, [lp.initData?.user?.id, state.pane, viewerState.slot]);

  // Настройка стилей панели
  useEffect(() => {
    if (!state.pane) return;

    state.pane.element.style.maxHeight = 'calc(100vh * 0.8)';
    state.pane.element.style.overflowY = 'auto';
  }, [state.pane]);

  return (
    <TweakpaneContext.Provider value={{ state, dispatch }}>
      {children}
    </TweakpaneContext.Provider>
  );
};
