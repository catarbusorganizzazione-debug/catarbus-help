'use client';

import React, { useState, useEffect } from 'react';
import ApiHelper from '../helpers/ApiHelper';
import { RankingUser } from '../models/Interfaces';

export default function Classifica() {
  const [teams, setTeams] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const result = await ApiHelper.getUsersRanking();
        
        if (result.success && result.ranking) {
          setTeams(result.ranking);
        } else {
          setError(result.message || 'Errore nel caricamento della classifica');
        }
      } catch (err) {
        setError('Errore di connessione');
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const sortedTeams = teams
    .sort((a, b) => b.checkpointsCompleted - a.checkpointsCompleted);

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}°`;
    }
  };

  if (loading) {
    return (
      <div id="classifica" className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🏆</span>
          <h2 className="text-xl font-semibold">Classifica Live</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">Caricamento classifica...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="classifica" className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">🏆</span>
          <h2 className="text-xl font-semibold">Classifica Live</h2>
        </div>
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div id="classifica" className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🏆</span>
        <h2 className="text-xl font-semibold">Classifica Live</h2>
        <span className="ml-auto text-sm text-gray-500">
          Aggiornato: {new Date().toLocaleTimeString('it-IT')}
        </span>
      </div>

      <div className="space-y-4">
        {sortedTeams.map((team, index: number) => (
          <div 
            key={team.name} 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-2xl font-bold text-gray-600 w-10">
                {getPositionIcon(index)}
              </div>
              
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: team.colour }}
              ></div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-600">
                  Checkpoint completati
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {team.checkpointsCompleted}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}