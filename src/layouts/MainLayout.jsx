import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = ({ children }) => {
  const location = useLocation();
  
  // Masquer le header sur la page de complétion de profil
  const shouldHideHeader = location.pathname === '/complete-profile';

  return (
    <div className="min-h-screen bg-gray-50">
      {!shouldHideHeader && <Header />}
      <main className={shouldHideHeader ? '' : 'pt-4'}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 