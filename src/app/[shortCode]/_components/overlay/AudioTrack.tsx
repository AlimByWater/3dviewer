import { useViewer } from '../../_context/ViewerContext';

const AudioTrack = () => {
  const { state } = useViewer();

  const link = state.slot?.audio?.link;
  if (!link) return;

  return <audio preload="auto" autoPlay src={link}></audio>;
};

export default AudioTrack;
