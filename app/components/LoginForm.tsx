"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiHelper from '../helpers/ApiHelper';
import { LoginRequest } from '../models/Interfaces';

export default function LoginForm() {
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (credentials.username === '' && credentials.password === '') setError('Username o password mancanti');

      const response = await ApiHelper.login(credentials);

      if (response.success) {
        localStorage.setItem('catarbus_user', JSON.stringify({
          username: credentials.username,
          role: response.user?.role,
          loginTime: new Date().toISOString()
        }));

        if(response.user?.role === 'admin') {
          router.push('/admin');
          return;
        } else {
          router.push('/dashboard');
          return;
        }
      } else {
        setError('Credenziali non valide');
      }
    } catch (err) {
      setError('Errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔐</span>
        <h2 className="text-lg font-semibold">Accesso Area Riservata</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Inserisci username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Inserisci password"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md transition-colors font-medium"
        >
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>Demo:</strong> admin / catarbus2025
        </p>
      </div>
    </div>
  );
}