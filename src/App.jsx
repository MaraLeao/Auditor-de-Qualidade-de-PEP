import React, { useState, useEffect } from 'react';
import Sidebar from './presentation/components/Sidebar.jsx';
import AuditView from './presentation/views/AuditView.jsx';
import DashboardView from './presentation/views/DashboardView.jsx';
import ExplanationView from './presentation/views/ExplanationView.jsx';

export default function App() {
  const [activeView, setActiveView] = useState('audit'); // 'audit', 'dashboard', 'explanation'
  const [initialExampleIndex, setInitialExampleIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 600 : false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectExampleFromDashboard = (index) => {
    setInitialExampleIndex(index);
    setActiveView('audit');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      background: 'var(--bg)',
      color: 'var(--text)'
    }}>
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} isMobile={isMobile} />

      {/* Main View Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? 'auto' : '100vh',
        overflowY: isMobile ? 'visible' : 'auto'
      }}>

        {/* Top Header for mobile and branding */}
        <header style={{
          borderBottom: '1px solid var(--border)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'var(--bg2)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          {isMobile && (
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent) 0%, #0066aa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17
            }}>
              ⚕
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>Auditor de Prontuários</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>CFM · LGPD · RDC 63/2011</div>
          </div>

        </header>

        {/* View render area */}
        <main style={{ flex: 1 }}>
          {activeView === 'audit' && (
            <AuditView
              initialExampleIndex={initialExampleIndex}
              clearInitialExample={() => setInitialExampleIndex(null)}
              isMobile={isMobile}
            />
          )}
          {activeView === 'dashboard' && (
            <DashboardView
              onSelectExample={handleSelectExampleFromDashboard}
              isMobile={isMobile}
            />
          )}
          {activeView === 'explanation' && (
            <ExplanationView
              isMobile={isMobile}
            />
          )}
        </main>
      </div>
    </div>
  );
}
