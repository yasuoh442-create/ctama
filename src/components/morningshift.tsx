import React, { useState } from 'react';
import { 
  X, 
  Thermometer, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Activity, 
  Zap, 
  Clock, 
  UserCheck, 
  FileText, 
  Play, 
  RefreshCw, 
  Send, 
  Printer, 
  Flame,
  Check
} from 'lucide-react';
import { Device } from '../types';

interface MorningShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
  darkMode: boolean;
  onNavigateToTab?: (tab: string) => void;
}

export const MorningShiftModal: React.FC<MorningShiftModalProps> = ({
  isOpen,
  onClose,
  devices,
  darkMode,
  onNavigateToTab
}) => {
  const [isRunningCheck, setIsRunningCheck] = useState<boolean>(false);
  const [checkProgress, setCheckProgress] = useState<number>(0);
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>('Ingénieur Administrateur SI CTAMA');
  const [shiftNotes, setShiftNotes] = useState<string>('Prise de poste effectuée à 07:45. Climatisation Datacenter stable (20.2°C). BDD Oracle & AD Ok.');

  // Datacenter Environmental & HVAC State
  const hvacData = {
    tempRoomC: 20.2,
    tempTargetC: 19.5,
    tempStatus: 'optimal', // optimal, warning, critical
    humidityPercent: 46,
    humidityStatus: 'optimal',
    acUnit1Status: 'EN MARCHE (100%)',
    acUnit1Temp: 19.5,
    acUnit2Status: 'STANDBY REDONDANT',
    waterLeakStatus: 'AUCUNE FUITE (Sec)',
    upsPowerMode: 'SECTEUR ON-LINE (230V)',
    upsLoadPercent: 34,
    upsBatteryPercent: 100,
    upsBackupMins: 48,
    fireSystemStatus: 'ARMÉ & NORMAL (FM200)'
  };

  // List of Key Datacenter Servers to Validate
  const datacenterServers = devices.filter(d => d.ip.startsWith('172.20.0.'));

  // Checklist Items
  const [checklist, setChecklist] = useState([
    { id: 'hvac', label: 'Contrôle Climatisation & Température Salle Blanche (20.2°C)', done: true },
    { id: 'oracle', label: 'Vérification BDD Oracle Production (172.20.0.4 - SRV-DB-ORACLE)', done: true },
    { id: 'ad', label: 'Vérification Active Directory & DNS (172.20.0.2 & 172.20.0.16)', done: true },
    { id: 'sophos', label: 'Vérification Pare-Feu Sophos Gateway & VPN Agences (172.20.0.10)', done: true },
    { id: 'exchange', label: 'Contrôle Relais Mail & Lotus Notes (172.20.0.3 & 172.20.0.12)', done: true },
    { id: 'pointage', label: 'Contrôle Serveur Pointage RH & ZKAccess (172.20.0.25 & 172.20.0.34)', done: true },
    { id: 'vcenter', label: 'Hyperviseur VMware vCenter Cluster ESXi (172.20.0.110)', done: true }
  ]);

  const toggleCheckItem = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleRunFullRoutine = () => {
    setIsRunningCheck(true);
    setCheckProgress(0);
    setCheckCompleted(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setCheckProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsRunningCheck(false);
        setCheckCompleted(true);
        setChecklist(prev => prev.map(item => ({ ...item, done: true })));
      }
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  Session Matin IT CTAMA
                </span>
                <span className="text-xs text-emerald-300 font-mono">Prise de Poste SI Datacenter</span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                Routines de Prise de Poste du Matin & Climatisation Datacenter
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          
          {/* Admin Info Bar */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <UserCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Agent Administrateur en Poste</label>
                <input 
                  type="text" 
                  value={adminName} 
                  onChange={(e) => setAdminName(e.target.value)}
                  className={`font-bold text-xs bg-transparent border-b border-slate-400 focus:border-emerald-500 outline-none ${
                    darkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Horodatage : {new Date().toLocaleDateString('fr-FR')} - {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <button
                onClick={handleRunFullRoutine}
                disabled={isRunningCheck}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isRunningCheck ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Contrôle en cours ({checkProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lancer Diagnostic Matinal 1-Click</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 1: Datacenter Climatisation & Environment (HVAC) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-500" />
                Supervision Climatisation & Climat Salle Blanche Datacenter
              </h3>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Statut Climatisation : CONFORME (20.2°C)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Temperature Card */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Température Datacenter</span>
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                    <Thermometer className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-emerald-500">
                    {hvacData.tempRoomC}°C
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Consigne: {hvacData.tempTargetC}°C (Plage 18-22°C)
                  </p>
                </div>
              </div>

              {/* Humidity Card */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Hygrométrie Air</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Droplets className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-blue-500">
                    {hvacData.humidityPercent}% RH
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Plage Normale: 40% – 60%
                  </p>
                </div>
              </div>

              {/* AC Unit 1 */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Climatiseur Unité A</span>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <Wind className="w-4 h-4 animate-spin" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-emerald-500 font-mono">
                    {hvacData.acUnit1Status}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Consigne Soufflage: {hvacData.acUnit1Temp}°C
                  </p>
                </div>
              </div>

              {/* AC Unit 2 */}
              <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Climatiseur Unité B</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Wind className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-amber-500 font-mono">
                    {hvacData.acUnit2Status}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Basculement Auto activé
                  </p>
                </div>
              </div>

            </div>

            {/* Environmental Safety Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500">Détecteur Inondation / Fuite Eau :</span>
                <span className="font-bold text-emerald-500 font-mono">{hvacData.waterLeakStatus}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500">Onduleur Eaton 9PX Datacenter :</span>
                <span className="font-bold text-emerald-500 font-mono">{hvacData.upsPowerMode} ({hvacData.upsLoadPercent}% charge)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500">Protection Anti-Incendie :</span>
                <span className="font-bold text-emerald-500 font-mono">{hvacData.fireSystemStatus}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Datacenter Servers Status Grid (172.20.0.x) */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-500" />
              État des Serveurs Centraux du Siège CTAMA ({datacenterServers.length} Équipements)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {datacenterServers.map(srv => (
                <div 
                  key={srv.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-slate-100">{srv.name}</span>
                    <span className="font-mono text-[10px] text-emerald-500 font-bold">{srv.ip}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {srv.status === 'online' ? 'OPÉRATIONNEL' : srv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Morning Shift Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Checklist de Validation de Prise de Poste IT CTAMA
            </h3>

            <div className="space-y-2">
              {checklist.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheckItem(item.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    item.done
                      ? darkMode 
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : darkMode
                        ? 'bg-slate-800/40 border-slate-700 text-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      item.done ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-400'
                    }`}>
                      {item.done && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold font-mono">
                    {item.done ? 'VALIDÉ' : 'EN ATTENTE'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Shift Observations & Validation */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 block">Observations du Chef de Quart / Administrateur :</label>
            <textarea
              rows={2}
              value={shiftNotes}
              onChange={(e) => setShiftNotes(e.target.value)}
              className={`w-full p-3 rounded-xl border text-xs outline-none ${
                darkMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Success Banner if Completed */}
          {checkCompleted && (
            <div className="p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg animate-bounce">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Prise de poste matinale enregistrée et validée à 100% sans aucune anomalie !</span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-950 text-white text-[10px] uppercase tracking-wider">
                Attestation Générée
              </span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
          >
            Fermer
          </button>

          <div className="flex items-center gap-3">
            {onNavigateToTab && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTab('topology');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center gap-2"
              >
                <Server className="w-4 h-4 text-purple-400" />
                <span>Voir Carte Topologique Datacenter</span>
              </button>
            )}

            <button
              onClick={() => {
                alert(`Rapport de prise de poste validé par ${adminName}.\nTempérature Datacenter: 20.2°C (Conforme)\nServeurs Datacenter: Tous en ligne.`);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Signer & Valider la Prise de Poste</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
