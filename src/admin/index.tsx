import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { AdminLayout } from './AdminLayout';
import { AdminLogin } from './Adminlogin';
import { ProductsAdmin } from './ProductsAdmin';
import { ContactAdmin } from './ContactAdmin';
import { AboutAdmin } from './AboutAdmin';
import type { AdminLang } from './AdminLayout';

export const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [adminLang, setAdminLang] = useState<AdminLang>('fr'); // Français par défaut

  useEffect(() => {
    // Vérifier la session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setActiveTab('products');
  };

  // Chargement initial
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Non authentifié → Login
  if (!session) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  // Authentifié → Dashboard
  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      adminLang={adminLang}
      setAdminLang={setAdminLang}
    >
      {activeTab === 'products' && <ProductsAdmin adminLang={adminLang} />}
      {activeTab === 'contact'  && <ContactAdmin  adminLang={adminLang} />}
      {activeTab === 'about'    && <AboutAdmin    adminLang={adminLang} />}
    </AdminLayout>
  );
};