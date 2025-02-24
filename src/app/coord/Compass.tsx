export default function Compass({
  compassRotation,
}: {
  compassRotation: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        left: "40px",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        zIndex: 10,
        border: "2px solid #2d2d2d",
        transform: `rotate(${compassRotation}deg)`,
      }}
    >
      <div
        style={{
          width: "2px",
          height: "20px",
          backgroundColor: "#2d2d2d",
          position: "absolute",
          top: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-16px",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#2d2d2d",
        }}
      >
        N
      </div>
    </div>
  );
}
