import { PrimitiveProps } from "@react-three/fiber";

interface WorkViewProps extends PrimitiveProps {
  swimming?: boolean | undefined;
}

const WorkView = ({ swimming = false, ...props }: WorkViewProps) => {
  return <primitive {...props} />;
};

export default WorkView;
