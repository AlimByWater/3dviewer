import { DotButtonPanelParams, PanelParams } from '@/types/panel';
import sanitizeSVG from '@mattkrick/sanitize-svg';
import { ButtonApi, Pane } from 'tweakpane';
import { createSvgPreview, readSvgFileAsText, revokeSvgPreview } from './svg';
import { Slot } from '@/types/types';
import Color from 'color';

// Функция преобразования слота в параметры панели
export const convertSlotToPanelParams = (slot: Slot): PanelParams => {
  const work = slot.work;
  const object = work.object;

  return {
    showPanel: work.showPanel === true,
    showWorkInList: work.showWorkInList,
    background: Color(work.backgroundColor).hex(),
    foreground: Color(work.foregroundColor).hex(),
    scale: {
      x: object.scale[0],
      y: object.scale[1],
      z: object.scale[2],
    },
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
    extra: {
      dotButtons:
        object.extra?.dotButtons?.map((btn) => ({
          id: btn.id,
          position: btn.position ?? { x: 0, y: 0, z: 0 },
          svgIcon: btn.svgIcon ?? '',
          linkTo: btn.linkTo ?? '',
          scale: btn.scale ?? 1,
        })) || [],
    },
  };
};

// Конфигурация панели
export const configTweakpane = ({
  pane,
  initialParams,
  onParamsUpdate,
  onSaveClick,
}: {
  pane: Pane;
  initialParams: PanelParams;
  onParamsUpdate: (key: keyof PanelParams, value: any) => void;
  onSaveClick: (button: ButtonApi) => void;
}): PanelParams => {
  const params = initialParams;

  // Очистка предыдущих биндингов
  pane.children.forEach((child) => child.dispose());

  // Создание биндингов
  const showPanel = pane.addBinding(params, 'showPanel', {
    label: 'public panel',
  });
  const showWorkInList = pane.addBinding(params, 'showWorkInList', {
    label: 'public work',
  });
  const bgColor = pane.addBinding(params, 'background', {
    label: 'Background',
  });
  const fgColor = pane.addBinding(params, 'foreground', { label: 'Text' });
  const scale = pane.addBinding(params, 'scale', {
    label: 'Scale',
    min: 0,
    max: 10,
  });
  const position = pane.addBinding(params, 'position', {
    label: 'Position',
  });

  const cameraFolder = pane.addFolder({
    expanded: false,
    title: 'Start Camera Position',
  });
  const distance = cameraFolder.addBinding(params, 'distance', {
    label: 'Z',
    min: 0.1,
    max: 100,
  });
  const azimuthAngle = cameraFolder.addBinding(params, 'azimuthAngle', {
    label: 'Y',
    min: -2 * Math.PI,
    max: 2 * Math.PI,
  });
  const polarAngle = cameraFolder.addBinding(params, 'polarAngle', {
    label: 'X',
    min: 0,
    max: 2 * Math.PI,
  });

  const hdriFolder = pane.addFolder({
    expanded: false,
    title: 'HDRI-background',
  });
  const enableHdri = hdriFolder.addBinding(params, 'enableHdri', {
    label: 'Enable',
  });
  const hdri = hdriFolder.addBinding(params, 'hdri', {
    label: 'HDRI',
    options: {
      city: 'env-1',
      orbit: 'env-2',
      polygon: 'env-3',
      studio: 'env-4',
    },
  });
  const useHdriAsBackground = hdriFolder.addBinding(
    params,
    'useHdriAsBackground',
    {
      label: 'Use HDRI as Background',
      view: 'radiogrid',
      groupName: 'backgroundToggle',
      size: [3, 1],
      cells: (x: number) => {
        if (x === 0) return { title: 'true', value: 'true' };
        if (x === 1) return { title: 'false', value: 'false' };
        return { title: 'only', value: 'only' };
      },
    },
  );

  // Обработчики изменений
  const updateParam = (key: keyof PanelParams, value: any) => {
    onParamsUpdate(key, value);
  };

  showPanel.on('change', (e) => updateParam('showPanel', e.value));
  showWorkInList.on('change', (e) => updateParam('showWorkInList', e.value));
  bgColor.on('change', (e) => updateParam('background', e.value));
  fgColor.on('change', (e) => updateParam('foreground', e.value));
  scale.on('change', (e) => updateParam('scale', e.value));
  position.on('change', (e) => updateParam('position', e.value));
  distance.on('change', (e) => updateParam('distance', e.value));
  azimuthAngle.on('change', (e) => updateParam('azimuthAngle', e.value));
  polarAngle.on('change', (e) => updateParam('polarAngle', e.value));
  enableHdri.on('change', (e) => updateParam('enableHdri', e.value));
  hdri.on('change', (e) => updateParam('hdri', e.value));
  useHdriAsBackground.on('change', (e) =>
    updateParam('useHdriAsBackground', e.value),
  );

  // Dot buttons implementation
  const dotButtonsFolder = pane.addFolder({ title: 'Dot buttons' });

  let addingButton: ButtonApi | undefined;
  const recreateAddButton = (callback: () => void) => {
    addingButton?.dispose();
    addingButton = dotButtonsFolder
      .addButton({ title: 'Add' })
      .on('click', () => callback());
  };

  const addDotButtonParams = (buttonParams?: DotButtonPanelParams) => {
    const newButton: DotButtonPanelParams = buttonParams || {
      id:
        params.extra.dotButtons.length > 0
          ? Math.max(...params.extra.dotButtons.map((b) => b.id)) + 1
          : 1,
      svgIcon: '',
      linkTo: '',
      position: { x: -1, y: 3, z: -2 },
      scale: 1,
    };

    if (!buttonParams) {
      params.extra.dotButtons.push(newButton);
      updateParam('extra', { ...params.extra });
    }

    const buttonFolder = dotButtonsFolder.addFolder({
      title: `Button ${newButton.id}`,
      expanded: true,
    });

    // File input binding
    const fileBinding = buttonFolder.addBinding(
      { svgIcon: '' as any },
      'svgIcon',
      {
        label: 'SVG Icon',
        view: 'file-input',
        filetypes: ['.svg'],
      },
    );

    // Создаем состояние для preview
    let svgPreviewUrl = newButton.svgIcon
      ? createSvgPreview(newButton.svgIcon)
      : '';

    const previewImg = document.createElement('img');
    previewImg.style.width = '24px';
    previewImg.style.height = '24px';
    previewImg.style.margin = '8px';
    previewImg.style.display = svgPreviewUrl ? 'block' : 'none';
    previewImg.src = svgPreviewUrl;

    // Добавляем контейнер preview в UI
    fileBinding.element.insertBefore(
      previewImg,
      fileBinding.element.childNodes[1],
    );

    // console.error('Error processing SVG:');
    fileBinding.on('change', async (e) => {
      if (e.value instanceof File) {
        try {
          const sanitized = (await sanitizeSVG(e.value)) as File;
          const svgText = await readSvgFileAsText(sanitized);

          // Обновляем preview
          if (svgPreviewUrl) revokeSvgPreview(svgPreviewUrl);
          svgPreviewUrl = createSvgPreview(svgText);
          previewImg.src = svgPreviewUrl;
          previewImg.style.display = 'block';

          updateDotButton(newButton.id, { svgIcon: svgText });
        } catch (error) {
          console.error('Error processing SVG:', error);
        }
      } else {
        // Очистка preview
        if (svgPreviewUrl) {
          revokeSvgPreview(svgPreviewUrl);
          svgPreviewUrl = '';
        }
        previewImg.style.display = 'none';
        updateDotButton(newButton.id, { svgIcon: '' });
      }
    });

    buttonFolder
      .addBinding(newButton, 'linkTo', { label: 'Link' })
      .on('change', (e) => updateDotButton(newButton.id, { linkTo: e.value }));

    buttonFolder
      .addBinding(newButton, 'position', { label: 'Position' })
      .on('change', (e) =>
        updateDotButton(newButton.id, { position: e.value }),
      );

    buttonFolder
      .addBinding(newButton, 'scale', { label: 'Scale', min: 0.1, max: 5 })
      .on('change', (e) => updateDotButton(newButton.id, { scale: e.value }));

    buttonFolder.addButton({ title: 'Remove' }).on('click', () => {
      // Очищаем ресурсы preview
      if (svgPreviewUrl) revokeSvgPreview(svgPreviewUrl);

      params.extra.dotButtons = params.extra.dotButtons.filter(
        (b) => b.id !== newButton.id,
      );
      updateParam('extra', { ...params.extra });
      buttonFolder.dispose();
    });
  };

  const updateDotButton = (
    id: number,
    updates: Partial<DotButtonPanelParams>,
  ) => {
    const newButtons = params.extra.dotButtons.map((btn) =>
      btn.id === id ? { ...btn, ...updates } : btn,
    );
    updateParam('extra', { ...params.extra, dotButtons: newButtons });
  };

  recreateAddButton(() => addDotButtonParams());
  params.extra.dotButtons.forEach((button) => addDotButtonParams(button));

  // Save button implementation
  const saveButton = pane.addButton({ title: 'Save' });
  saveButton.on('click', () => {
    onSaveClick(saveButton);
  });

  return params;
};
