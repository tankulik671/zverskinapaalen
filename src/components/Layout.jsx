import { Outlet } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground.jsx";
import SoundCloudPlayer from "./SoundCloudPlayer.jsx";
import ScrollToTopButton from "./ScrollToTopButton.jsx";
import Header from "./Header.jsx";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <AnimatedBackground />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <SoundCloudPlayer />
      <ScrollToTopButton />
    </div>
  );
}
