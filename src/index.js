import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { init as initSDK, bindThemeParamsCssVars, miniApp } from '@telegram-apps/sdk-react'
import Overlay from './components/Overlay'

try {
  initSDK()
  if (!miniApp.isCssVarsBound) {
    miniApp.bindCssVars()
    bindThemeParamsCssVars()
  }
} catch (e) {
  console.error(e)
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)
