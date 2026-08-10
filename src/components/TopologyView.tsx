import React, { useState } from 'react';
import { 
  Network, 
  Server, 
  ShieldCheck, 
  Wifi, 
  Terminal, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Zap, 
  Info,
  Search,
  Filter,
  Building2,
  Cpu,
  X
} from 'lucide-react';
import { Device, TopologyNode, TopologyLink } from '../types';

interface TopologyViewProps {
  devices: Device[];
  nodes: TopologyNode[];
  links: TopologyLink[];
  darkMode: boolean;
  onNavigateToDiagnostics: (ip: string) => void;
}

export const TopologyView: React.FC<TopologyViewProps> = ({
  devices,
  nodes,
  links,
  darkMode,
  onNavigateToDiagnostics
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-172-oracle');
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNodes = nodes.filter(n => {
    // Filter by Category
    if (filterCategory === 'datacenter') {
      if (!n.ip.startsWith('172.20.0.') && n.id !== 'node-core-sw' && n.id !== 'node-as400') return false;
    } else if (filterCategory === 'security') {
      if (n.type !== 'firewall' && n.type !== 'cloud') return false;
    } else if (filterCategory === 'agencies') {
      if (n.type !== 'router' || n.ip.startsWith('172.20.0.')) return false;
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchLabel = n.label.toLowerCase().includes(q);
      const matchIp = n.ip.includes(q);
      return matchLabel || matchIp;
    }

    return true;
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const matchedDevice = selectedNode ? devices.find(d => d.ip === selectedNode.ip) : null;
  const selectedLink = links.find(l => l.id === selectedLinkId);

  const getNodeColor = (status: TopologyNode['status']) => {
    switch (status) {
      case 'online': return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
      case 'warning': return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'critical':
      case 'offline': return 'text-rose-400 bg-rose-950/60 border-rose-800';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getLinkColor = (status: TopologyLink['status']) => {
    switch (status) {
      case 'optimal': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'down': return '#EF4444';
      default: return '#64748B';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className={`p-4 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-500" />
            Carte Topologique Réseau CTAMA & Datacenter 172.20.0.x
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cartographie interactive des serveurs du Siège Central (172.20.0.x), Pare-feux Sophos/FortiGate & Liaisons Agences.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>En ligne / Opérationnel</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Lien Secours / Warning</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Perturbation / Alerte</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-thin">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : darkMode ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Tous les Équipements ({nodes.length})
          </button>
          <button
            onClick={() => setFilterCategory('datacenter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterCategory === 'datacenter'
                ? 'bg-emerald-600 text-white shadow-sm'
                : darkMode ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span>Datacenter Siège 172.20.0.x</span>
          </button>
          <button
            onClick={() => setFilterCategory('security')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterCategory === 'security'
                ? 'bg-emerald-600 text-white shadow-sm'
                : darkMode ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pare-feux & Sécurité</span>
          </button>
          <button
            onClick={() => setFilterCategory('agencies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterCategory === 'agencies'
                ? 'bg-emerald-600 text-white shadow-sm'
                : darkMode ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Agences Régionales</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Chercher IP ou Nom..."
            className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border outline-none ${
              darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Main Canvas + Side Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Topology Map Canvas (2 cols) */}
        <div className={`lg:col-span-2 relative h-[620px] rounded-2xl border overflow-hidden transition-all ${
          darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 text-slate-100 border-slate-800 shadow-xl'
        }`}>
          {/* Subtle Grid Pattern Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          {/* SVG Canvas for Links */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {links.map((link) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              // Check if either source or target is hidden by filters
              const isSourceVisible = filteredNodes.some(n => n.id === sourceNode.id);
              const isTargetVisible = filteredNodes.some(n => n.id === targetNode.id);
              if (!isSourceVisible || !isTargetVisible) return null;

              const isSelected = selectedLinkId === link.id;
              const linkColor = getLinkColor(link.status);

              return (
                <g key={link.id} className="pointer-events-auto cursor-pointer" onClick={() => setSelectedLinkId(link.id)}>
                  <line
                    x1={`${sourceNode.x}%`}
                    y1={`${sourceNode.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={linkColor}
                    strokeWidth={isSelected ? 3.5 : 1.5}
                    strokeDasharray={link.status === 'warning' ? '6 4' : 'none'}
                    className="transition-all hover:stroke-emerald-400"
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes Positioning */}
          <div className="absolute inset-0 p-4">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const colorClass = getNodeColor(node.status);

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    setSelectedLinkId(null);
                  }}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 group ${
                    isSelected ? 'z-30' : 'z-10'
                  }`}
                >
                  <div className={`relative px-2 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${
                    isSelected 
                      ? 'bg-emerald-950/95 border-emerald-400 shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400' 
                      : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500'
                  }`}>
                    {/* Pulsing Aura if selected or warning */}
                    {node.status !== 'online' && (
                      <div className="absolute -inset-1 rounded-xl bg-amber-500/20 animate-ping pointer-events-none" />
                    )}

                    {/* Node Icon */}
                    <div className={`p-1.5 rounded-lg border ${colorClass}`}>
                      {node.type === 'cloud' && <Globe className="w-3.5 h-3.5 text-blue-400" />}
                      {node.type === 'firewall' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      {node.type === 'switch' && <Network className="w-3.5 h-3.5 text-indigo-400" />}
                      {node.type === 'server' && <Server className="w-3.5 h-3.5 text-purple-400" />}
                      {node.type === 'ups' && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                      {node.type === 'router' && <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold text-white whitespace-nowrap leading-tight">
                        {node.label}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 font-semibold leading-none mt-0.5">
                        {node.ip}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Affiche {filteredNodes.length} serveurs & nœuds actifs sur la carte.</span>
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
        }`}>
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h3 className="text-sm font-bold">{selectedNode.label}</h3>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedNode.ip}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  selectedNode.status === 'online' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedNode.status.toUpperCase()}
                </span>
              </div>

              {matchedDevice ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Modèle</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{matchedDevice.model}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Constructeur</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{matchedDevice.vendor}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Charge Processeur (CPU)</span>
                        <span className="font-bold">{matchedDevice.cpuUsagePercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${matchedDevice.cpuUsagePercent > 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${matchedDevice.cpuUsagePercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Utilisation Mémoire RAM</span>
                        <span className="font-bold">{matchedDevice.memoryUsagePercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${matchedDevice.memoryUsagePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Adresse MAC :</span>
                      <span className="font-mono font-bold">{matchedDevice.mac}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Ping Latence ICMP :</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{matchedDevice.responseTimeMs} ms</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Protocole Polling :</span>
                      <span className="font-bold">{matchedDevice.protocol}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Uptime Continu :</span>
                      <span className="font-bold">{matchedDevice.uptimeDays} Jours</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Site / Agence :</span>
                      <span className="font-bold">{matchedDevice.agencyName}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateToDiagnostics(matchedDevice.ip)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Terminal className="w-4 h-4" />
                      Lancer Test Diagnostic sur {matchedDevice.ip}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 space-y-2">
                  <p>Équipement Réseau Central ou Passerelle WAN.</p>
                  <button
                    onClick={() => onNavigateToDiagnostics(selectedNode.ip)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Terminal className="w-4 h-4" />
                    Diagnostiquer {selectedNode.ip}
                  </button>
                </div>
              )}
            </div>
          ) : selectedLink ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold">Inspecteur de Liaison Réseau</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedLink.status === 'optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedLink.status.toUpperCase()}
                </span>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedLink.label}</p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Vitesse Maximale :</span>
                  <span className="font-bold">{selectedLink.speedMbps} Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Débit Actuel :</span>
                  <span className="font-bold text-emerald-600">{selectedLink.currentMbps} Mbps</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Sélectionnez un équipement sur la carte pour afficher ses caractéristiques SNMP.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
