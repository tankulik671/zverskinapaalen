// accounts.js — пользователи + рецензии через Supabase Auth

import { createClient } from "https://unpkg.com/@supabase/supabase-js?module";

// ------------------------
// Supabase client
// ------------------------
export const supabase = createClient(
  "https://mtunttvfbprvgwdaearu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dW50dHZmYnBydmd3ZGFlYXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODcwODAsImV4cCI6MjA3OTY2MzA4MH0.ECGyw1mniRwNCG8NhFEpGhU997y42J9dBERohP_9lf4"
);

// ------------------------
// Регистрация нового пользователя
// ------------------------
export async function registerUser(nickname, email, password) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Не удалось создать пользователя");

  const userId = authData.user.id;

  const { data, error } = await supabase.from("users").insert({
    id: userId,
    nickname,
    email,
    password,
    photo: "images/avatarka01.jpg",
    about: "Расскажи о себе"
  }).select().single();

  if (error) throw error;

  return data;
}

// ------------------------
// Вход пользователя
// ------------------------
export async function loginUser(email, password) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Неверный логин или пароль");

  const userId = authData.user.id;

  const { data: user, error } = await supabase.from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return user;
}

// ------------------------
// Получаем текущего авторизованного пользователя
// ------------------------
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user || null;
}

// ------------------------
// Обновление профиля
// ------------------------
export async function updateCurrentUser(data) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Пользователь не авторизован");

  const userId = user.id;

  const { data: updated, error } = await supabase
    .from("users")
    .update(data)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

// ------------------------
// Выход
// ------------------------
export async function logoutUser() {
  await supabase.auth.signOut();
  return null;
}

// ------------------------
// Загрузка аватарки
// ------------------------
export async function updateAvatar(file) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Пользователь не авторизован");

  const userId = user.id;
  const fileExt = file.name.split('.').pop();
  const fileName = `user_${userId}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
  const bucketUrl = urlData.publicUrl;

  await updateCurrentUser({ photo: bucketUrl });

  return bucketUrl;
}

// ------------------------
// Получить аватарку
// ------------------------
export async function getLastAvatar() {
  const user = await getCurrentUser();
  if (!user) return "images/avatarka01.jpg";

  const { data: userData } = await supabase
    .from("users")
    .select("photo")
    .eq("id", user.id)
    .single();

  if (userData && userData.photo) return userData.photo;
  return "images/avatarka01.jpg";
}

// ------------------------
// РЕЦЕНЗИИ
// ------------------------

// Добавление рецензии
export async function addReview(reviewData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Пользователь не авторизован");

  const { data, error } = await supabase.from("reviews").insert({
    user_id: user.id,
    track_id: reviewData.trackId,
    track_title: reviewData.trackTitle,
    performer: reviewData.performer,
    cover: reviewData.cover,
    review_text: reviewData.reviewText,
    rhymes: reviewData.rhymes,
    structure: reviewData.structure,
    style: reviewData.style,
    charisma: reviewData.charisma,
    vibe: reviewData.vibe,
    total_score: reviewData.totalScore
  }).select().single();

  if (error) throw error;
  return data;
}

// Получить рецензии текущего пользователя
export async function getCurrentUserReviews() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Пользователь не авторизован");

  const { data, error } = await supabase.from("reviews")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw error;
  return data;
}

// Редактирование рецензии
export async function updateReview(reviewId, newData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Пользователь не авторизован");

  const { data, error } = await supabase.from("reviews")
    .update(newData)
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Удаление рецензии
export async function deleteReview(reviewId) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Пользователь не авторизован");

  const { data, error } = await supabase.from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
