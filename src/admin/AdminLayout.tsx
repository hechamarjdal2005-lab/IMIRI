import React, { useState } from 'react';
import { Package, Phone, Info, LogOut, Menu, X, Globe, ImageIcon } from 'lucide-react';

const i18n = {
  fr: {
    title: 'Administration',
    products: 'Produits',
    contact: 'Contact',
    about: 'À propos',
    hero: 'Hero / Accueil',
    logout: 'Déconnexion',
    toggle: 'العربية',
  },
  ar: {
    title: 'لوحة التحكم',
    products: 'المنتجات',
    contact: 'الاتصال',
    about: 'من نحن',
    hero: 'الصفحة الرئيسية (Hero)',
    logout: 'تسجيل الخروج',
    toggle: 'Français',
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  adminLang: 'fr' | 'ar';
  setAdminLang: (l: 'fr' | 'ar') => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  onLogout,
  adminLang,
  setAdminLang,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = i18n[adminLang];
  const isRTL = adminLang === 'ar';

  const menuItems = [
    { id: 'hero',     label: t.hero,     icon: <ImageIcon size={20} /> },
    { id: 'products', label: t.products, icon: <Package size={20} /> },
    { id: 'contact',  label: t.contact,  icon: <Phone size={20} /> },
    { id: 'about',    label: t.about,    icon: <Info size={20} /> },
  ];

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh',
        background: '#f3f4f6',
        position: 'relative',
      }}
    >
      {/* ─── SIDEBAR ─── */}
      <aside
        style={{
          width: 256,
          minWidth: 256,
          background: '#fff',
          boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 20px',
          background: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>
            {t.title}
          </h1>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                textAlign: isRTL ? 'right' : 'left',
                transition: 'all 0.15s ease',
                background: activeTab === item.id ? '#2563eb' : 'transparent',
                color: activeTab === item.id ? '#fff' : '#4b5563',
              }}
              onMouseEnter={e => {
                if (activeTab !== item.id)
                  (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6';
              }}
              onMouseLeave={e => {
                if (activeTab !== item.id)
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Language toggle */}
          <button
            onClick={() => setAdminLang(adminLang === 'fr' ? 'ar' : 'fr')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 16px',
              borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 13, color: '#4b5563', background: 'transparent',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            <Globe size={17} />
            {t.toggle}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 16px',
              borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 13, color: '#dc2626', background: 'transparent',
              textAlign: isRTL ? 'right' : 'left',
            }}
          >
            <LogOut size={17} />
            {t.logout}
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            padding: '32px',
            minHeight: 500,
          }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export { i18n };
export type AdminLang = 'fr' | 'ar';