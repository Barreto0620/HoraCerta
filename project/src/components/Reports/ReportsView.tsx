import React, { useState } from 'react';
import { Download, FileText, Filter, BarChart3 } from 'lucide-react';
import { TimeEntry, User } from '../../types';
import { timeUtils } from '../../utils/timeCalculations';

interface ReportsViewProps {
  user: User;
  timeEntries: TimeEntry[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ user, timeEntries }) => {
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getFilteredEntries = (): TimeEntry[] => {
    const now = new Date();
    
    switch (filterPeriod) {
      case 'week':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        return timeEntries.filter(entry => new Date(entry.date) >= startOfWeek);
      
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return timeEntries.filter(entry => new Date(entry.date) >= startOfMonth);
      
      case 'custom':
        if (startDate && endDate) {
          return timeEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
          });
        }
        return timeEntries;
      
      default:
        return timeEntries;
    }
  };

  const filteredEntries = getFilteredEntries();
  const totalMinutes = filteredEntries.reduce((sum, entry) => sum + entry.minutes, 0);
  const totalDays = new Set(filteredEntries.map(entry => entry.date)).size;
  const averagePerDay = totalDays > 0 ? totalMinutes / totalDays : 0;

  const exportToCSV = () => {
    const headers = ['Data', 'Horário', 'Minutos', 'Horas', 'Ticket', 'Descrição'];
    const csvData = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        entry.date,
        entry.startTime,
        entry.minutes,
        timeUtils.formatMinutesToHours(entry.minutes),
        entry.ticketId || '',
        entry.description || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-horas-${user.name}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const groupedByDate = filteredEntries.reduce((groups, entry) => {
    if (!groups[entry.date]) {
      groups[entry.date] = [];
    }
    groups[entry.date].push(entry);
    return groups;
  }, {} as Record<string, TimeEntry[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Relatórios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize e exporte seus dados de tempo
          </p>
        </div>
        
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Download className="h-4 w-4" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Período
            </label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="all">Todo o Período</option>
              <option value="custom">Período Personalizado</option>
            </select>
          </div>

          {filterPeriod === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Horas</h4>
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {timeUtils.formatMinutesToHours(totalMinutes)}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Dias Trabalhados</h4>
            <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalDays}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Média por Dia</h4>
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {timeUtils.formatMinutesToHours(Math.round(averagePerDay))}
          </p>
        </div>
      </div>

      {/* Detailed Report */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Relatório Detalhado
        </h3>
        
        {Object.keys(groupedByDate).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedByDate)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, entries]) => {
                const dayTotal = entries.reduce((sum, entry) => sum + entry.minutes, 0);
                
                return (
                  <div key={date} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {timeUtils.formatDateForDisplay(date)}
                      </h4>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {timeUtils.formatMinutesToHours(dayTotal)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {timeUtils.formatTime(entry.startTime)}
                              </span>
                              {entry.ticketId && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded">
                                  {entry.ticketId}
                                </span>
                              )}
                            </div>
                            {entry.description && (
                              <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {entry.description}
                              </p>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {timeUtils.formatMinutesToHours(entry.minutes)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum registro encontrado para o período selecionado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};