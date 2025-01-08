import './TriangleButton.css';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useSafeArea } from '@/hooks/useSafeArea';

const TriangleButton = ({
  onClick,
  color,
}: {
  onClick: () => void;
  color: string;
}) => {
  const lp = useLaunchParams();
  const { top, left } = useSafeArea();

  const buttonStyle = {
    color,
    top: `calc(${top}px + 20px)`,
    left: `calc(${left}px + 20px)`,
  };

  if (['android', 'android_x', 'ios'].includes(lp.platform)) {
    buttonStyle.top = `calc(${top}px + 60px)`;
  }

  return (
    <button className="triangle-button" onClick={onClick} style={buttonStyle}>
      <div className="triangle">
        <div className="point top">⁂</div>
        <div className="point bottom-right">⁂</div>
        <div className="point bottom-left">⁂</div>
      </div>
    </button>
  );
};

export default TriangleButton;
