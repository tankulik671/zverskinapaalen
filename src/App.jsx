import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import DiscographyPage from "./pages/DiscographyPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RztPage from "./pages/RztPage.jsx";
import FlompidorPage from "./pages/FlompidorPage.jsx";
import LolPage from "./pages/LolPage.jsx";
import AzazatrolilPage from "./pages/AzazatrolilPage.jsx";
import DebugPage from "./pages/DebugPage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import ManifestPage from "./pages/ManifestPage.jsx";
import AlbumPage from "./pages/AlbumPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<Layout />}>
        <Route path="/main" element={<MainPage />} />
        <Route path="/diskografiya" element={<DiscographyPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/rzt" element={<RztPage />} />
        <Route path="/reviews" element={<FlompidorPage />} />
        <Route path="/manifest" element={<ManifestPage />} />
        <Route path="/lol" element={<LolPage />} />
        <Route path="/azazatrolil" element={<AzazatrolilPage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/album/:slug" element={<AlbumPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
