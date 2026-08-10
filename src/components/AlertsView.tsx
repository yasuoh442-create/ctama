import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Bell, 
  ShieldAlert, 
  Download, 
  UserCheck, 
  Clock, 
  Sliders,
  Check
} from 'lucide-react';
import { NetworkAlert, AlertSeverity } from '../types';

interface AlertsViewProps {
  alerts: NetworkAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  darkMode: boolean;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  darkMode
}) => {
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('active'); // active | resolved | all

  // Alert Thresholds Configurator State
  const [latencyThresholdMs, setLatencyThresholdMs] = useState(50);
  const [cpuThresholdPercent, setCpuThresholdPercent] = useState(80);
  const [packetLossThresholdPercent, setPacketLossThresholdPercent] = useState(3);

  const filteredAlerts = alerts.filter(a => {
    const matchesSeverity = selectedSeverityFilter === 'all' || a.severity === selectedSeverityFilter;
    const matchesStatus = 
      selectedStatusFilter === 'all' ? true :
      selectedStatusFilter === 'active' ? !a.resolved :
      a.resolved;

    return matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500 text-white animate-pulse">CRITIQUE</span>;
      case 'major':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500 text-slate-950">MAJEUR</span>;
      case 'minor':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-yellow-400 text-slate-900">MINEUR</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500 text-white">INFO</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = "ID,Device,IP,Agency,Severity,Message,Timestamp,Acknowledged,Resolved\n";
    const rows = filteredAlerts.map(a => 
      `"${a.id}","${a.deviceName}","${a.ip}","${a.agencyName}","${a.severity}","${a.message.replace(/"/g, '""')}","${a.timestamp}",${a.acknowledged},${a.resolved}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `journal_alertes_ctama_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Gestion des Alertes & Journal d'Événements Syslog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Journalisation centralisée des incidents réseau, basculements WAN et franchissements de seuils.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Download className="w-4 h-4 text-emerald-500" />
          <span>Exporter Journal CSV</span>
        </button>
      </div>

      {/* Grid: Alerts Table + Notification Rules Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Alerts List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
            darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Filtrer par :</span>
              
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className={`px-2.5 py-1 rounded-lg border text-xs outline-none ${
                  darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <option value="active">Incidents Actifs</option>
                <option value="resolved">Historique Résolu</option>
                <option value="all">Tous les Événements</option>
              </select>

              <select
                value={selectedSeverityFilter}
                onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                className={`px-2.5 py-1 rounded-lg border text-xs outline-none ${
                  darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <option value="all">Toutes les Sévérités</option>
                <option value="critical">Critique</option>
                <option value="major">Majeur</option>
                <option value="minor">Mineur</option>
                <option value="info">Information</option>
              </select>
            </div>

            <span className="text-slate-400 font-medium">
              {filteredAlerts.length} événement(s)
            </span>
          </div>

          {/* Alerts Feed */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border ${
                darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold">Aucune alerte dans cette catégorie</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Le réseau CTAMA fonctionne dans les normes de service définies.
                </p>
              </div>
            ) : (
              filteredAlerts.map((alt) => (
                <div 
                  key={alt.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alt.resolved 
                      ? darkMode ? 'bg-slate-900/40 border-slate-800 opacity-70' : 'bg-slate-50 border-slate-200 opacity-80'
                      : alt.severity === 'critical'
                        ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60'
                        : darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(alt.severity)}
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {alt.deviceName} ({alt.ip})
                        </span>
                        <span className="text-xs text-slate-400">&bull; {alt.agencyName}</span>
                      </div>

                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {alt.message}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {alt.timestamp}
                        </span>
                        {alt.acknowledged && (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <UserCheck className="w-3 h-3" /> Acquitté par {alt.acknowledgedBy || 'Ingénieur DSI'}
                          </span>
                        )}
                        {alt.resolved && (
                          <span className="text-emerald-600 font-semibold">
                            &bull; Résolu à {alt.resolvedAt}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      {!alt.acknowledged && !alt.resolved && (
                        <button
                          onClick={() => onAcknowledgeAlert(alt.id)}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        >
                          Acquitter
                        </button>
                      )}

                      {!alt.resolved && (
                        <button
                          onClick={() => onResolveAlert(alt.id)}
                          className="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          Clôturer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Configuration des Seuils d'Alerte */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
        }`}>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
            <Sliders className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-sm font-bold">Seuils Déclencheurs d'Alertes</h2>
              <span className="text-[10px] text-slate-400">Règles de supervision CTAMA</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Latence ICMP Maximale :</span>
                <span className="text-emerald-600 font-mono">{latencyThresholdMs} ms</span>
              </div>
              <input 
                type="range" 
                min={10} 
                max={200} 
                step={5}
                value={latencyThresholdMs}
                onChange={(e) => setLatencyThresholdMs(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Au-delà de {latencyThresholdMs} ms, déclenche une alerte "Latence Élevée".
              </span>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Charge Processeur (CPU) :</span>
                <span className="text-amber-600 font-mono">{cpuThresholdPercent}%</span>
              </div>
              <input 
                type="range" 
                min={50} 
                max={95} 
                step={5}
                value={cpuThresholdPercent}
                onChange={(e) => setCpuThresholdPercent(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Alerte si CPU &gt; {cpuThresholdPercent}% pendant plus de 5 min.
              </span>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Perte de Paquets Maximale :</span>
                <span className="text-rose-600 font-mono">{packetLossThresholdPercent}%</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={10} 
                step={1}
                value={packetLossThresholdPercent}
                onChange={(e) => setPacketLossThresholdPercent(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Canaux de Notification :</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                <span>Console NMS en direct (Popups)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                <span>Alerte Email DSI (dsi@ctama.tn)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                <span>SMS Gateway (Incidents Critiques)</span>
              </label>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
