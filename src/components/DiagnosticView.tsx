import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Send, 
  Play, 
  RefreshCw, 
  Activity, 
  Search, 
  Wifi, 
  CheckCircle2, 
  XCircle,
  Network
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PingResult, TracerouteHop } from '../types';

interface DiagnosticViewProps {
  initialTargetIp?: string;
  darkMode: boolean;
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({
  initialTargetIp = '10.10.0.1',
  darkMode
}) => {
  const [activeTab, setActiveTab] = useState<'ping' | 'traceroute' | 'snmp'>('ping');

  // Ping State
  const [targetIp, setTargetIp] = useState(initialTargetIp);

  useEffect(() => {
    if (initialTargetIp) {
      setTargetIp(initialTargetIp);
      setTracerouteTarget(initialTargetIp);
    }
  }, [initialTargetIp]);
  const [packetCount, setPacketCount] = useState(10);
  const [packetSize, setPacketSize] = useState(64);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<PingResult | null>({
    ip: '10.10.0.1',
    packetsSent: 10,
    packetsReceived: 10,
    packetLoss: 0,
    minTimeMs: 1.8,
    maxTimeMs: 3.4,
    avgTimeMs: 2.3,
    history: [
      { seq: 1, timeMs: 2.1, status: 'ok' },
      { seq: 2, timeMs: 1.8, status: 'ok' },
      { seq: 3, timeMs: 2.4, status: 'ok' },
      { seq: 4, timeMs: 3.4, status: 'ok' },
      { seq: 5, timeMs: 2.0, status: 'ok' },
      { seq: 6, timeMs: 2.2, status: 'ok' },
      { seq: 7, timeMs: 1.9, status: 'ok' },
      { seq: 8, timeMs: 2.5, status: 'ok' },
      { seq: 9, timeMs: 2.3, status: 'ok' },
      { seq: 10, timeMs: 2.1, status: 'ok' }
    ]
  });

  // Traceroute State
  const [tracerouteTarget, setTracerouteTarget] = useState('10.10.70.1');
  const [isTracing, setIsTracing] = useState(false);
  const [tracerouteHops, setTracerouteHops] = useState<TracerouteHop[]>([
    { hop: 1, ip: '10.10.0.254', hostname: 'ctama-fw-fortigate.local', timeMs: 1.2, status: 'ok', location: 'Siège Social Tunis (Passerelle)' },
    { hop: 2, ip: '10.10.0.2', hostname: 'ctama-sw-core.local', timeMs: 2.1, status: 'ok', location: 'Core Switch Data Center' },
    { hop: 3, ip: '196.203.12.1', hostname: 'pe-tunis-tt.tn', timeMs: 12.4, status: 'ok', location: 'Cœur de Réseau Tunisie Telecom' },
    { hop: 4, ip: '196.203.45.88', hostname: 'pe-sfax-tt.tn', timeMs: 38.2, status: 'ok', location: 'Nœud Régional Sfax TT' },
    { hop: 5, ip: '10.10.70.1', hostname: 'CTAMA-SFAX-RTR-01', timeMs: 44.1, status: 'ok', location: 'Routeur Agence Régionale Sfax' }
  ]);

  // SNMP State
  const [selectedOid, setSelectedOid] = useState('.1.3.6.1.2.1.1.1.0');
  const [snmpCommunity, setSnmpCommunity] = useState('ctama-read-v3');
  const [snmpQueryResult, setSnmpQueryResult] = useState<string>(
    'SNMPv3-MIB::sysDescr.0 = STRING: Cisco ASR 1001-X Router, IOS XE Software, Version 17.03.04. Compiled Mon 18-Jan-21 14:22 by prod_rel_team'
  );

  const handleStartPing = () => {
    setIsPinging(true);
    setPingResult(null);

    const history: { seq: number; timeMs: number; status: 'ok' | 'timeout' }[] = [];
    let seq = 1;

    const interval = setInterval(() => {
      const isLoss = Math.random() < 0.05;
      const timeMs = isLoss ? 0 : Number((Math.random() * 12 + (targetIp.includes('70') ? 45 : 2)).toFixed(1));
      
      history.push({
        seq,
        timeMs,
        status: isLoss ? 'timeout' : 'ok'
      });

      seq++;

      if (seq > packetCount) {
        clearInterval(interval);
        setIsPinging(false);

        const okPackets = history.filter(h => h.status === 'ok');
        const packetLoss = Number((((packetCount - okPackets.length) / packetCount) * 100).toFixed(1));
        const times = okPackets.map(h => h.timeMs);
        const minTimeMs = times.length ? Math.min(...times) : 0;
        const maxTimeMs = times.length ? Math.max(...times) : 0;
        const avgTimeMs = times.length ? Number((times.reduce((a, b) => a + b, 0) / times.length).toFixed(1)) : 0;

        setPingResult({
          ip: targetIp,
          packetsSent: packetCount,
          packetsReceived: okPackets.length,
          packetLoss,
          minTimeMs,
          maxTimeMs,
          avgTimeMs,
          history
        });
      }
    }, 200);
  };

  const handleStartTraceroute = () => {
    setIsTracing(true);
    setTimeout(() => {
      setIsTracing(false);
    }, 1500);
  };

  const handleQuerySnmp = () => {
    if (selectedOid === '.1.3.6.1.2.1.1.1.0') {
      setSnmpQueryResult('SNMPv3-MIB::sysDescr.0 = STRING: Cisco ASR 1001-X Router, IOS XE Software, Version 17.03.04.');
    } else if (selectedOid === '.1.3.6.1.2.1.1.3.0') {
      setSnmpQueryResult('DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (15897600) 184 days, 00:00:00.00');
    } else if (selectedOid === '.1.3.6.1.2.1.2.2.1.10') {
      setSnmpQueryResult('IF-MIB::ifInOctets.1 = Counter32: 8492049102 Bytes (8.49 GB received)');
    } else {
      setSnmpQueryResult(`SNMPv3-MIB::OID ${selectedOid} = STRING: "Valeur OID CTAMA Valide"`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-500" />
            Boîte à Outils de Diagnostic Réseau CTAMA
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Outils interactifs de test de connectivité ICMP, cheminement Traceroute et requêtes SNMP.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ping')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ping' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Ping ICMP
          </button>
          <button
            onClick={() => setActiveTab('traceroute')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'traceroute' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Traceroute
          </button>
          <button
            onClick={() => setActiveTab('snmp')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'snmp' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            SNMP Walk
          </button>
        </div>
      </div>

      {/* Tab Content 1: Ping */}
      {activeTab === 'ping' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls Form */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
          }`}>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Paramètres du Ping ICMP
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Cible IP ou Nom d'hôte</label>
                <input 
                  type="text" 
                  value={targetIp}
                  onChange={(e) => setTargetIp(e.target.value)}
                  placeholder="ex: 10.10.0.1 ou 10.10.70.1"
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Nombre de paquets</label>
                <select
                  value={packetCount}
                  onChange={(e) => setPacketCount(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value={4}>4 Paquets (Test Rapide)</option>
                  <option value={10}>10 Paquets (Standard)</option>
                  <option value={20}>20 Paquets (Analyse Approfondie)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Taille du paquet (Bytes)</label>
                <select
                  value={packetSize}
                  onChange={(e) => setPacketSize(Number(e.target.value))}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value={64}>64 Bytes (Standard)</option>
                  <option value={512}>512 Bytes (Charge moyenne)</option>
                  <option value={1472}>1472 Bytes (Plein MTU 1500)</option>
                </select>
              </div>

              <button
                onClick={handleStartPing}
                disabled={isPinging}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isPinging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPinging ? 'Ping en cours...' : 'Lancer le Ping ICMP'}</span>
              </button>
            </div>
          </div>

          {/* Results Output (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Terminal Window */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs space-y-2 shadow-xl min-h-[220px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-500">
                <span>Console Terminal ICMP CTAMA</span>
                <span>PING {targetIp} ({packetSize} bytes)</span>
              </div>

              {isPinging && (
                <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Envoi des paquets ICMP Echo-Request...</span>
                </div>
              )}

              {pingResult && (
                <div className="space-y-1">
                  {pingResult.history.map((h) => (
                    <div key={h.seq} className="flex items-center justify-between text-[11px]">
                      <span>
                        {h.status === 'ok' 
                          ? `${packetSize} bytes from ${pingResult.ip}: icmp_seq=${h.seq} ttl=64 time=${h.timeMs} ms`
                          : `Request timeout for icmp_seq ${h.seq}`
                        }
                      </span>
                      <span className={h.status === 'ok' ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                        {h.status === 'ok' ? 'REPLY OK' : 'TIMEOUT'}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-slate-800 text-slate-300 text-[11px] space-y-1">
                    <div>--- Statistique Ping {pingResult.ip} ---</div>
                    <div>
                      {pingResult.packetsSent} packets transmitted, {pingResult.packetsReceived} received, {pingResult.packetLoss}% packet loss
                    </div>
                    <div>
                      rtt min/avg/max = {pingResult.minTimeMs}/{pingResult.avgTimeMs}/{pingResult.maxTimeMs} ms
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sequence Chart */}
            {pingResult && pingResult.history.length > 0 && (
              <div className={`p-4 rounded-2xl border ${
                darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h3 className="text-xs font-bold mb-2">Graphique de la Latence par Séquence (ms)</h3>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pingResult.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="seq" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={10} />
                      <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={10} />
                      <Tooltip />
                      <Line type="monotone" dataKey="timeMs" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Tab Content 2: Traceroute */}
      {activeTab === 'traceroute' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <input 
              type="text" 
              value={tracerouteTarget}
              onChange={(e) => setTracerouteTarget(e.target.value)}
              placeholder="10.10.70.1 (Agence Sfax)"
              className={`px-3 py-2 rounded-xl border text-xs font-mono outline-none w-64 ${
                darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            />
            <button
              onClick={handleStartTraceroute}
              disabled={isTracing}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              {isTracing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Lancer Traceroute</span>
            </button>
          </div>

          <div className="space-y-2">
            {tracerouteHops.map((hop) => (
              <div 
                key={hop.hop}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                    {hop.hop}
                  </span>
                  <div>
                    <span className="font-bold block font-mono text-slate-900 dark:text-slate-100">
                      {hop.ip} ({hop.hostname})
                    </span>
                    <span className="text-[10px] text-slate-500">{hop.location}</span>
                  </div>
                </div>

                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {hop.timeMs} ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: SNMP Walk */}
      {activeTab === 'snmp' && (
        <div className={`p-5 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
        }`}>
          <h2 className="text-sm font-bold">Explorateur OID SNMP v2c / v3 CTAMA</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold mb-1">Sélectionner OID à Interroger</label>
              <select
                value={selectedOid}
                onChange={(e) => setSelectedOid(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value=".1.3.6.1.2.1.1.1.0">.1.3.6.1.2.1.1.1.0 (sysDescr)</option>
                <option value=".1.3.6.1.2.1.1.3.0">.1.3.6.1.2.1.1.3.0 (sysUpTime)</option>
                <option value=".1.3.6.1.2.1.2.2.1.10">.1.3.6.1.2.1.2.2.1.10 (ifInOctets)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Communauté / User SNMP</label>
              <input 
                type="text" 
                value={snmpCommunity}
                onChange={(e) => setSnmpCommunity(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleQuerySnmp}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Exécuter SNMP GET
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs">
            {snmpQueryResult}
          </div>
        </div>
      )}

    </div>
  );
};
