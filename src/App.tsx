import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    // Check if user session was already saved in localStorage
    return localStorage.getItem('barber_user_session');
  });

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('barber_user_session', email);
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem('barber_user_session');
  };

  return (
    <div id="root-app" className="min-h-screen bg-[#121315] select-text selection:bg-[#C37A4C]/30 selection:text-[#D99468]">
      {userEmail ? (
        <Dashboard userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <AuthPage onSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
