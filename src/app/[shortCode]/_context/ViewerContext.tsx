import { useSafeArea } from '@/hooks/useSafeArea';
import { PanelParams } from '@/types/panel';
import { Slot } from '@/types/types';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import Color from 'color';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { Pane as Tweakpane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { saveWorkParams } from '@/core/api';

// Define asset loading actions
type Action =
  | { type: 'slot_changed'; slot: Slot | null }
  | { type: 'panel_params_changed'; panelParams: PanelParams };

// Use assetLoading in state
interface State {
  slot: Slot | null;
  panelParams: PanelParams | null;
}

// Initialize assetLoading
const initialState: State = {
  slot: null,
  panelParams: null,
};

// Update context type to include new State shape
const ViewerContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

// Add reducer cases for asset loading
const viewerReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'slot_changed':
      const slot = action.slot;

      let panelParams: PanelParams | null;
      if (slot) {
        const work = slot.work;
        const object = work.object;
        panelParams = {
          showPanel: work.showPanel === true,
          showWorkInList: work.showWorkInList,
          background: Color(work.backgroundColor).hex(),
          foreground: Color(work.foregroundColor).hex(),
          scale: { x: object.scale[0], y: object.scale[1], z: object.scale[2] },
          position: {
            x: object.position[0],
            y: object.position[1],
            z: object.position[2],
          },
          distance: object.distance,
          azimuthAngle: object.azimuthAngle,
          polarAngle: object.polarAngle,
          enableHdri: object.enableHdri,
          hdri: object.hdri,
          useHdriAsBackground: object.useHdriAsBackground,
        };
      } else {
        panelParams = null;
      }

      return {
        ...state,
        slot: slot,
        panelParams: panelParams,
      };
    case 'panel_params_changed':
      return {
        ...state,
        panelParams: action.panelParams,
      };
    default:
      // Ensure exhaustive check if needed, or just return state
      // const _exhaustiveCheck: never = action;
      return state;
  }
};

export const useViewer = () => useContext(ViewerContext);

