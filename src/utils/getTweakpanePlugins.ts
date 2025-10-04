const getTweakpanePlugins = () => {
  return Promise.all([
    import('@tweakpane/plugin-essentials'),
    import('tweakpane-plugin-file-import'),
    import('@0b5vr/tweakpane-plugin-rotation'),
  ]);
};

export default getTweakpanePlugins;
