import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.row}>
          <div className={styles.brand}>
            <img src={logo} alt="logo" />
            <span>Implementacion Diagramas de Flujo</span>
          </div>

          <nav className={styles.nav}>
            <Link to="/inicio" className={styles.link}>Inicio</Link>
            <Link to="/tasa-fija" className={styles.link}>Crecimiento con tasa fija</Link>
            <Link to="/tasa-variable" className={styles.link}>Crecimiento con tasa variable</Link>
            <Link to="/azucar" className={styles.link}>Agencia de azúcar</Link>
            <Link to="/tienda" className={styles.link}>Llegada de clientes tienda</Link>
            <Link to="/huevos" className={styles.link}>Gallina ponedora de huevos</Link>
            <Link to="/dados" className={styles.link}>Lanzamiento de dados</Link>
           
          </nav>
        </div>
      </div>
    </header>
  );
}

