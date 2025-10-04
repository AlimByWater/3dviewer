import { Pane as Tweakpane } from 'tweakpane';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { PanelParams } from '@/types/panel';
import * as api from '@/core/api';
import { useViewer } from './ViewerContext';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { Slot } from '@/types/types';
import { configTweakpane, convertSlotToPanelParams } from '@/utils/tweakpane';
import useDebounce from '@/hooks/useDebounce';
import getTweakpanePlugins from '@/utils/getTweakpanePlugins';

type TweakpaneAction =
  | { type: 'init_pane'; pane: Tweakpane }
  | { type: 'pane_destroyed' }
  | { type: 'params_updated'; params: PanelParams | null }
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
      return { ...state, pane: null };

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
  const debouncedRefresh = useDebounce((pane: any) => {
    pane.refresh();
  }, 20);
  const [tweakpanePlugins, setTweakpanePlugins] = useState<any[]>();

  const isLocalBuild = process.env.NEXT_PUBLIC_BASE_PATH === '/local';

  const userIsSlotAuthor =
    isLocalBuild ||
    (viewerState.slot != null &&
      viewerState.slot.work.authors[0].telegramUserId == lp.initData?.user?.id);

  const shouldShowPane =
    viewerState.slot != null &&
    (viewerState.slot.work.showPanel === true || userIsSlotAuthor);

  // Синхронизация ref с параметрами
  useEffect(() => {
    if (paramsRef.current) {
      Object.assign(paramsRef.current, state.params);
      if (state.pane) {
        debouncedRefresh(state.pane);
      }
    }
  }, [state.params, state.pane, debouncedRefresh]);

  useEffect(() => {
    if (prevSlot.current?.id != viewerState.slot?.id) {
      // Разрушение параметров из слота
      console.log(
        'Updating pane params for slot:',
        `[${viewerState.slot?.id}]`,
      );

      dispatch({
        type: 'params_updated',
        params: viewerState.slot && convertSlotToPanelParams(viewerState.slot),
      });
    }
  }, [viewerState.slot]);

  useEffect(() => {
    if (
      state.pane &&
      (prevSlot.current?.id != viewerState.slot?.id || !shouldShowPane)
    ) {
      // Разрушение панели
      console.log('Destroying pane for slot:', `[${prevSlot.current?.id}]`);

      state.pane?.dispose();
      dispatch({ type: 'pane_destroyed' });
    }
  }, [shouldShowPane, state.pane, viewerState.slot?.id]);

  // Set plugins
  useEffect(() => {
    getTweakpanePlugins().then(setTweakpanePlugins);
  }, []);

  useEffect(() => {
    if (tweakpanePlugins && shouldShowPane && !state.pane && state.params) {
      // Создание панели
      console.log('Creating pane for slot:', `[${viewerState.slot?.id}]`);

      const pane = new Tweakpane({
        title: 'Model parameters',
        expanded: false,
      });
      pane.hidden = true;

      for (const plugin of tweakpanePlugins) {
        pane.registerPlugin(plugin);
      }

      paramsRef.current = configTweakpane({
        pane: pane,
        initialParams: state.params,
        onParamsUpdate: (updated) => {
          if (!paramsRef.current) return;

          const newParams = {
            ...paramsRef.current,
            ...updated,
          };

          dispatch({ type: 'params_updated', params: newParams });
        },
        showSaveButton: userIsSlotAuthor,
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
            console.log(
              `[${viewerState.slot.work.id}] panel parameters saving`,
              paramsRef.current,
            );
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
    }
  }, [
    shouldShowPane,
    state.pane,
    state.params,
    tweakpanePlugins,
    userIsSlotAuthor,
    viewerState.slot,
  ]);

  useEffect(() => {
    prevSlot.current = viewerState.slot;
  }, [viewerState.slot]);

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
