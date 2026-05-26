// js/supabase-client.js
// Подключаем Supabase через esm.sh (для браузера)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Создаём и экспортируем глобальный клиент Supabase
export const supabase = createClient(
  "https://mtunttvfbprvgwdaearu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dW50dHZmYnBydmd3ZGFlYXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODcwODAsImV4cCI6MjA3OTY2MzA4MH0.ECGyw1mniRwNCG8NhFEpGhU997y42J9dBERohP_9lf4"
);

// ------------------------
// Проверка подключения (можно удалить после теста)
// ------------------------
async function testConnection() {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) {
      console.error("❌ Ошибка Supabase:", error.message);
    } else {
      console.log("✅ Supabase клиент подключён:", data);
    }
  } catch (err) {
    console.error("❌ Ошибка подключения Supabase:", err);
  }
}

testConnection();
