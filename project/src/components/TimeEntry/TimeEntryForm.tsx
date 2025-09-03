import React, { useState } from 'react';
import { Clock, Plus, Save } from 'lucide-react';
import { TimeEntry, User } from '../../types';
import { storage } from '../../utils/storage';
import { timeUtils } from '../../utils/timeCalculations';

interface TimeEntryFormProps {
  user: User;
  onEntryAdded: () => void;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ user, onEntryAdded }) => {
  const [formData, setFormData] = useState({
    date: timeUtils.getCurrentDate(),
    startTime: timeUtils.getCurrentTime(),
    minutes: '',
    ticketId: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: TimeEntry = {
      id: crypto.randomUUID(),
      userId: user.id,
      date: formData.date,
      startTime: formData.startTime,
      minutes: parseInt(formData.minutes),
      ticketId: formData.ticketId || undefined,
      description: formData.description || undefined,
      createdAt: new Date().toISOString()
    };

    storage.saveTimeEntry(newEntry);
    onEntryAdded();
    
    // Reset form
    setFormData({
      date: timeUtils.getCurrentDate(),
      startTime: timeUtils.getCurrentTime(),
      minutes: '',
      ticketId: '',
      description: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Registrar Tempo
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Horário de Início
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minutos Trabalhados <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="minutes"
            value={formData.minutes}
            onChange={handleInputChange}
            placeholder="Ex: 45"
            min="1"
            max="1440"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID do Ticket (opcional)
          </label>
          <input
            type="text"
            name="ticketId"
            value={formData.ticketId}
            onChange={handleInputChange}
            placeholder="Ex: TASK-123"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição (opcional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descreva as atividades realizadas..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>Salvar Registro</span>
        </button>
      </form>
    </div>
  );
};