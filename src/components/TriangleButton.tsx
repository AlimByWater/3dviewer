import './TriangleButton.css';
import { ActionIcon } from '@mantine/core';

const TriangleButton = ({
  href,
  onClick,
  color,
}: {
  href?: string;
  onClick?: () => void;
  color?: string;
}) => {
  return (
    <ActionIcon
      variant="transparent"
      component="a"
      href={href}
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
