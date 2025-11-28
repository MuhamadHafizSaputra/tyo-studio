import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        {/* Logo Placeholder */}
        <div style={styles.logo}>Logo</div>

        {/* Menu Links */}
        <ul style={styles.menu}>
          {['Home', 'Artikel', 'Check IMT', 'About Us'].map((item) => (
            <li key={item} style={styles.menuItem}>
              <a href={`#${item.toLowerCase().replace(' ', '-')}`} style={styles.link}>
                {item}
              </a>
            </li>
          ))}
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