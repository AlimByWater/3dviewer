import Info from './Info';
import LogoButton from './LogoButton';

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

      <div
        id="tweakpane-container"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          minWidth: '300px',
          width: 'calc(100vw * 0.3)',
          maxWidth: '400px',
          padding: '16px 16px',
          pointerEvents: 'auto',
        }}
      ></div>
      <Info
        modalVisible={modalVisible}
        onChangeModalVisible={onChangeModalVisible}
      />
    </div>
  );
};

export default Overlay;
