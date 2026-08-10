import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Server, 
  AlertTriangle, 
  Activity, 
  Building2, 
  Terminal, 
  FileText,
  ChevronRight
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'topology' 
  | 'devices' 
  | 'alerts' 
  | 'traffic' 
  | 'agencies' 
  | 'diagnostics' 
  | 'reports';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  unacknowledgedAlertsCount: number;
  darkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  unacknowledgedAlertsCount,
  darkMode
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'topology',
      label: 'Carte Topologique',
      icon: <Network className="w-4 h-4" />
    },
    {
      id: 'devices',
      label: 'Équipements & IP',
      icon: <Server className="w-4 h-4" />
    },
    {
      id: 'alerts',
      label: 'Alertes & Syslog',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: unacknowledgedAlertsCount
    },
    {
      id: 'traffic',
      label: 'Trafic NetFlow',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'agencies',
      label: 'Agences & SLA',
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'diagnostics',
      label: 'Diagnostic Ping/SNMP',
      icon: <Terminal className="w-4 h-4" />
    },
    {
      id: 'reports',
      label: 'Rapports CTAMA',
      icon: <FileText className="w-4 h-4" />
    }
  ];

  return (
    <aside className={`w-full md:w-60 shrink-0 border-r transition-colors ${
      darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-50/80 border-slate-200'
    }`}>
      <div className="p-3">
        <div className="px-3 py-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Supervision CTAMA
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                    : darkMode
                      ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 ? (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive
                      ? 'bg-white text-emerald-800'
                      : 'bg-rose-500 text-white animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom System Banner */}
        <div className={`mt-8 p-3 rounded-xl border text-xs ${
          darkMode ? 'bg-slate-800/50 border-slate-700/60 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            NMS Active Engine
          </div>
          <p className="text-[11px] leading-relaxed">
            Supervision libre OpenSource v2.4 - Module SNMP v3 & ICMP Polling actif.
          </p>
        </div>
      </div>
    </aside>
  );
};
