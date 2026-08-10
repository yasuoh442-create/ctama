import React, { useState } from 'react';
import { 
  Server, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Terminal, 
  Edit3, 
  Trash2, 
  Radio, 
  Building2, 
  ShieldCheck, 
  Scan,
  X
} from 'lucide-react';
import { Device, DeviceType, ProtocolType } from '../types';

interface DevicesViewProps {
  devices: Device[];
  agencies: { id: string; name: string }[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onAddDevice: (newDev: Omit<Device, 'id'>) => void;
  onDeleteDevice: (id: string) => void;
  onNavigateToDiagnostics: (ip: string) => void;
  darkMode: boolean;
}

export const DevicesView: React.FC<DevicesViewProps> = ({
  devices,
  agencies,
  searchQuery,
  setSearchQuery,
  onAddDevice,
  onDeleteDevice,
  onNavigateToDiagnostics,
  darkMode
}) => {
  const [selectedAgencyFilter, setSelectedAgencyFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [subnetToScan, setSubnetToScan] = useState('10.10.10.0/24');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResults, setScannedResults] = useState<{ ip: string; status: 'active' | 'inactive'; hostname: string; mac: string }[]>([]);

  // Add Device Form State
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceIp, setNewDeviceIp] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<DeviceType>('router');
  const [newDeviceAgencyId, setNewDeviceAgencyId] = useState(agencies[0]?.id || 'ag-siege');
  const [newDeviceModel, setNewDeviceModel] = useState('Cisco Catalyst 2960X');
  const [newDeviceVendor, setNewDeviceVendor] = useState('Cisco');
  const [newDeviceProtocol, setNewDeviceProtocol] = useState<ProtocolType>('SNMP v2c');

  const filteredDevices = devices.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ip.includes(searchQuery) ||
      d.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAgency = selectedAgencyFilter === 'all' || d.agencyId === selectedAgencyFilter;
    const matchesType = selectedTypeFilter === 'all' || d.type === selectedTypeFilter;
    const matchesStatus = selectedStatusFilter === 'all' || d.status === selectedStatusFilter;

