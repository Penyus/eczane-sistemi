import { Link } from 'react-router-dom';
import {
  Boxes,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Ana Sayfa', href: '/', icon: Home, active: true },
  { label: 'Stok', href: '#stok', icon: Boxes },
  { label: 'Reçeteler', href: '#receteler', icon: ClipboardList },
  { label: 'Kullanıcılar', href: '#kullanicilar', icon: Users },
];

export default function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Ana sayfaya git">
          <span className="brand-mark">Rx</span>
          <span>
            <strong>Eczane Sistemi</strong>
            <small>Stok ve reçete kayıt</small>
          </span>
        </Link>

        <button
          className="icon-button d-lg-none"
          type="button"
          aria-label="Menüyü aç veya kapat"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                className={`nav-link-item ${item.active ? 'is-active' : ''}`}
                href={item.href}
                key={item.label}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="user-area">
          <span className="user-chip">
            <UserCircle size={18} />
            <span>Eczacı</span>
          </span>
          <button className="icon-button" type="button" aria-label="Çıkış yap">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}
