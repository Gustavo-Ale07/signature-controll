import { Link } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { LayoutDashboard, FolderOpen, Settings } from 'lucide-react';

export default function Sidebar() {
  const { user } = useUser();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/items', icon: FolderOpen, label: 'Itens' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-600">Smilo Vault</h1>
        <p className="text-sm text-gray-600 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-1"
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-gray-600">Conta</span>
          <UserButton />
        </div>
      </div>
    </aside>
  );
}
