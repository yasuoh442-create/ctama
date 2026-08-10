import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Server, 
  Search, 
  Volume2, 
  VolumeX, 
  Zap, 
  RefreshCw,
  Sun,
  Moon,
  Building2
} from 'lucide-react';
import { Device, NetworkAlert } from '../types';

interface HeaderProps {
  devices: Device[];
  alerts: NetworkAlert[];
  pollingIntervalSec: number;
  setPollingIntervalSec: (val: number) => void;
  isPollingActive: boolean;
  setIsPollingActive: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenChaosModal: () => void;
  onTriggerManualRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  devices,
  alerts,
  pollingIntervalSec,
  setPollingIntervalSec,
  isPollingActive,
  setIsPollingActive,
  searchQuery,
  setSearchQuery,
  soundEnabled,
  setSoundEnabled,
  darkMode,
  setDarkMode,
  onOpenChaosModal,
  onTriggerManualRefresh,
  isRefreshing
}) => {
  const onlineCount = devices.filter(d => d.status === 'online').length;
  const warningCount = devices.filter(d => d.status === 'warning').length;
  const criticalCount = devices.filter(d => d.status === 'critical' || d.status === 'offline').length;
  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  const criticalAlertsCount = alerts.filter(a => !a.resolved && a.severity === 'critical').length;

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${
      darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Top Main Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-emerald-600 dark:text-emerald-400">
                NMS CTAMA
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/50">
                Supervision Réseau
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-emerald-500" />
              Caisse Tunisienne d'Assurance Mutuelle Agricole
            </p>
          </div>
        </div>

        {/* Global Live Counters */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <Server className="w-4 h-4 text-emerald-500" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Équipements</span>
              <span className="font-bold text-sm">{devices.length}</span>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">En Ligne</span>
              <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{onlineCount}</span>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Avertissements</span>
              <span className="font-bold text-sm text-amber-600 dark:text-amber-400">{warningCount}</span>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
            criticalCount > 0 ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/50' : darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <AlertTriangle className={`w-4 h-4 ${criticalCount > 0 ? 'text-rose-500 animate-bounce' : 'text-slate-400'}`} />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Alertes Actives</span>
              <span className={`font-bold text-sm ${activeAlertsCount > 0 ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                {activeAlertsCount} {criticalAlertsCount > 0 && `(${criticalAlertsCount} Critiques)`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Search & Controls */}
        <div className="flex items-center gap-2">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher IP, agence, équipement..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-48 sm:w-64 pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-all ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600 focus:bg-white'
              }`}
            />
          </div>

          {/* Manual Refresh */}
          <button
            onClick={onTriggerManualRefresh}
            disabled={isRefreshing}
            title="Rafraîchir maintenant (SNMP Walk / ICMP Ping)"
            className={`p-2 rounded-lg border transition-all ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' 
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>

          {/* Polling Interval Select */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <Activity className={`w-3.5 h-3.5 ${isPollingActive ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <select
              value={pollingIntervalSec}
              onChange={(e) => setPollingIntervalSec(Number(e.target.value))}
              className="bg-transparent font-medium outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value={2} className="dark:bg-slate-900">2 sec</option>
              <option value={5} className="dark:bg-slate-900">5 sec</option>
              <option value={10} className="dark:bg-slate-900">10 sec</option>
              <option value={0} className="dark:bg-slate-900">Pause</option>
            </select>
          </div>

          {/* Chaos Test Button */}
          <button
            onClick={onOpenChaosModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all shadow-sm"
            title="Simulateur d'incident réseau (Test d'Alerte CTAMA)"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden md:inline">Test Chaos</span>
          </button>

          {/* Sound Alert Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400' 
                : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
            }`}
            title={soundEnabled ? 'Avertisseur sonore activé' : 'Avertisseur sonore désactivé'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg border transition-all ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={darkMode ? 'Passer au mode clair' : 'Passer au mode sombre'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
