import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { init as initSDK, useLaunchParams, postEvent } from '@telegram-apps/sdk-react'
import { get3DObject } from './data'

function Overlay() {
  const lp = useLaunchParams()
  const obj3d = get3DObject(lp.startParam)
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {/*<Logo style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} />*/}
      <img alt={obj3d.name} src={obj3d.logo} style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} />
      <a href={obj3d.channel} style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}>
        {obj3d.name}
        <br />
        by {obj3d.author}
      </a>
      {/*<div style={{ position: 'absolute', top: 40, left: 40 }}>ok —</div>*/}
      <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>{obj3d.createdAt}</div>
    </div>
  )
}

try {
  initSDK()
} catch (e) {
  console.error(e)
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Overlay />
  </>
)
