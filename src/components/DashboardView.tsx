import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Database, 
  Globe, 
  Lock, 
  Mail, 
  ShieldAlert,
  Server,
  Zap,
  Clock,
  Radio,
  Thermometer,
  Wind,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Device, NetworkAlert, ServiceStatus, MetricHistoryPoint } from '../types';

interface DashboardViewProps {
  devices: Device[];
  alerts: NetworkAlert[];
  services: ServiceStatus[];
  metricHistory: MetricHistoryPoint[];
  onAcknowledgeAlert: (alertId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenMorningShiftModal?: () => void;
  darkMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  devices,
  alerts,
  services,
  metricHistory,
  onAcknowledgeAlert,
  onNavigateToTab,
  onOpenMorningShiftModal,
  darkMode
}) => {
  const activeAlerts = alerts.filter(a => !a.resolved);
  const totalBandwidthIn = devices.reduce((sum, d) => sum + d.bandwidthUsageMbps, 0);
  const avgLatency = Math.round(
    devices.reduce((sum, d) => sum + d.responseTimeMs, 0) / (devices.length || 1)
  );
  
  const onlineDevicesCount = devices.filter(d => d.status === 'online').length;
  const overallAvailabilityPercent = Number(
    ((onlineDevicesCount / (devices.length || 1)) * 100).toFixed(2)
  );

  const getServiceIcon = (type: ServiceStatus['type']) => {
    switch (type) {
      case 'database': return <Database className="w-4 h-4 text-emerald-500" />;
      case 'web': return <Globe className="w-4 h-4 text-blue-500" />;
      case 'vpn': return <Lock className="w-4 h-4 text-amber-500" />;
      case 'mail': return <Mail className="w-4 h-4 text-purple-500" />;
      case 'auth': return <ShieldAlert className="w-4 h-4 text-indigo-500" />;
      default: return <Server className="w-4 h-4 text-slate-500" />;
    }
  };

  const getSeverityBadge = (severity: NetworkAlert['severity']) => {
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

  return (
    <div className="space-y-6">
      
      {/* Top Banner Message */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-emerald-50/70 border-emerald-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Supervision Réseau en Temps Réel - CTAMA Siège & Agences
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              12 Agences interconnectées via VPN IPsec & Fibre Optique. Monitoring ICMP, SNMP v3 et NetFlow.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {onOpenMorningShiftModal && (
            <button
              onClick={onOpenMorningShiftModal}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-md flex items-center gap-2 border border-slate-700"
            >
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>Prise de Poste Matin (20°C)</span>
            </button>
          )}

          <button
            onClick={() => onNavigateToTab('topology')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Voir Carte Réseau</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Admin Morning Routine & HVAC Quick Check Widget */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        darkMode ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/60 border-slate-700' : 'bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white shadow-md'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
            <Thermometer className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase">
                Prise de Poste IT Matinale
              </span>
              <span className="text-xs font-mono text-emerald-300 font-semibold">Datacenter 172.20.0.x</span>
            </div>
            <h2 className="text-sm font-bold text-white mt-0.5">
              Climatisation Datacenter: 20.2°C (Conforme) | Hygrométrie: 46% RH | Climatiseur A: En Marche
            </h2>
          </div>
        </div>

        <button
          onClick={onOpenMorningShiftModal}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <UserCheck className="w-4 h-4" />
          <span>Effectuer la Vérification du Matin</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Disponibilité Réseau */}
        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Taux de Disponibilité</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {overallAvailabilityPercent}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +0.02%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallAvailabilityPercent}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {onlineDevicesCount} / {devices.length} Équipements opérationnels
          </div>
        </div>

        {/* Card 2: Bande Passante Globale */}
        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Trafic Global Actif</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {totalBandwidthIn} <span className="text-sm font-bold text-slate-500">Mbps</span>
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> Peak
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalBandwidthIn / 1200) * 100)}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Capacité max WAN Siège : 1000 Mbps Fibre TT
          </div>
        </div>

        {/* Card 3: Latence Moyenne ICMP */}
        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Latence Moyenne ICMP</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {avgLatency} <span className="text-sm font-bold text-slate-500">ms</span>
            </span>
            <span className={`text-xs font-semibold flex items-center ${
              avgLatency < 25 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {avgLatency < 25 ? 'Excellent' : 'Modéré'}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                avgLatency < 25 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (avgLatency / 100) * 100)}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Seuil d'alerte configuré : 50 ms
          </div>
        </div>

        {/* Card 4: Alertes Actives */}
        <div className={`p-4 rounded-2xl border transition-all ${
          activeAlerts.length > 0 
            ? 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50' 
            : darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Incidents Non Résolus</span>
            <AlertTriangle className={`w-4 h-4 ${activeAlerts.length > 0 ? 'text-rose-500 animate-bounce' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${activeAlerts.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {activeAlerts.length}
            </span>
            <span className="text-xs text-slate-500">
              alertes
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('alerts')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              Traiter les alertes &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Traffic Graph + Service Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart: Live Bandwidth & Latency Trend */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Évolution du Trafic WAN & Latence ICMP (24h)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Débit sortant / entrant cumulé des agences CTAMA en Mbps
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Trafic Entrant
              </span>
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Trafic Sortant
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="time" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={11} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={11} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#cbd5e1',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    color: darkMode ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Area type="monotone" dataKey="bandwidthInMbps" name="Débit Entrant (Mbps)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="bandwidthOutMbps" name="Débit Sortant (Mbps)" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Services Critiques CTAMA */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Services Métiers CTAMA
            </h2>
            <span className="text-xs text-slate-500 font-medium">SLA Core</span>
          </div>

          <div className="space-y-3">
            {services.map((srv) => (
              <div 
                key={srv.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  srv.status === 'degraded' 
                    ? 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50' 
                    : srv.status === 'down'
                      ? 'bg-rose-50/60 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50'
                      : darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
                    {getServiceIcon(srv.type)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {srv.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[170px]">
                      {srv.targetHost}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                    srv.status === 'healthy' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {srv.status === 'healthy' ? 'OK' : 'DÉGRADÉ'}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                    {srv.responseTimeMs} ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Alerts Stream & Top Loaded Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Alerts Panel */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Alertes Réseau Récentes
            </h2>
            <button
              onClick={() => onNavigateToTab('alerts')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Voir Tout ({alerts.length})
            </button>
          </div>

          <div className="space-y-3">
            {activeAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-dashed rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold">Aucun incident actif sur le réseau CTAMA</p>
              </div>
            ) : (
              activeAlerts.slice(0, 4).map((alt) => (
                <div 
                  key={alt.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    darkMode ? 'bg-slate-900/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alt.severity)}
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {alt.deviceName} ({alt.ip})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {alt.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      {alt.agencyName} &bull; {alt.timestamp}
                    </span>
                  </div>

                  {!alt.acknowledged && (
                    <button
                      onClick={() => onAcknowledgeAlert(alt.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-sm"
                    >
                      Acquitter
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top High Response / Latency Devices */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-500" />
              Top Équipements à Surveiller
            </h2>
            <button
              onClick={() => onNavigateToTab('devices')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Inventaire ({devices.length})
            </button>
          </div>

          <div className="space-y-3">
            {[...devices]
              .sort((a, b) => b.responseTimeMs - a.responseTimeMs)
              .slice(0, 4)
              .map((dev) => (
                <div 
                  key={dev.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    darkMode ? 'bg-slate-900/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {dev.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                        {dev.ip}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {dev.agencyName} &bull; {dev.model}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-bold ${
                      dev.responseTimeMs > 40 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {dev.responseTimeMs} ms Ping
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      CPU: {dev.cpuUsagePercent}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

    </div>
  );
};
