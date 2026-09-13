import { NavLink } from "react-router-dom";
import "./Nav.css";

const links = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function TopNav() {
  return (
    <nav className="top-nav">
      <NavLink to="/" end className="top-nav__logo">
        Theresa Schantz
      </NavLink>
      <div className="top-nav__links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "top-nav__link top-nav__link--active" : "top-nav__link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
