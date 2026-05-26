export default function LolPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url(/images/хули.jpg)",
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        animation: "bgScroll 40s linear infinite",
        filter: "brightness(0.8) contrast(1.2)",
      }}
    />
  );
}
