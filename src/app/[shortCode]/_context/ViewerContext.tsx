import { useSafeArea } from '@/hooks/useSafeArea';
import { PanelParams } from '@/types/panel';
import { Slot } from '@/types/types';
import Color from 'color';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { Pane as Tweakpane } from 'tweakpane';

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
      const pos = action.slot?.work.object.position;
      const scale = action.slot?.work.object.scale;

      return {
        ...state,
        slot: action.slot,
        panelParams: action.slot && {
          hdri: 0,
          background: Color(action.slot.work.backgroundColor).hex(),
          foreground: Color(action.slot.work.foregroundColor).hex(),
          scale: scale
            ? typeof scale === 'number'
              ? { x: scale, y: scale, z: scale }
              : { x: scale[0], y: scale[1], z: scale[2] }
            : { x: 1, y: 1, z: 1 },
          position: pos
            ? { x: pos[0], y: pos[1], z: pos[2] }
            : { x: 0, y: 0, z: 0 },
        },
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
  const [state, dispatch] = useReducer(viewerReducer, initialState);
  const { top, right } = useSafeArea();
  const paneRef = useRef<Tweakpane | null>(null); // Используем ref для хранения панели
  const paramsRef = useRef(state.panelParams); // Ref для отслеживания параметров

  // Синхронизация ref с параметрами
  useEffect(() => {
    paramsRef.current = state.panelParams;
  }, [state.panelParams]);

  // Эффект для управления жизненным циклом панели
  useEffect(() => {
    // TODO: (state.slot?.work.showPanel === true || tgUserId && tgUserId != state.slot?.author_id) && state.panelParams
    if (state.slot?.work.showPanel !== false && state.panelParams) {
      // Создаем панель при появлении параметров
      if (!paneRef.current) {
        paramsRef.current = state.panelParams;
        const pane = new Tweakpane({
          title: 'Model parameters',
          expanded: true,
        });

        // Позиционирование
        pane.element.style.position = 'relative';
        pane.element.style.top = `calc(${top}px + 16px)`;
        pane.element.style.right = `calc(${right}px + 16px)`;

        // Создаем копию параметров для панели
        const paneParams = { ...state.panelParams };

        // Добавляем биндинги
        const hdri = pane.addBinding(paneParams, 'hdri', {
          min: 0,
          max: 3,
          step: 1,
        });
        const bgColor = pane.addBinding(paneParams, 'background');
        const fgColor = pane.addBinding(paneParams, 'foreground');
        const scale = pane.addBinding(paneParams, 'scale', {
          min: 0,
          max: 10,
        });
        const position = pane.addBinding(paneParams, 'position');

        // Обработчики изменений
        const handleChange =
          (key: keyof PanelParams, ifChanged = true) =>
          (e: any) => {
            updateParam(key, e.value, ifChanged);
          };

        // Обработчики изменений
        hdri.on('change', handleChange('hdri'));
        bgColor.on('change', handleChange('background'));
        fgColor.on('change', handleChange('foreground'));
        scale.on('change', handleChange('scale', false));
        position.on('change', handleChange('position', false));

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
  }, [right, state.panelParams, state.slot?.work.showPanel, top]); // Добавляем параметры в зависимости

  // Эффект для синхронизации панели с состоянием
  useEffect(() => {
    if (paneRef.current && state.panelParams) {
      paneRef.current.refresh();
    }
  }, [state.panelParams]);

  return (
    <ViewerContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewerContext.Provider>
  );
};
