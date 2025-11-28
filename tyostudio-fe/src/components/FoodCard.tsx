import React from 'react';

interface FoodCardProps {
  imageSrc: string;
  name: string;
}

const FoodCard: React.FC<FoodCardProps> = ({ imageSrc, name }) => {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        {/* Placeholder image jika url asli tidak ada */}
        <img src={imageSrc} alt={name} style={styles.image} />
      </div>
      <div style={styles.body}>
        <h3 style={styles.title}>{name}</h3>
        
        <div style={styles.stats}>
            <div style={styles.row}>
                <span>(Number) Kal</span>
                <span style={styles.value}>20g | 10g</span>
            </div>
            <div style={styles.row}>
                <span>Protein</span>
                <span style={styles.value}>10g | 5g</span>
            </div>
            <div style={styles.row}>
                <span>Fats</span>
                <span style={styles.value}>30g | 10g</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    height: '140px',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '15px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    textAlign: 'left',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  stats: {
    fontSize: '12px',
    color: '#666',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  row: {
      display: 'flex',
      justifyContent: 'space-between',
  },
  value: {
      fontWeight: 500,
      color: '#444'
  }
};

export default FoodCard;