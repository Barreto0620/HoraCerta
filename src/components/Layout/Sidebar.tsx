import React from 'react';
import { Clock, Calendar, BarChart3, PlusCircle } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: Clock },
    { id: 'time-entry', label: 'Registrar Tempo', icon: PlusCircle },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};