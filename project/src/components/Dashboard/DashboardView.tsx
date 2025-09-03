import React from 'react';
import { Clock, Calendar, TrendingUp, Award } from 'lucide-react';
import { TimeEntry, User } from '../../types';
import { timeUtils } from '../../utils/timeCalculations';

interface DashboardViewProps {
  user: User;
  timeEntries: TimeEntry[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, timeEntries }) => {
  const today = timeUtils.getCurrentDate();
  const todayEntries = timeEntries.filter(entry => entry.date === today);
  const todayMinutes = todayEntries.reduce((sum, entry) => sum + entry.minutes, 0);

  const thisWeek = (() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });
  })();

  const thisMonth = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
  })();

  const weeklyMinutes = thisWeek.reduce((sum, entry) => sum + entry.minutes, 0);
  const monthlyMinutes = thisMonth.reduce((sum, entry) => sum + entry.minutes, 0);

  const stats = [
    {
      title: 'Hoje',
      value: timeUtils.formatMinutesToHours(todayMinutes),
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Esta Semana',
      value: timeUtils.formatMinutesToHours(weeklyMinutes),
      icon: Calendar,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Este Mês',
      value: timeUtils.formatMinutesToHours(monthlyMinutes),
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'Total de Entradas',
      value: timeEntries.length.toString(),
      icon: Award,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bem-vindo, {user.name}! Aqui está o resumo das suas horas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Registros de Hoje
        </h2>
        
        {todayEntries.length > 0 ? (
          <div className="space-y-3">
            {todayEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {timeUtils.formatTime(entry.startTime)}
                    </span>
                    {entry.ticketId && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded">
                        {entry.ticketId}
                      </span>
                    )}
                  </div>
                  {entry.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {timeUtils.formatMinutesToHours(entry.minutes)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum registro de tempo hoje. Adicione seu primeiro registro!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};