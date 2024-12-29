import {
  $debug,
  backButton,
  enableClosingConfirmation,
  init as initSDK,
  initData,
  isClosingBehaviorMounted,
  miniApp,
  mountClosingBehavior,
  mainButton,
  swipeBehavior,
  themeParams,
  viewport,
} from "@telegram-apps/sdk-react";

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  if (!isClosingBehaviorMounted()) {
    mountClosingBehavior();
  }
  enableClosingConfirmation();

  // Mount all components used in the project.
  if (swipeBehavior.isSupported()) {
    swipeBehavior.mount();
    swipeBehavior.disableVertical();
  }
  backButton.isSupported() && backButton.mount();
  mainButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();
  if (!viewport.isMounted() && !viewport.isMounting()) {
    if (!viewport.isMounting()) {
      viewport.mount().catch((e) => {
        console.error("Something went wrong mounting the viewport", e);
      });
    }
  }

  // Define components-related CSS variables.
  if (viewport.isMounted() && !viewport.isCssVarsBound()) {
    viewport.bindCssVars();
  }
  if (!miniApp.isCssVarsBound()) {
    miniApp.bindCssVars();
  }
  if (!themeParams.isCssVarsBound()) {
    themeParams.bindCssVars();
  }
}
