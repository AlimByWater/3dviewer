// const useTweakpane = () => {
//   const pane = new Tweakpane({
//     title: 'Model parameters',
//     expanded: true,
//   });

//   positionPane(pane);

//   // Создаем копию параметров для панели
//   const paneParams = { ...state.panelParams };

//   // Добавляем биндинги
//   const bgColor = pane.addBinding(paneParams, 'background');
//   const fgColor = pane.addBinding(paneParams, 'foreground');
//   const scale = pane.addBinding(paneParams, 'scale', {
//     min: 0,
//     max: 10,
//   });
//   const position = pane.addBinding(paneParams, 'position');
//   const saveButton = pane.addButton({ title: 'Save' });
//   saveButton.on('click', async () => {
//     try {
//       saveButton.disabled = true;
//       saveButton.title = '...';
//       await saveWorkParams(state.slot!.work.id, paramsRef.current!);
//       saveButton.title = 'success';
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } catch (e) {
//       saveButton.title = 'failed';
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } finally {
//       saveButton.disabled = false;
//       saveButton.title = 'Save';
//     }
//   });

//   const cameraFolder = pane.addFolder({
//     expanded: false,
//     title: 'Camera',
//   });
//   const distance = cameraFolder.addBinding(paneParams, 'distance', {
//     min: 1,
//     max: 100,
//   });
//   const azimuthAngle = cameraFolder.addBinding(paneParams, 'azimuthAngle', {
//     label: 'azimuth angle',
//     min: 0,
//     max: 2 * Math.PI,
//   });
//   const polarAngle = cameraFolder.addBinding(paneParams, 'polarAngle', {
//     label: 'polar angle',
//     min: 0,
//     max: 2 * Math.PI,
//   });

//   const hdriFolder = pane.addFolder({
//     expanded: false,
//     title: 'HDRI',
//   });
//   const enableHdri = hdriFolder.addBinding(paneParams, 'enableHdri', {
//     label: 'enable',
//   });
//   const hdri = hdriFolder.addBinding(paneParams, 'hdri', {
//     label: 'file',
//     min: 0,
//     max: 3,
//     step: 1,
//   });
//   const useHdriAsBackground = hdriFolder.addBinding(
//     paneParams,
//     'useHdriAsBackground',
//     {
//       label: 'use as background',
//       options: {
//         only: 'only',
//         true: 'true',
//         false: 'false',
//       },
//     },
//   );

//   // Обработчики изменений
//   const handleChange =
//     (key: keyof PanelParams, ifChanged = true) =>
//     (e: any) => {
//       updateParam(key, e.value, ifChanged);
//     };

//   // Обработчики изменений
//   bgColor.on('change', handleChange('background'));
//   fgColor.on('change', handleChange('foreground'));
//   scale.on('change', handleChange('scale', false));
//   position.on('change', handleChange('position', false));

//   distance.on('change', handleChange('distance'));
//   azimuthAngle.on('change', handleChange('azimuthAngle'));
//   polarAngle.on('change', handleChange('polarAngle'));

//   enableHdri.on('change', handleChange('enableHdri'));
//   hdri.on('change', handleChange('hdri'));
//   useHdriAsBackground.on('change', handleChange('useHdriAsBackground'));
// };
