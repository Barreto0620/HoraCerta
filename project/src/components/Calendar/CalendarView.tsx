import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { TimeEntry, CalendarDay } from '../../types';
import { timeUtils } from '../../utils/timeCalculations';

interface CalendarViewProps {
  timeEntries: TimeEntry[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ timeEntries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const daysInMonth = timeUtils.getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1);

  const getMinutesForDate = (date: Date): number => {
    const dateString = date.toISOString().split('T')[0];
    return timeEntries
      .filter(entry => entry.date === dateString)
      .reduce((sum, entry) => sum + entry.minutes, 0);
  };

  const getEntriesForDate = (date: Date): TimeEntry[] => {
    const dateString = date.toISOString().split('T')[0];
    return timeEntries.filter(entry => entry.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const selectedDateEntries = selectedDate ? getEntriesForDate(new Date(selectedDate)) : [];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
              {monthName}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((date, index) => {
            const dateString = date.toISOString().split('T')[0];
            const minutes = getMinutesForDate(date);
            const isCurrentMonth = timeUtils.isSameMonth(date, firstDayOfMonth);
            const isToday = timeUtils.isToday(date);
            const isSelected = selectedDate === dateString;
            const hasEntries = minutes > 0;

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(isSelected ? null : dateString)}
                className={`
                  aspect-square p-2 rounded-lg text-sm transition-all duration-200 relative
                  ${isCurrentMonth 
                    ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700' 
                    : 'text-gray-400 dark:text-gray-600'
                  }
                  ${isToday 
                    ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400' 
                    : ''
                  }
                  ${isSelected 
                    ? 'bg-blue-600 text-white' 
                    : ''
                  }
                  ${hasEntries && !isSelected 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : ''
                  }
                `}
              >
                <span className="font-medium">{date.getDate()}</span>
                {hasEntries && (
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && selectedDateEntries.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Registros de {timeUtils.formatDateForDisplay(selectedDate)}
          </h3>
          
          <div className="space-y-3">
            {selectedDateEntries.map((entry) => (
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
            
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-white">Total do Dia:</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {timeUtils.formatMinutesToHours(selectedDateEntries.reduce((sum, entry) => sum + entry.minutes, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};