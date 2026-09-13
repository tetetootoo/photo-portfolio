import { NavLink } from "react-router-dom";
import "./Nav.css";

export function BottomNav() {
  const year = new Date().getFullYear();
  return (
    <footer className="bottom-nav">
      <span className="bottom-nav__copyright">© Half ODD {year}</span>
      <NavLink to="/imprint" className="bottom-nav__link">
        Imprint
      </NavLink>
    </footer>
  );
}
