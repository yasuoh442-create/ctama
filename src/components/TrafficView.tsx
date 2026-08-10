import React from 'react';
import { 
  Activity, 
  PieChart as PieIcon, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe, 
  Database, 
  Lock, 
  Phone, 
  HardDrive
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { NetworkTrafficApp, TopTalker } from '../types';

interface TrafficViewProps {
  trafficApps: NetworkTrafficApp[];
  topTalkers: TopTalker[];
  darkMode: boolean;
}

export const TrafficView: React.FC<TrafficViewProps> = ({
  trafficApps,
  topTalkers,
  darkMode
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Analyse de Trafic NetFlow & sFlow (Supervision Bande Passante)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Répartition applicative du débit réseau et identification des équipements consommateurs (Top Talkers).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <span>NetFlow v9 Collector : Actif</span>
        </div>
      </div>

      {/* Grid: Pie Chart + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart: Application Distribution */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-500" />
              Répartition du Trafic par Application
            </h2>
            <span className="text-xs text-slate-400 font-medium">Bande Passante (Mbps)</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficApps}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="bandwidthMbps"
                  nameKey="name"
                >
                  {trafficApps.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#cbd5e1',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    color: darkMode ? '#f8fafc' : '#0f172a'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
            {trafficApps.map((app, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: app.color }} />
                <div className="truncate">
                  <span className="font-semibold block truncate">{app.name}</span>
                  <span className="text-[10px] text-slate-400">{app.bandwidthMbps} Mbps ({app.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Bandwidth by Application */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Consommation Instantanée (Mbps)
            </h2>
            <span className="text-xs text-slate-400 font-medium">NetFlow Peak</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficApps} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={10} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#cbd5e1',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    color: darkMode ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Bar dataKey="bandwidthMbps" name="Débit (Mbps)" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Talkers Table */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
      }`}>
        <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          Top 5 Équipements Générateurs de Trafic (Top Talkers NetFlow)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-bold uppercase tracking-wider text-[10px] ${
                darkMode ? 'bg-slate-900/60 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="p-3">Hôte / Adresse IP</th>
                <th className="p-3">Site / Agence</th>
                <th className="p-3">Volume Envoyer (MB)</th>
                <th className="p-3">Volume Reçu (MB)</th>
                <th className="p-3">Connexions Actives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
              {topTalkers.map((talker, idx) => (
                <tr key={idx} className={darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}>
                  <td className="p-3 font-bold">
                    <span>{talker.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{talker.ip}</span>
                  </td>

                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    {talker.agency}
                  </td>

                  <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {talker.bytesSentMB.toLocaleString()} MB
                  </td>

                  <td className="p-3 font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {talker.bytesReceivedMB.toLocaleString()} MB
                  </td>

                  <td className="p-3 font-bold">
                    {talker.activeConnections} sockets
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
