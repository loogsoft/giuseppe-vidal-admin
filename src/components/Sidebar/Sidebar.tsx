import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiShoppingCart,
  FiBox,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import styles from "./Sidebar.module.css";
import {
  ChevronDown,
  ClipboardList,
  FileBarChart2Icon,
  PackageCheck,
  PackageSearch,
  PackageX,
} from "lucide-react";
import { IoExitOutline } from "react-icons/io5";
import { useAuth } from "../../contexts/useAuth";
import logo from "../../assets/logo.png";

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [reportsOpen, setReportsOpen] = useState(false);

  const reportItems = [
    {
      label: "Controle de estoque",
      to: "/relatorios",
      icon: <PackageSearch size={25} />,
    },
    {
      label: "Entradas",
      to: "/relatorios",
      icon: <PackageCheck size={25} />,
    },
    {
      label: "Saidas",
      to: "/relatorios",
      icon: <PackageX size={25} />,
    },
    {
      label: "Produtos",
      to: "/relatorios",
      icon: <ClipboardList size={25} />,
    },
  ];

  function handleLogout() {
    // 1️⃣ Limpa token e estado
    logout();

    // 2️⃣ Redireciona para login
    navigate("/login");
  }
  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brand}>
          <div className={styles.brandIcon} aria-hidden="true">
            <img src={logo} alt="Logo" style={{ width: 40, height: 40 }} />
          </div>
          <div style={{ paddingTop: 10 }}>
            <strong className={styles.brandTitle}>GIUSEPPE</strong>
            <span className={styles.brandSubtitle}>Gestão de Unidade</span>
          </div>
        </div>

        <nav className={styles.menu}>
          <span className={styles.sectionTitle}>Menu principal</span>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiGrid className={styles.icon} />
            <span>Painel</span>
          </NavLink>

          <NavLink
            to="/produtos"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiBox className={styles.icon} />
            <span>Produtos</span>
          </NavLink>

          <NavLink
            to="/pedidos"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiShoppingCart className={styles.icon} />
            <span>Baixa de estoque</span>
            <span className={styles.badge}>12</span>
          </NavLink>

          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiUsers className={styles.icon} />
            <span>Fornecedores</span>
          </NavLink>

          <span className={styles.sectionTitle}>Relatorios</span>
          <button
            type="button"
            className={styles.submenuToggle}
            onClick={() => setReportsOpen((current) => !current)}
            aria-expanded={reportsOpen}
          >
            <span className={styles.submenuTitle}>
              <FileBarChart2Icon className={styles.icon} />
              <span>Relatorios</span>
            </span>
            <ChevronDown
              className={
                reportsOpen ? styles.submenuChevronOpen : styles.submenuChevron
              }
            />
          </button>
          <div
            className={
              reportsOpen ? styles.submenuList : styles.submenuListHidden
            }
          >
            {reportItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? styles.subLinkActive : styles.subLink
                }
              >
                <span className={styles.subIcon}>
                  {item.icon}
                </span>
                <span >{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
      <div className={styles.footer}>
        <NavLink
          to="/configuracoes"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          <FiSettings className={styles.icon} />
          <span>Configurações</span>
        </NavLink>

        <NavLink
          onClick={() => handleLogout()}
          to={""}
          className={({ isActive }) =>
            isActive ? styles.buttonExit : styles.linkButton
          }
        >
          <IoExitOutline className={styles.icon} color="red" />
          <span>Sair</span>
        </NavLink>
      </div>
    </aside>
  );
}
