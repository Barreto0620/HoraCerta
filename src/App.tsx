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
import { supabase } from './lib/supabase';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session?.user) {
          // Buscar ou criar perfil no banco
          const { data: profile, error } = await storage.getProfile(session.user.id);
          
          if (profile) {
            setCurrentUser(profile);
          } else {
            // Criar perfil se não existir
            const newProfile: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
              department: session.user.user_metadata?.department || 'TI',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            const { data: createdProfile } = await storage.createProfile(newProfile);
            if (createdProfile && mounted) {
              setCurrentUser(newProfile);
            }
          }
          
          // Carregar registros de tempo
          try {
            const { data } = await storage.getUserTimeEntries(session.user.id);
            if (mounted) {
              setTimeEntries(data || []);
            }
          } catch (error) {
            console.log('Erro ao carregar registros, usando array vazio');
            if (mounted) {
              setTimeEntries([]);
            }
          }
        } else {
          if (mounted) {
            setCurrentUser(null);
            setTimeEntries([]);
          }
        }
      } catch (error) {
        console.log('Erro na verificação de sessão');
        if (mounted) {
          setCurrentUser(null);
          setTimeEntries([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await storage.getProfile(session.user.id);
          
          if (profile) {
            setCurrentUser(profile);
          } else {
            const newProfile: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
              department: session.user.user_metadata?.department || 'TI',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            await storage.createProfile(newProfile);
            setCurrentUser(newProfile);
          }
          
          setLoading(false);
          
          storage.getUserTimeEntries(session.user.id).then(({ data }) => {
            if (mounted) {
              setTimeEntries(data || []);
            }
          }).catch(() => {
            if (mounted) {
              setTimeEntries([]);
            }
          });
        } 
        else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setTimeEntries([]);
          setActiveView('dashboard');
        }
      }
    );

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Erro no logout, forçando logout local');
      setCurrentUser(null);
      setTimeEntries([]);
    }
  };

  const handleEntryAdded = async () => {
    if (currentUser) {
      try {
        const { data } = await storage.getUserTimeEntries(currentUser.id);
        setTimeEntries(data || []);
      } catch (error) {
        console.log('Erro ao recarregar registros');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            CLT Time Tracker
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex h-screen">
        {/* Botão do menu mobile */}
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
        <div className={`${sidebarCollapsed ? 'hidden lg:block' : 'block'} lg:block`}>
          <Sidebar
            activeView={activeView}
            onViewChange={setActiveView}
            isCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Conteúdo principal */}
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

      {/* Overlay mobile */}
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