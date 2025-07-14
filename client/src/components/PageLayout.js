// client/src/components/PageLayout.js
import React from 'react';

const PageLayout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f6ff',
        backgroundImage: "url('/logo-watermark.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '40%',
        opacity: 1,
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      {/* Removed old Swastik Steel header */}

      <main style={{ padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
