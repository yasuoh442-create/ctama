import React from 'react';
import { 
  Zap, 
  AlertTriangle, 
  WifiOff, 
  Cpu, 
  BatteryCharging, 
  RotateCcw, 
  X,
  CheckCircle2
} from 'lucide-react';

interface ChaosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerLinkCut: () => void;
  onTriggerCpuSpike: () => void;
  onTriggerPowerFailure: () => void;
  onRestoreAll: () => void;
  darkMode: boolean;
}

export const ChaosModal: React.FC<ChaosModalProps> = ({
  isOpen,
  onClose,
  onTriggerLinkCut,
  onTriggerCpuSpike,
  onTriggerPowerFailure,
  onRestoreAll,
  darkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-current" />
            Simulateur d'Incidents Réseau (Test NMS)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Injectez des perturbations réelles sur l'infrastructure CTAMA pour tester la réactivité de l'alerte en temps réel, du basculement automatique et de la journalisation.
        </p>

        <div className="space-y-2.5 text-xs">
          
          {/* Action 1: Link Cut */}
          <button
            onClick={() => {
              onTriggerLinkCut();
              onClose();
            }}
            className="w-full p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-left flex items-center gap-3 transition-all"
          >
            <div className="p-2 rounded-lg bg-rose-500 text-white shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-rose-800 dark:text-rose-300 block">Coupure Fibre Optique Agence Sfax</span>
              <span className="text-[10px] text-slate-500">Déclenche alerte critique et basculement automatique sur liaison 4G secours</span>
            </div>
          </button>

          {/* Action 2: CPU Spike */}
          <button
            onClick={() => {
              onTriggerCpuSpike();
              onClose();
            }}
            className="w-full p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-left flex items-center gap-3 transition-all"
          >
            <div className="p-2 rounded-lg bg-amber-500 text-slate-950 shrink-0 font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-800 dark:text-amber-300 block">Surcharge CPU Serveur Oracle (92%)</span>
              <span className="text-[10px] text-slate-500">Simule une requete bloquante sur la base de données des sinistres</span>
            </div>
          </button>

          {/* Action 3: Restore All */}
          <button
            onClick={() => {
              onRestoreAll();
              onClose();
            }}
            className="w-full p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-left flex items-center gap-3 transition-all"
          >
            <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Rétablir Tout le Réseau CTAMA</span>
              <span className="text-[10px] text-slate-500">Réinitialise tous les équipements et résout automatiquement les alertes</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
