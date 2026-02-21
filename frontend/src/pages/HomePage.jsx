import { Link } from 'react-router-dom';

const HomePage = () => {
  const isDev = import.meta.env.DEV;

  return (
    <main style={styles.wrapper}>
      <header style={styles.header}>
        <h1 style={styles.title}>APATEX</h1>
        <p style={styles.tagline}>Institutional APA Validation System</p>
      </header>

      <nav style={styles.nav}>
        {/* Main Entry to the actual Editor */}
        <Link to="/editor" style={styles.primaryBtn}>
          New Document
        </Link>

        {/* The Sandbox / Lab for  experiments */}
        {isDev && (
          <Link to="/lab" style={styles.labBtn}>
            🧪 Architecture Lab
          </Link>
        )}
      </nav>

      <footer style={styles.footer}>
        v0.3.0 - University of Boyacá Standard
      </footer>
    </main>
  );
};

// Basic inline styles to get you started
const styles = {
  wrapper: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1e2e', color: '#cdd6f4', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '3rem' },
  title: { fontSize: '4rem', margin: 0, letterSpacing: '-2px', color: '#89b4fa' },
  tagline: { fontSize: '1.2rem', opacity: 0.8 },
  nav: { display: 'flex', gap: '20px' },
  primaryBtn: { padding: '15px 40px', backgroundColor: '#a6e3a1', color: '#11111b', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' },
  labBtn: { padding: '15px 40px', backgroundColor: '#f5c2e7', color: '#11111b', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' },
  footer: { position: 'absolute', bottom: '20px', fontSize: '0.8rem', opacity: 0.5 }
};

export default HomePage;
