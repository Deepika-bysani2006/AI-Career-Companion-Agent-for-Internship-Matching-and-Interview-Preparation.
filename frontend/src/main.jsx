import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SkillBridge Error Boundary caught an exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif', padding: '20px', textAlignment: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#14b8a6' }}>SkillBridge Application Notice</h2>
          <p style={{ marginTop: '10px', color: '#94a3b8', maxWidth: '500px', textAlign: 'center' }}>
            The application encountered a transient loading issue. Click below to reload the platform.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '12px', backgroundColor: '#0d9488', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Reload SkillBridge
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
