// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Navbar: React.FC = () => {
  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        {/* Logo Link to Home */}
        <div style={styles.logo}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Logo</Link>
        </div>

        {/* Menu Links */}
        <ul style={styles.menu}>
            <li style={styles.menuItem}>
                <Link to="/" style={styles.link}>Home</Link>
            </li>
            <li style={styles.menuItem}>
                <a href="#artikel" style={styles.link}>Artikel</a>
            </li>
            <li style={styles.menuItem}>
                {/* Link to the Calculator Route */}
                <Link to="/calculator" style={styles.link}>Check IMT</Link>
            </li>
            <li style={styles.menuItem}>
                <a href="#about-us" style={styles.link}>About Us</a>
            </li>
        </ul>

        {/* Login Button */}
        <button style={styles.loginBtn}>Login</button>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    padding: '20px 0',
    backgroundColor: 'transparent',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    backgroundColor: '#ccc',
    padding: '5px 15px',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  menu: {
    display: 'flex',
    listStyle: 'none',
    gap: '30px',
    padding: 0,
    margin: 0,
  },
  menuItem: {},
  link: {
    textDecoration: 'none',
    color: '#555',
    fontWeight: 500,
    fontSize: '14px',
  },
  loginBtn: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    padding: '8px 24px',
    borderRadius: '6px',
    fontSize: '14px',
  },
};

export default Navbar;