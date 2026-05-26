// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// 🔹 Настройки твоего проекта Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDhaT4Vj2OV3hbOpvGpwnwtMhoOonTFOq4",
  authDomain: "zverskinapalensite.firebaseapp.com",
  projectId: "zverskinapalensite",
  storageBucket: "zverskinapalensite.firebasestorage.app",
  messagingSenderId: "417781515148",
  appId: "1:417781515148:web:692028d3c358a8612c0ca9",
  measurementId: "G-VTNTP7DTDC"
};

// 🔹 Инициализация Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔹 Вход через Google
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    console.error(e);
    alert("Ошибка входа: " + e.message);
  }
}

// 🔹 Выход
export function logout() {
  signOut(auth);
}

// 🔹 Отслеживание состояния входа
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, user => {
    callback(user); // user будет null, если пользователь вышел
  });
}

// 🔹 Добавление рецензии
export async function addReview(text) {
  const user = auth.currentUser;
  if(!user) throw new Error("Сначала войдите через Google");

  await addDoc(collection(db, "reviews"), {
    uid: user.uid,
    name: user.displayName,
    text,
    timestamp: serverTimestamp()
  });
}

// 🔹 Получение рецензий (реальное время)
export function listenReviews(callback) {
  const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
  onSnapshot(q, snapshot => {
    const reviews = snapshot.docs.map(doc => doc.data());
    callback(reviews);
  });
}
