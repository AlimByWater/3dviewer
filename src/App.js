import { useEffect, useState, useMemo } from 'react'
import { useLaunchParams, postEvent } from '@telegram-apps/sdk-react'
import { get3DObject } from './data'
import Overlay from './components/Overlay'
import View from './components/View'

export default function App() {
  const lp = useLaunchParams()
  const [workId, setWorkId] = useState(lp.startParam)
  const obj = useMemo(() => get3DObject(workId))
  const [isAuthorsPageOpen] = useState(false)

  useEffect(() => {
    if (['android', 'android_x', 'ios'].includes(lp.platform)) {
      try {
        postEvent('web_app_request_fullscreen')
        postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false })
      } catch (e) {
        console.warn(e)
      }
    }
  }, [])

  const onSelectWork = (workId) => {
    setWorkId(workId)
  }

  return (
    <>
      <View obj={obj} isAuthorsPageOpen={isAuthorsPageOpen} />
      <Overlay onSelectWork={onSelectWork} />
    </>
  )
}
