import { useEffect, useState } from "react";

export default function DebugPage() {
  const [result, setResult] = useState("loading...");

  useEffect(() => {
    setResult("Supabase удалён. Тест недоступен.");
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Supabase Test</h1>
      <div id="output">{result}</div>
    </div>
  );
}
