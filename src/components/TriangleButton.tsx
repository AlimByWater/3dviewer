import './TriangleButton.css';
import { ActionIcon } from '@mantine/core';

const TriangleButton = ({
  onClick,
  color,
}: {
  onClick: () => void;
  color?: string;
}) => {
  return (
    <ActionIcon
      variant="transparent"
      onClick={onClick}
      style={{
        color,
        pointerEvents: 'auto',
      }}
    >
      <div className="triangle">
        <div className="point top">⁂</div>
        <div className="point bottom-right">⁂</div>
        <div className="point bottom-left">⁂</div>
      </div>
    </ActionIcon>
  );
};

export default TriangleButton;
