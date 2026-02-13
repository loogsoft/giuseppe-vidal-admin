import styles from "./Header.module.css";
import { FiSearch, FiBell, FiMoon, FiSun} from "react-icons/fi";
import { useTheme } from "../../contexts/useTheme";

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title || ""}</h1>

      <div className={styles.search}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar pedido ou cliente..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconButton}
          type="button"
          aria-label="Alternar tema"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        <button className={styles.iconButton} type="button" aria-label="Notificacoes">
          <FiBell />
        </button>

        <div className={styles.avatar} aria-label="Perfil">
          <span>A</span>
        </div>
      </div>
    </header>
  );
}
