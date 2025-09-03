import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginForm } from './components/Auth/LoginForm';
import { DashboardView } from './components/Dashboard/DashboardView';
import { TimeEntryForm } from './components/TimeEntry/TimeEntryForm';
import { CalendarView } from './components/Calendar/CalendarView';
import { ReportsView } from './components/Reports/ReportsView';
import { User, TimeEntry } from './types';
import { storage } from './utils/storage';
import { useTheme } from './hooks/useTheme';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadTimeEntries(user.id);
    }
  }, []);

  const loadTimeEntries = (userId: string) => {
    const entries = storage.getUserTimeEntries(userId);
    setTimeEntries(entries);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    storage.setCurrentUser(user);
    loadTimeEntries(user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storage.setCurrentUser(null);
    setTimeEntries([]);
    setActiveView('dashboard');
  };

  const handleEntryAdded = () => {
    if (currentUser) {
      loadTimeEntries(currentUser.id);
    }
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView user={currentUser} timeEntries={timeEntries} />;
      case 'time-entry':
        return <TimeEntryForm user={currentUser} onEntryAdded={handleEntryAdded} />;
      case 'calendar':
        return <CalendarView timeEntries={timeEntries} />;
      case 'reports':
        return <ReportsView user={currentUser} timeEntries={timeEntries} />;
      default:
        return <DashboardView user={currentUser} timeEntries={timeEntries} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="flex h-screen">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        >
          {sidebarCollapsed ? (
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'hidden lg:block' : 'block'} lg:block transition-all duration-300`}>
          <Sidebar
            activeView={activeView}
            onViewChange={setActiveView}
            isCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            user={currentUser}
            isDark={isDark}
            toggleTheme={toggleTheme}
            onLogout={handleLogout}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}

export default App;