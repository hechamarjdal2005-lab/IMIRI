import React, { useState } from 'react';
import { Package, Phone, Info, LogOut, Menu, X, Globe } from 'lucide-react';

// ─── Traductions FR / AR ───────────────────────────────────────────────
const i18n = {
  fr: {
    title: 'Administration',
    products: 'Produits',
    contact: 'Contact',
    about: 'À propos',
    logout: 'Déconnexion',
    toggle: 'العربية',
  },
  ar: {
    title: 'لوحة التحكم',
    products: 'المنتجات',
    contact: 'الاتصال',
    about: 'من نحن',
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
    { id: 'products', label: t.products, icon: <Package size={20} /> },
    { id: 'contact',  label: t.contact,  icon: <Phone size={20} /> },
    { id: 'about',    label: t.about,    icon: <Info size={20} /> },
  ];

  const Sidebar = () => (
    <aside
      className={`
        fixed inset-y-0 z-50 w-64 bg-white shadow-xl flex flex-col
        transform transition-transform duration-300
        ${isRTL ? 'left-auto right-0' : 'right-auto left-0'}
        ${sidebarOpen
          ? 'translate-x-0'
          : isRTL ? 'translate-x-full' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-auto
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b bg-blue-600">
        <h1 className="text-lg font-bold text-white">{t.title}</h1>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
          <X size={22} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors text-sm font-medium
              ${activeTab === item.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        {/* Language toggle */}
        <button
          onClick={() => setAdminLang(adminLang === 'fr' ? 'ar' : 'fr')}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Globe size={18} />
          {t.toggle}
        </button>
        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          {t.logout}
        </button>
      </div>
    </aside>
  );

  return (
    <div className={`min-h-screen bg-gray-100 flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      <Sidebar />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between bg-white border-b px-4 py-3 shadow-sm">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-800 text-sm">{t.title}</span>
          <div className="w-6" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[500px]">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Export i18n for use in child components
export { i18n };
export type AdminLang = 'fr' | 'ar';