    return matchesSearch && matchesAgency && matchesType && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName || !newDeviceIp) return;

    const agencyObj = agencies.find(a => a.id === newDeviceAgencyId);

    onAddDevice({
      name: newDeviceName,
      ip: newDeviceIp,
      mac: '00:1B:17:8A:' + Math.floor(Math.random() * 89 + 10) + ':01',
      type: newDeviceType,
      agencyId: newDeviceAgencyId,
      agencyName: agencyObj ? agencyObj.name : 'Siège Social - Tunis',
      model: newDeviceModel,
      vendor: newDeviceVendor,
      protocol: newDeviceProtocol,
      status: 'online',
      responseTimeMs: Math.floor(Math.random() * 15 + 2),
      packetLossPercent: 0,
      cpuUsagePercent: Math.floor(Math.random() * 30 + 10),
      memoryUsagePercent: Math.floor(Math.random() * 40 + 20),
      bandwidthUsageMbps: Math.floor(Math.random() * 50 + 5),
      maxBandwidthMbps: 1000,
      uptimeDays: 1,
      lastPoll: 'À l\'instant',
      snmpCommunity: 'ctama-read'
    });

    setIsAddModalOpen(false);
    setNewDeviceName('');
    setNewDeviceIp('');
  };

  const handleStartSubnetScan = () => {
    setIsScanning(true);
    setScannedResults([]);

    setTimeout(() => {
      setScannedResults([
        { ip: '10.10.10.1', status: 'active', hostname: 'CTAMA-GW-GATEWAY', mac: '00:1B:17:8A:22:01' },
        { ip: '10.10.10.15', status: 'active', hostname: 'CTAMA-SRV-AS400-PROD', mac: '02:00:4C:4F:00:15' },
        { ip: '10.10.10.20', status: 'active', hostname: 'CTAMA-SRV-ORACLE-DB', mac: '00:50:56:9A:12:34' },
        { ip: '10.10.10.45', status: 'active', hostname: 'CTAMA-PRINTER-HP-DSI', mac: '00:04:96:3B:12:45' },
        { ip: '10.10.10.88', status: 'inactive', hostname: 'Probing...', mac: '-' },
        { ip: '10.10.10.100', status: 'active', hostname: 'CTAMA-UPS-EATON-9PX', mac: '00:0E:00:54:12:A9' }
      ]);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            Inventaire Général des Équipements Réseau CTAMA
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Routeurs, Switches, Serveurs, Pare-feux et Onduleurs des 12 Agences CTAMA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScannerModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <Scan className="w-4 h-4 text-emerald-500" />
            <span>Scanner Sous-Réseau</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Équipement</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          {/* Agency Filter */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={selectedAgencyFilter}
              onChange={(e) => setSelectedAgencyFilter(e.target.value)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">Toutes les Agences CTAMA</option>
              {agencies.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">Tous les Types</option>
              <option value="router">Routeurs</option>
              <option value="switch">Switches</option>
              <option value="firewall">Pare-feux</option>
              <option value="server">Serveurs</option>
              <option value="ups">Onduleurs</option>
              <option value="ip_phone">Téléphonie IP</option>
              <option value="camera">Caméras</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value="all">Tous les Statuts</option>
              <option value="online">En Ligne</option>
              <option value="warning">Avertissement</option>
              <option value="critical">Critique / Offline</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          {filteredDevices.length} Équipements affichés
        </div>
      </div>

      {/* Main Table */}
      <div className={`rounded-2xl border overflow-hidden transition-all ${
        darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-bold uppercase tracking-wider text-[10px] ${
                darkMode ? 'bg-slate-900/60 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <th className="p-3.5">Nom & IP</th>
                <th className="p-3.5">Agence / Site</th>
                <th className="p-3.5">Modèle / Marque</th>
                <th className="p-3.5">Protocole</th>
                <th className="p-3.5">Statut</th>
                <th className="p-3.5">Ping (ms)</th>
                <th className="p-3.5">CPU / RAM</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
              {filteredDevices.map((dev) => (
                <tr 
                  key={dev.id}
                  className={`transition-colors ${
                    darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      {dev.name}
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 block pl-4">
                      {dev.ip}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">
                      {dev.agencyName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      MAC: {dev.mac}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">
                      {dev.model}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {dev.vendor}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-semibold">
                      {dev.protocol}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                      dev.status === 'online' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {dev.status === 'online' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {dev.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono font-bold">
                    <span className={dev.responseTimeMs > 40 ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400'}>
                      {dev.responseTimeMs} ms
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="space-y-1 w-24 text-[10px]">
                      <div className="flex justify-between text-slate-500">
                        <span>CPU</span>
                        <span className="font-bold">{dev.cpuUsagePercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${dev.cpuUsagePercent}%` }} />
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onNavigateToDiagnostics(dev.ip)}
                        title="Ping & Diagnostic"
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        <Terminal className="w-4 h-4 text-emerald-500" />
                      </button>

                      <button
                        onClick={() => onDeleteDevice(dev.id)}
                        title="Supprimer équipement"
                        className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Ajouter un Équipement */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Ajouter un Équipement à la Supervision
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Nom de l'Équipement (ex: CTAMA-NABEUL-SW-01)</label>
                <input 
                  type="text" 
                  required
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="CTAMA-AGENCE-ROUTER"
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Adresse IP (ex: 10.10.30.1)</label>
                  <input 
                    type="text" 
                    required
                    value={newDeviceIp}
                    onChange={(e) => setNewDeviceIp(e.target.value)}
                    placeholder="10.10.x.x"
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Agence CTAMA</label>
                  <select
                    value={newDeviceAgencyId}
                    onChange={(e) => setNewDeviceAgencyId(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {agencies.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Type d'Équipement</label>
                  <select
                    value={newDeviceType}
                    onChange={(e) => setNewDeviceType(e.target.value as DeviceType)}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="router">Routeur</option>
                    <option value="switch">Switch</option>
                    <option value="firewall">Pare-feu</option>
                    <option value="server">Serveur</option>
                    <option value="ups">Onduleur</option>
                    <option value="ip_phone">Téléphonie IP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Protocole Supervision</label>
                  <select
                    value={newDeviceProtocol}
                    onChange={(e) => setNewDeviceProtocol(e.target.value as ProtocolType)}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="SNMP v2c">SNMP v2c</option>
                    <option value="SNMP v3">SNMP v3</option>
                    <option value="ICMP Ping">ICMP Ping</option>
                    <option value="Modbus IP">Modbus IP</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Ajouter à l'Inventaire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Scanner un Sous-Réseau */}
      {isScannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Scan className="w-5 h-5 text-emerald-500" />
                Découverte Réseau Automatique (Subnet Scan)
              </h3>
              <button onClick={() => setIsScannerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Plage d'adresses IP / CIDR à balayer</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={subnetToScan}
                    onChange={(e) => setSubnetToScan(e.target.value)}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-mono outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <button
                    onClick={handleStartSubnetScan}
                    disabled={isScanning}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
                  >
                    {isScanning && <RefreshCw className="w-4 h-4 animate-spin" />}
                    <span>Lancer Scan</span>
                  </button>
                </div>
              </div>

              {/* Scan Results */}
              {scannedResults.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="font-bold block text-slate-500">
                    Équipements Répondeurs Détectés ({scannedResults.filter(r => r.status === 'active').length}) :
                  </span>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 border rounded-xl p-2 bg-slate-950 text-slate-200 font-mono text-[11px]">
                    {scannedResults.map((r, idx) => (
                      <div key={idx} className="flex justify-between p-1.5 rounded hover:bg-slate-800">
                        <span>{r.ip} &bull; {r.hostname}</span>
                        <span className={r.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}>
                          {r.status === 'active' ? 'ICMP OK' : 'No Reply'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
