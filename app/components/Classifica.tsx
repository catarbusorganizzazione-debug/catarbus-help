// Mock data temporaneo
const mockTeams = [
  { id: "1", name: "Squadra Rossa", color: "#ef4444", completedCheckpoints: [1,2,3], lastUpdate: new Date() },
  { id: "2", name: "Squadra Blu", color: "#3b82f6", completedCheckpoints: [1,2,3,4], lastUpdate: new Date() },
  { id: "3", name: "Squadra Verde", color: "#10b981", completedCheckpoints: [1,2], lastUpdate: new Date() },
  { id: "4", name: "Squadra Gialla", color: "#f59e0b", completedCheckpoints: [1,2,3,4,5], lastUpdate: new Date() },
  { id: "5", name: "Squadra Viola", color: "#8b5cf6", completedCheckpoints: [1], lastUpdate: new Date() }
];

const mockCheckpoints = [
  { id: 1, name: "Partenza" },
  { id: 2, name: "Prima Tappa" },
  { id: 3, name: "Seconda Tappa" },
  { id: 4, name: "Terza Tappa" },
  { id: 5, name: "Quarta Tappa" },
  { id: 6, name: "Arrivo" }
];

const mockGameState = { teams: mockTeams, checkpoints: mockCheckpoints };

export default function Classifica() {
  const sortedTeams = mockGameState.teams
    .sort((a: any, b: any) => b.completedCheckpoints.length - a.completedCheckpoints.length);

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}°`;
    }
  };

  const getProgressPercentage = (completedCheckpoints: number) => {
    return Math.round((completedCheckpoints / mockGameState.checkpoints.length) * 100);
  };

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
        {sortedTeams.map((team: any, index: number) => (
          <div 
            key={team.id} 
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-2xl font-bold text-gray-600 w-10">
                {getPositionIcon(index)}
              </div>
              
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: team.color }}
              ></div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-600">
                  {team.completedCheckpoints.length}/{mockGameState.checkpoints.length} checkpoint completati
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {getProgressPercentage(team.completedCheckpoints.length)}%
              </div>
              <div className="text-xs text-gray-500">
                Ultimo: {team.lastUpdate.toLocaleTimeString('it-IT')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Checkpoint di Gioco</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {mockGameState.checkpoints.map((checkpoint: any) => (
            <div key={checkpoint.id} className="flex items-center gap-2 text-sm">
              <span>🧢</span>
              <span className="text-gray-700">{checkpoint.name}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}