export const ViewerProvider = ({ children }: { children: ReactNode }) => {
  const lp = useLaunchParams();
  const [state, dispatch] = useReducer(viewerReducer, initialState);
  const { top, right } = useSafeArea();
  const paneRef = useRef<Tweakpane | null>(null); // Используем ref для хранения панели
  const paramsRef = useRef(state.panelParams); // Ref для отслеживания параметров
  const panelParamsRef = useRef(state.panelParams);

  const positionPane = useCallback(
    (pane: Tweakpane) => {
      pane.element.style.position = 'relative';
      pane.element.style.top = `calc(${top}px + 16px)`;
      pane.element.style.right = `calc(${right}px + 16px)`;
    },
    [top, right],
  );

  useEffect(() => {
    if (paneRef.current) {
      paneRef.current.dispose();
      paneRef.current = null;
    }
  }, [state.slot?.id]);

  // Синхронизация ref с параметрами
  useEffect(() => {
    panelParamsRef.current = state.panelParams;
    if (state.panelParams && paramsRef.current) {
      Object.assign(paramsRef.current, state.panelParams);
      if (paneRef.current) {
        paneRef.current.refresh();
      }
    }
  }, [state.panelParams]);

  // Эффект для управления жизненным циклом панели
  useEffect(() => {
    if (
      state.panelParams &&
      state.slot &&
      (process.env.NEXT_PUBLIC_BASE_PATH === '/local' ||
        state.slot.work.showPanel === true ||
        lp.initData?.user?.id === state.slot.work.authors[0].telegramUserId)
    ) {
      // Создаем панель при появлении параметров
      if (!paneRef.current) {
        paramsRef.current = { ...state.panelParams };
        const pane = new Tweakpane({
          title: 'Model parameters',
          expanded: true,
        });

        pane.registerPlugin(EssentialsPlugin); // Register the EssentialsPlugin

        positionPane(pane);

        const paneParams = paramsRef.current;

        // Добавляем биндинги
        const showPanel = pane.addBinding(paneParams, 'showPanel', {
          label: 'public panel',
        });
        const showWorkInList = pane.addBinding(paneParams, 'showWorkInList', {
          label: 'public work',
        });
        const bgColor = pane.addBinding(paneParams, 'background', {
          label: 'Background',
        });
        const fgColor = pane.addBinding(paneParams, 'foreground', {
          label: 'Text',
        });
        const scale = pane.addBinding(paneParams, 'scale', {
          label: 'Scale',
          min: 0,
          max: 10,
        });
        const position = pane.addBinding(paneParams, 'position', {
          label: 'Position',
        });

        const cameraFolder = pane.addFolder({
          expanded: false,
          title: 'Start Camera Position',
        });
        const azimuthAngle = cameraFolder.addBinding(
          paneParams,
          'azimuthAngle',
          {
            label: 'Y',
            min: -2 * Math.PI,
            max: 2 * Math.PI,
          },
        );
        const polarAngle = cameraFolder.addBinding(paneParams, 'polarAngle', {
          label: 'X',
          min: 0,
          max: 2 * Math.PI,
        });
        const distance = cameraFolder.addBinding(paneParams, 'distance', {
          label: 'Z',
          min: 0.1,
          max: 100,
        });
        const hdriFolder = pane.addFolder({
          expanded: false,
          title: 'HDRI-background',
        });
        const enableHdri = hdriFolder.addBinding(paneParams, 'enableHdri', {
          label: 'Enable',
        });
        const hdri = hdriFolder.addBinding(paneParams, 'hdri', {
          label: 'HDRI',
          options: {
            city: 'env-1',
            orbit: 'env-2',
            polygon: 'env-3',
            studio: 'env-4',
          },
        });
        const useHdriAsBackground = hdriFolder.addBinding(
          paneParams,
          'useHdriAsBackground',
          {
            label: 'Use HDRI as Background',
            view: 'radiogrid',
            groupName: 'backgroundToggle', // Уникальное имя для группы радиокнопок
            size: [3, 1], // 3 колонки, 1 ряд
            cells: (x: number, y: number) => {
              if (x === 0) {
                // HDRI as background & environment
                return { title: 'true', value: 'true' };
              } else if (x === 1) {
                // No HDRI for background
                return { title: 'false', value: 'false' };
              } else {
                // HDRI for background only
                return { title: 'only', value: 'only' };
              }
            },
          },
        );

        // Общая функция для обновления параметров
        const updateParam = (key: keyof PanelParams, value: any) => {
          const currParams = panelParamsRef.current!;
          if (!currParams) return;

          dispatch({
            type: 'panel_params_changed',
            panelParams: { ...currParams, [key]: value },
          });
        };

        const createHandler = (key: keyof PanelParams) => (e: any) => {
          updateParam(key, e.value);
        };

        // Обработчики изменений
        showPanel.on('change', createHandler('showPanel'));
        showWorkInList.on('change', createHandler('showWorkInList'));
        bgColor.on('change', createHandler('background'));
        fgColor.on('change', createHandler('foreground'));
        scale.on('change', createHandler('scale'));
        position.on('change', createHandler('position'));

        distance.on('change', createHandler('distance'));
        azimuthAngle.on('change', createHandler('azimuthAngle'));
        polarAngle.on('change', createHandler('polarAngle'));

        enableHdri.on('change', createHandler('enableHdri'));
        hdri.on('change', createHandler('hdri'));
        useHdriAsBackground.on('change', createHandler('useHdriAsBackground'));

        const saveButton = pane.addButton({ title: 'Save' });
        saveButton.on('click', async () => {
          // Keep the null check for safety
          if (!state.slot || !paramsRef.current) {
            console.error('Cannot save: slot or params are missing.');
            return;
          }
          try {
            saveButton.disabled = true;
            saveButton.title = '...';

            // Pass only PanelParams (paramsRef.current)
            await saveWorkParams(state.slot.work.id, paramsRef.current);

            saveButton.title = 'Success';
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (e) {
            console.error('Failed to save work params:', e); // Keep logging
            saveButton.title = `${
              e instanceof Error ? e.message : 'Unknown error'
            }`; // Keep improved error message
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Keep longer timeout
          } finally {
            saveButton.disabled = false;
            saveButton.title = 'Save';
          }
        });

        paneRef.current = pane;
      }
    } else {
      // Удаляем панель при исчезновении параметров
      if (paneRef.current) {
        paneRef.current.dispose();
        paneRef.current = null;
      }
    }

    return () => {
      // Дополнительная очистка при полном исчезновении параметров
      if (!paramsRef.current && paneRef.current) {
        paneRef.current.dispose();
        paneRef.current = null;
      }
    };
  }, [state.panelParams, positionPane, lp.initData?.user?.id, state.slot]);

  // Эффект для синхронизации панели с состоянием
  useEffect(() => {
    if (paneRef.current && state.panelParams) {
      paneRef.current.refresh();
    }
  }, [state.panelParams]);

  useEffect(() => {
    if (paneRef.current) {
      positionPane(paneRef.current);
    }
  }, [positionPane]);

  return (
    <ViewerContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewerContext.Provider>
  );
};
