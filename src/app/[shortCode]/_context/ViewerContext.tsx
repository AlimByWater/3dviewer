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
import { saveWorkParams } from '@/core/api';

type Action =
  | { type: 'slot_changed'; slot: Slot | null }
  | { type: 'panel_params_changed'; panelParams: PanelParams };

interface State {
  slot: Slot | null;
  panelParams: PanelParams | null;
}

const initialState: State = {
  slot: null,
  panelParams: null,
};

const ViewerContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

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
  }
};

export const useViewer = () => useContext(ViewerContext);

export const ViewerProvider = ({ children }: { children: ReactNode }) => {
  const lp = useLaunchParams();
  const [state, dispatch] = useReducer(viewerReducer, initialState);
  const { top, right } = useSafeArea();
  const paneRef = useRef<Tweakpane | null>(null); // Используем ref для хранения панели
  const paramsRef = useRef(state.panelParams); // Ref для отслеживания параметров

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
    paramsRef.current = state.panelParams;
  }, [state.panelParams]);

  // Эффект для управления жизненным циклом панели
  useEffect(() => {
    if (
      state.panelParams &&
      state.slot &&
      (state.slot.work.showPanel === true ||
        lp.initData?.user?.id === state.slot.work.authors[0].telegramUserId)
    ) {
      // Создаем панель при появлении параметров
      if (!paneRef.current) {
        paramsRef.current = state.panelParams;
        const pane = new Tweakpane({
          title: 'Model parameters',
          expanded: true,
        });

        positionPane(pane);

        // Создаем копию параметров для панели
        const paneParams = { ...state.panelParams };

        // Добавляем биндинги
        const showPanel = pane.addBinding(paneParams, 'showPanel', {
          label: 'public panel',
        });
        const showWorkInList = pane.addBinding(paneParams, 'showWorkInList', {
          label: 'public work',
        });
        const bgColor = pane.addBinding(paneParams, 'background');
        const fgColor = pane.addBinding(paneParams, 'foreground');
        const scale = pane.addBinding(paneParams, 'scale', {
          min: 0,
          max: 10,
        });
        const position = pane.addBinding(paneParams, 'position');

        const cameraFolder = pane.addFolder({
          expanded: false,
          title: 'Camera',
        });
        const distance = cameraFolder.addBinding(paneParams, 'distance', {
          min: 1,
          max: 100,
        });
        const azimuthAngle = cameraFolder.addBinding(
          paneParams,
          'azimuthAngle',
          {
            label: 'azimuth angle',
            min: -2 * Math.PI,
            max: 2 * Math.PI,
          },
        );
        const polarAngle = cameraFolder.addBinding(paneParams, 'polarAngle', {
          label: 'polar angle',
          min: -2 * Math.PI,
          max: 2 * Math.PI,
        });

        const hdriFolder = pane.addFolder({
          expanded: false,
          title: 'HDRI',
        });
        const enableHdri = hdriFolder.addBinding(paneParams, 'enableHdri', {
          label: 'enable',
        });
        const hdri = hdriFolder.addBinding(paneParams, 'hdri', {
          label: 'file',
          min: 0,
          max: 3,
          step: 1,
        });
        const useHdriAsBackground = hdriFolder.addBinding(
          paneParams,
          'useHdriAsBackground',
          {
            label: 'use as background',
            options: {
              only: 'only',
              true: 'true',
              false: 'false',
            },
          },
        );

        // Обработчики изменений
        const handleChange =
          (key: keyof PanelParams, ifChanged = true) =>
          (e: any) => {
            updateParam(key, e.value, ifChanged);
          };

        // Обработчики изменений
        showPanel.on('change', handleChange('showPanel'));
        showWorkInList.on('change', handleChange('showWorkInList'));
        bgColor.on('change', handleChange('background'));
        fgColor.on('change', handleChange('foreground'));
        scale.on('change', handleChange('scale', false));
        position.on('change', handleChange('position', false));

        distance.on('change', handleChange('distance'));
        azimuthAngle.on('change', handleChange('azimuthAngle'));
        polarAngle.on('change', handleChange('polarAngle'));

        enableHdri.on('change', handleChange('enableHdri'));
        hdri.on('change', handleChange('hdri'));
        useHdriAsBackground.on('change', handleChange('useHdriAsBackground'));

        const saveButton = pane.addButton({ title: 'Save' });
        saveButton.on('click', async () => {
          try {
            saveButton.disabled = true;
            saveButton.title = '...';
            await saveWorkParams(state.slot!.work.id, paramsRef.current!);
            saveButton.title = 'Success';
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (e) {
            saveButton.title = 'Failed';
            await new Promise((resolve) => setTimeout(resolve, 1000));
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

    // Общая функция для обновления параметров
    const updateParam = (
      key: keyof PanelParams,
      value: any,
      ifChanged: boolean,
    ) => {
      const currParams = paramsRef.current!;
      if (ifChanged && currParams[key] === value) return;

      dispatch({
        type: 'panel_params_changed',
        panelParams: { ...currParams, [key]: value },
      });
    };

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
