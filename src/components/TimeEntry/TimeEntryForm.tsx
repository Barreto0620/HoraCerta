import React, { useState } from 'react';
import { Clock, Plus, Save, Briefcase, Tag } from 'lucide-react';
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
    start_time: timeUtils.getCurrentTime(),
    minutes: '',
    ticket_id: '',
    description: '',
    project_name: '',
    activity_type: '',
    is_billable: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const newEntry: TimeEntry = {
        id: crypto.randomUUID(),
        user_id: user.id,
        date: formData.date,
        start_time: formData.start_time,
        minutes: parseInt(formData.minutes),
        ticket_id: formData.ticket_id || undefined,
        description: formData.description || undefined,
        project_name: formData.project_name || undefined,
        activity_type: formData.activity_type || undefined,
        is_billable: formData.is_billable,
        is_approved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await storage.saveTimeEntry(newEntry);
      
      if (error) {
        setMessage({ type: 'error', text: 'Erro ao salvar registro. Tente novamente.' });
      } else {
        setMessage({ type: 'success', text: 'Registro salvo com sucesso!' });
        onEntryAdded();
        
        // Reset form
        setFormData({
          date: timeUtils.getCurrentDate(),
          start_time: timeUtils.getCurrentTime(),
          minutes: '',
          ticket_id: '',
          description: '',
          project_name: '',
          activity_type: '',
          is_billable: true
        });

        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro inesperado. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Registrar Tempo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Adicione um novo registro de tempo trabalhado
        </p>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Novo Registro
          </h2>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700' 
              : 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
          }`}>
            <p className={`text-sm font-medium ${
              message.type === 'success' 
                ? 'text-green-700 dark:text-green-400' 
                : 'text-red-700 dark:text-red-400'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data <span className="text-red-500">*</span>
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
                Horário de Início <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minutos Trabalhados <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="minutes"
                value={formData.minutes}
                onChange={handleInputChange}
                placeholder="Ex: 480 (8 horas)"
                min="1"
                max="1440"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.minutes && !isNaN(parseInt(formData.minutes)) && 
                  `≈ ${timeUtils.formatMinutesToHours(parseInt(formData.minutes))}`
                }
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID do Ticket
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="ticket_id"
                  value={formData.ticket_id}
                  onChange={handleInputChange}
                  placeholder="Ex: TASK-123, BUG-456"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome do Projeto
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  placeholder="Ex: Sistema de Vendas, Website"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Atividade
              </label>
              <select
                name="activity_type"
                value={formData.activity_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="">Selecione o tipo</option>
                <option value="Desenvolvimento">Desenvolvimento</option>
                <option value="Reunião">Reunião</option>
                <option value="Análise">Análise</option>
                <option value="Testes">Testes</option>
                <option value="Documentação">Documentação</option>
                <option value="Suporte">Suporte</option>
                <option value="Treinamento">Treinamento</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição das Atividades
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva detalhadamente as atividades realizadas..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_billable"
              name="is_billable"
              checked={formData.is_billable}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="is_billable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tempo faturável ao cliente
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Salvar Registro</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};