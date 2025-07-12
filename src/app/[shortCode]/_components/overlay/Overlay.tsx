import Info from './Info';
import LogoButton from './LogoButton';
import TweakpaneWrapper from './TweakpaneWrapper';

const Overlay = ({
  modalVisible,
  onChangeModalVisible,
}: {
  modalVisible: boolean;
  onChangeModalVisible: (visible: boolean) => void;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <LogoButton />
      <TweakpaneWrapper />
      <Info
        modalVisible={modalVisible}
        onChangeModalVisible={onChangeModalVisible}
      />
    </div>
  );
};

export default Overlay;
