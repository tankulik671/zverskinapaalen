import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link to="/main">
        <img src="/images/logo.png" alt="Логотип" className={styles.logo} />
      </Link>
      <nav className={styles.nav}>
        <Link to="/diskografiya">ДИСКОГРАФИЯ</Link>
        <span className={styles.dot}>•</span>
        <Link to="/manifest">О ПРОЕКТЕ</Link>
        <span className={styles.dot}>•</span>
        <Link to="/rzt">РЗТ</Link>
      </nav>
    </header>
  );
}
