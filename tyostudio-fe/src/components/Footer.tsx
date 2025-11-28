import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.column}>
          <h4 style={styles.heading}>About Us</h4>
          {/* Tambahkan deskripsi about us jika ada */}
        </div>
        <div style={styles.column}>
          <h4 style={styles.heading}>Category</h4>
          <ul style={styles.list}>
            <li>Makanan</li>
            <li>Produk</li>
            <li>Jasa</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    padding: '40px 0',
    borderTop: '1px solid #ddd',
    marginTop: '40px',
  },
  container: {
    display: 'flex',
    gap: '100px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: '10px',
    fontSize: '16px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: '#444',
  },
};

export default Footer;