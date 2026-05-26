export default function AnimatedBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "url(/images/НЕБО ФОН.gif) center center / cover no-repeat",
        zIndex: -2,
        filter: "brightness(0.4) contrast(1.2)",
        animation: "bgScroll 60s linear infinite",
      }}
    />
  );
}
