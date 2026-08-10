import React, { useState } from 'react';
import { 
  Building2, 
  Wifi, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Activity, 
  Phone, 
  MapPin, 
  Zap,
  Radio,
  Search,
  Server,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  ExternalLink,
  UserCheck,
  Mail,
  HelpCircle
} from 'lucide-react';
import { Agency } from '../types';

interface AgenciesViewProps {
  agencies: Agency[];
  onTriggerFailover: (agencyId: string) => void;
  onNavigateToDiagnostics?: (ip: string) => void;
  darkMode: boolean;
}

export const AgenciesView: React.FC<AgenciesViewProps> = ({
  agencies,
  onTriggerFailover,
  onNavigateToDiagnostics,
  darkMode
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const regionsList = [
    { id: 'all', label: 'Toutes les structures' },
    { id: 'siege', label: 'Siège Central CTAMA' },
    { id: 'direct', label: 'Agences Réseau Direct' },
    { id: 'general', label: 'Agents Généraux' },
    { id: 'Tunis Nord', label: 'Tunis Nord' },
    { id: 'Tunis Sud', label: 'Tunis Sud' },
    { id: 'Cap Bon', label: 'Cap Bon' },
    { id: 'Béja', label: 'Béja' },
    { id: 'Jendouba', label: 'Jendouba' },
    { id: 'Le Kef & Siliana', label: 'Le Kef & Siliana' },
    { id: 'Centre 1 & 2', label: 'Centre 1 & 2' },
    { id: 'Sfax', label: 'Sfax' },
    { id: 'Sud Est', label: 'Sud Est' },
    { id: 'Sud Ouest', label: 'Sud Ouest' },
  ];

  const filteredAgencies = agencies.filter((ag) => {
    // Region / Category filter
    if (selectedRegion === 'siege') {
      if (!ag.name.toLowerCase().includes('siège') && !ag.name.toLowerCase().includes('economa') && !ag.name.toLowerCase().includes('expertise')) return false;
    } else if (selectedRegion === 'direct') {
      if (ag.isGeneralAgent) return false;
    } else if (selectedRegion === 'general') {
      if (!ag.isGeneralAgent) return false;
    } else if (selectedRegion !== 'all') {
      if (ag.region !== selectedRegion) return false;
    }

    // Search query
    if (searchFilter.trim() !== '') {
      const query = searchFilter.toLowerCase();
      const matchName = ag.name.toLowerCase().includes(query);
      const matchCity = ag.city.toLowerCase().includes(query);
      const matchPhone = ag.phone.includes(query);
      const matchIp = ag.fixedIp ? ag.fixedIp.includes(query) : false;
      const matchContact = ag.contactPerson.toLowerCase().includes(query);
      const matchEmail = ag.topnetEmail ? ag.topnetEmail.toLowerCase().includes(query) : false;
      const matchCode = ag.agencyCode ? String(ag.agencyCode).includes(query) : false;

      return matchName || matchCity || matchPhone || matchIp || matchContact || matchEmail || matchCode;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" />
            Supervision Réseau & Annuaire Officiel CTAMA Siège & Agences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adresses IP fixes Topnet, numéros de réclamation, téléphones directs, comptes ADSL & état des pare-feux.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>{agencies.length} Entités Référencées CTAMA</span>
        </div>
      </div>

      {/* Siège Social CTAMA Central Showcase Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-800/50 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-emerald-800/40 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wide">
                Siège Central - Direction Informatique
              </span>
              <span className="text-xs text-emerald-300 font-mono">Caisse Centrale de Réassurance (CTAMA)</span>
            </div>
            <h2 className="text-lg font-extrabold text-white">
              Assurance CTAMA Siège Central & Lignes Fibre Optique
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Avenue de la Liberté & Avenue Habib Thameur, Tunis 1002, Tunisie
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 block font-bold">Standard Siège</span>
              <span className="text-xs font-mono font-extrabold text-emerald-400">71.185.000 poste 1354</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-right">
              <span className="text-[10px] text-emerald-300 block font-bold">Ligne Réclamation Directe</span>
              <span className="text-xs font-mono font-extrabold text-white">71.111.040 / 98.323.188</span>
            </div>
          </div>
        </div>

        {/* High-speed Fibre Optique Grid */}
        <div>
          <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-400" />
            Liaisons Fibre Optique & IPs Fixes du Siège
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">FO 100MO Av. Liberté</span>
                <span className="text-xs font-mono font-bold text-emerald-400 block">41.226.25.26</span>
                <span className="text-[10px] text-slate-500 font-mono">Seq: 1760755</span>
              </div>
              {onNavigateToDiagnostics && (
                <button
                  onClick={() => onNavigateToDiagnostics('41.226.25.26')}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-[10px] font-bold flex items-center gap-1"
                  title="Tester cette IP dans l'outil de diagnostic"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Test</span>
                </button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">FO 100MO Habib Thameur</span>
                <span className="text-xs font-mono font-bold text-emerald-400 block">41.226.8.57</span>
                <span className="text-[10px] text-slate-500 font-mono">Seq: 442343</span>
              </div>
              {onNavigateToDiagnostics && (
                <button
                  onClick={() => onNavigateToDiagnostics('41.226.8.57')}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-[10px] font-bold flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Test</span>
                </button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">FO 20MO Belvédère</span>
                <span className="text-xs font-mono font-bold text-emerald-400 block">41.226.7.109</span>
                <span className="text-[10px] text-slate-500 font-mono">Seq: 2712147</span>
              </div>
              {onNavigateToDiagnostics && (
                <button
                  onClick={() => onNavigateToDiagnostics('41.226.7.109')}
                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-[10px] font-bold flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Test</span>
                </button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">FO 30MO Ass. Maladie</span>
                <span className="text-xs font-mono font-bold text-emerald-300 block">Fibre Dédiée</span>
                <span className="text-[10px] text-slate-500 font-mono">Seq: 3444245</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                Actif
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        
        {/* Search Input */}
        <div className={`p-3 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Rechercher par Nom, Ville, IP (41.230...), Téléphone, Login Topnet..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none border ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-slate-900 dark:text-slate-100">{filteredAgencies.length}</span> résultats affichés
          </div>
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {regionsList.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRegion === reg.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : darkMode
                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Agencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((ag) => (
          <div 
            key={ag.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              ag.mainLinkStatus === 'degraded'
                ? 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50'
                : darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {ag.agencyCode && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">
                        Code {ag.agencyCode}
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      {ag.region}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {ag.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{ag.address}</span>
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${
                  ag.slaPercent >= 99.5 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  SLA {ag.slaPercent}%
                </span>
              </div>

              {/* Specific Network Details */}
              <div className="py-3 space-y-2 text-xs">
                
                {/* Contact Manager */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="font-bold block text-[11px] text-slate-900 dark:text-slate-100">{ag.contactPerson}</span>
                      <span className="text-[10px] text-slate-400">Responsable / Agent</span>
                    </div>
                  </div>
                </div>

                {/* Phone & Réclamation */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="font-bold font-mono block text-[11px] text-slate-900 dark:text-slate-100">{ag.phone}</span>
                      <span className="text-[10px] text-slate-400">Tél. Direct</span>
                    </div>
                  </div>
                  {ag.reclamationPhone && (
                    <div className="text-right">
                      <span className="text-[10px] text-rose-500 font-bold block">Réclamations</span>
                      <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">{ag.reclamationPhone}</span>
                    </div>
                  )}
                </div>

                {/* Fixed IP & Topnet Email */}
                {ag.fixedIp && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                    <div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">Adresse IP Fixe Topnet</span>
                      <span className="font-mono font-extrabold text-xs text-slate-900 dark:text-slate-100">{ag.fixedIp}</span>
                      {ag.topnetEmail && (
                        <span className="text-[10px] font-mono text-slate-500 block">{ag.topnetEmail}</span>
                      )}
                    </div>

                    {onNavigateToDiagnostics && (
                      <button
                        onClick={() => onNavigateToDiagnostics(ag.fixedIp!.split('/')[0].trim())}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition-all"
                      >
                        <Terminal className="w-3 h-3" />
                        <span>Tester IP</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Firewall Status */}
                {ag.firewallStatus && (
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-[11px]">
                    <span className="text-slate-500 font-medium">Statut Firewall Réseau</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      ag.firewallStatus === 'O' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : ag.firewallStatus.includes('brulé') 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {ag.firewallStatus === 'O' ? 'Opérationnel (O)' : ag.firewallStatus}
                    </span>
                  </div>
                )}

                {/* Main & Backup Link Badges */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-[10px]">
                    <span className="text-slate-400 block">Liaison Principale</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ag.mainLinkType}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-[10px]">
                    <span className="text-slate-400 block">Liaison Secours</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ag.backupLinkType}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Failover Action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs mt-2">
              <span className="text-[11px] text-slate-500 font-medium">
                {ag.deviceCount} Équipements
              </span>

              <button
                onClick={() => onTriggerFailover(ag.id)}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>Basculement Secours</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
