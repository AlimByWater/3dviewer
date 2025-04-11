import './TriangleLoader.css';

const TriangleLoader = () => {
  return (
    <div className="triangle-loader-container">
      <div className="triangle-loader animated">
        <div className="loader-point top">⁂</div>
        <div className="loader-point bottom-right">⁂</div>
        <div className="loader-point bottom-left">⁂</div>
      </div>
    </div>
  );
};

export default TriangleLoader;
