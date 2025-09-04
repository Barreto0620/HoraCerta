import React, { useState } from 'react';
import { Clock, User, Building2, Mail } from 'lucide-react'; // Adicionado o ícone Mail para o campo de e-mail
import { User as UserType } from '../../types';
import { supabase } from '../../lib/supabase'; // Importação do Supabase
import { storage } from '../../utils/storage';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isLogin) {
      // Lógica de Login com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.user) {
        // A lógica de busca de perfil foi movida para o App.tsx.
        // O onLogin é chamado para notificar o App.
        setSuccessMessage('Login bem-sucedido! Redirecionando...');
      }
    } else {
      // Lógica de Registro com Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            department: formData.department
          }
        }
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.user) {
        setSuccessMessage('Confirmação de e-mail enviada! Verifique sua caixa de entrada.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-600 text-white">
              <Clock className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CLT Time Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sistema de controle de horas trabalhadas
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl p-6">
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 text-center py-2 px-4 rounded-md transition-all duration-200 ${
                isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 text-center py-2 px-4 rounded-md transition-all duration-200 ${
                !isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Registro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Departamento
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    required={!isLogin}
                  >
                    <option value="">Selecione o departamento</option>
                    <option value="TI">Tecnologia da Informação</option>
                    <option value="RH">Recursos Humanos</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Suporte">Suporte</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
            )}
            
            {errorMessage && (
              <p className="text-red-500 text-sm text-center font-medium mt-4">{errorMessage}</p>
            )}

            {successMessage && (
              <p className="text-green-500 text-sm text-center font-medium mt-4">{successMessage}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {isLogin ? 'Entrar' : 'Registrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
