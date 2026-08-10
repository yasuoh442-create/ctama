import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TopologyView } from './components/TopologyView';
import { DevicesView } from './components/DevicesView';
import { AlertsView } from './components/AlertsView';
import { TrafficView } from './components/TrafficView';
import { AgenciesView } from './components/AgenciesView';
import { DiagnosticView } from './components/DiagnosticView';
import { ReportsView } from './components/ReportsView';
import { ChaosModal } from './components/ChaosModal';
import { MorningShiftModal } from './components/morningshift';

import { 
  Device, 
  Agency, 
  NetworkAlert, 
  ServiceStatus, 
  NetworkTrafficApp, 
  TopTalker, 
  MetricHistoryPoint, 
  TopologyNode, 
  TopologyLink 
} from './types';

import { 
  INITIAL_DEVICES, 
  INITIAL_AGENCIES, 
  INITIAL_ALERTS, 
  INITIAL_SERVICES, 
  INITIAL_TRAFFIC_APPS, 
  INITIAL_TOP_TALKERS, 
  MOCK_METRIC_HISTORY, 
  INITIAL_TOPOLOGY_NODES, 
  INITIAL_TOPOLOGY_LINKS 
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Polling State
  const [pollingIntervalSec, setPollingIntervalSec] = useState<number>(5);
  const [isPollingActive, setIsPollingActive] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Data States
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [agencies, setAgencies] = useState<Agency[]>(INITIAL_AGENCIES);
  const [alerts, setAlerts] = useState<NetworkAlert[]>(INITIAL_ALERTS);
  const [services, setServices] = useState<ServiceStatus[]>(INITIAL_SERVICES);
  const [trafficApps, setTrafficApps] = useState<NetworkTrafficApp[]>(INITIAL_TRAFFIC_APPS);
  const [topTalkers, setTopTalkers] = useState<TopTalker[]>(INITIAL_TOP_TALKERS);
  const [metricHistory, setMetricHistory] = useState<MetricHistoryPoint[]>(MOCK_METRIC_HISTORY);
  const [nodes, setNodes] = useState<TopologyNode[]>(INITIAL_TOPOLOGY_NODES);
  const [links, setLinks] = useState<TopologyLink[]>(INITIAL_TOPOLOGY_LINKS);

  // Diagnostic Target Navigation State
  const [diagnosticTargetIp, setDiagnosticTargetIp] = useState<string>('10.10.0.1');

  // Smart Auto-Resolve State
  const [isSmartAutoResolveEnabled, setIsSmartAutoResolveEnabled] = useState<boolean>(true);
  const [autoResolvedCount, setAutoResolvedCount] = useState<number>(0);

  // Chaos Modal State
  const [isChaosModalOpen, setIsChaosModalOpen] = useState<boolean>(false);

  // Morning Shift & Climatisation Modal State
  const [isMorningShiftModalOpen, setIsMorningShiftModalOpen] = useState<boolean>(false);

  const isHeartbeatNormal = (dev: Device): boolean => {
    if (dev.status === 'offline' || dev.status === 'critical') return false;
    if (dev.responseTimeMs > 50) return false;
    if (dev.cpuUsagePercent > 80) return false;
    if (dev.packetLossPercent > 2) return false;
    return true;
  };

  const runAutoResolveCheck = (currentDevices: Device[]) => {
    setAlerts(prev => {
      let newlyResolved = 0;
      const nextAlerts = prev.map(a => {
        if (a.resolved) return a;
        const dev = currentDevices.find(d => d.id === a.deviceId || d.ip === a.ip);
        if (dev && (dev.consecutiveNormalPolls || 0) >= 3) {
          newlyResolved++;
          return {
            ...a,
            resolved: true,
            resolvedAt: new Date().toLocaleTimeString('fr-FR'),
            resolvedBy: 'Smart Auto-Resolve',
            autoResolved: true
          };
        }
        return a;
      });

      if (newlyResolved > 0) {
        setAutoResolvedCount(c => c + newlyResolved);
      }
      return nextAlerts;
    });
  };

  const playAlertTone = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Ignore user gesture constraints if audio is restricted
    }
  };

  // Live Polling Engine Effect
  useEffect(() => {
    if (!isPollingActive || pollingIntervalSec <= 0) return;

    const timer = setInterval(() => {
      // Fluctuate device response times & CPU slightly and compute consecutive normal polls
      setDevices(prev => {
        const nextDevices = prev.map(d => {
          if (d.status === 'offline') {
            return { ...d, consecutiveNormalPolls: 0 };
          }
          const deltaPing = Math.floor(Math.random() * 5) - 2;
          const newPing = Math.max(1, d.responseTimeMs + deltaPing);

          const deltaCpu = Math.floor(Math.random() * 7) - 3;
          const newCpu = Math.min(98, Math.max(5, d.cpuUsagePercent + deltaCpu));

          const updatedDev: Device = {
            ...d,
            responseTimeMs: newPing,
            cpuUsagePercent: newCpu,
            lastPoll: 'À l\'instant'
          };

          const isNormal = isHeartbeatNormal(updatedDev);
          const pollsCount = isNormal ? (d.consecutiveNormalPolls || 0) + 1 : 0;

          return {
            ...updatedDev,
            consecutiveNormalPolls: pollsCount
          };
        });

        if (isSmartAutoResolveEnabled) {
          runAutoResolveCheck(nextDevices);
        }

        return nextDevices;
      });

      // Add a metric history point
      setMetricHistory(prev => {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const lastPoint = prev[prev.length - 1] || { bandwidthInMbps: 450, bandwidthOutMbps: 220, avgLatencyMs: 18, cpuLoadPercent: 40, packetLossPercent: 0.2 };
        const newIn = Math.min(950, Math.max(200, lastPoint.bandwidthInMbps + Math.floor(Math.random() * 40 - 20)));
        const newOut = Math.min(600, Math.max(100, lastPoint.bandwidthOutMbps + Math.floor(Math.random() * 20 - 10)));

        const newHistory = [...prev.slice(1), {
          time: timeStr,
          bandwidthInMbps: newIn,
          bandwidthOutMbps: newOut,
          avgLatencyMs: Math.floor(Math.random() * 6 + 14),
          cpuLoadPercent: Math.floor(Math.random() * 10 + 35),
          packetLossPercent: 0.1
        }];

        return newHistory;
      });

    }, pollingIntervalSec * 1000);

    return () => clearInterval(timer);
  }, [isPollingActive, pollingIntervalSec, isSmartAutoResolveEnabled]);

  // Handlers
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true, acknowledgedBy: 'Ingénieur DSI CTAMA' } : a));
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true, resolvedAt: new Date().toLocaleTimeString('fr-FR') } : a));
  };

  const handleAddDevice = (newDevData: Omit<Device, 'id'>) => {
    const newId = 'dev-' + String(devices.length + 1).padStart(3, '0');
    const newDevice: Device = {
      ...newDevData,
      id: newId
    };
    setDevices(prev => [newDevice, ...prev]);
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const handleNavigateToDiagnostics = (ip: string) => {
    setDiagnosticTargetIp(ip);
    setCurrentTab('diagnostics');
  };

  const handleTriggerManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Chaos Trigger Handlers
  const handleTriggerLinkCut = () => {
    playAlertTone();

    // Degrade Sfax Link
    setAgencies(prev => prev.map(a => a.id === 'ag-sfax' ? { ...a, mainLinkStatus: 'degraded', backupLinkStatus: 'active' } : a));
    
    // Update Sfax router
    setDevices(prev => prev.map(d => d.id === 'dev-007' ? { ...d, status: 'critical', responseTimeMs: 145, packetLossPercent: 12 } : d));

    // Update Topology node & link
    setNodes(prev => prev.map(n => n.id === 'node-sfax' ? { ...n, status: 'critical' } : n));
    setLinks(prev => prev.map(l => l.id === 'link-6' ? { ...l, status: 'down' } : l));

    // Add critical alert
    const newAlert: NetworkAlert = {
      id: 'alt-' + Date.now(),
      deviceId: 'dev-007',
      deviceName: 'CTAMA-SFAX-RTR-01',
      agencyName: 'Agence Régionale Sfax',
      ip: '10.10.70.1',
      severity: 'critical',
      message: 'CHAOS TEST : Coupure totale de la liaison Fibre Optique principale. Basculement d\'urgence sur liaison 4G secours.',
      timestamp: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR'),
      acknowledged: false,
      resolved: false,
      category: 'link_down'
    };

    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleTriggerCpuSpike = () => {
    playAlertTone();

    setDevices(prev => prev.map(d => d.id === 'dev-005' ? { ...d, cpuUsagePercent: 96, memoryUsagePercent: 94, status: 'warning' } : d));

    const newAlert: NetworkAlert = {
      id: 'alt-' + Date.now(),
      deviceId: 'dev-005',
      deviceName: 'CTAMA-SRV-ORACLE-DB',
      agencyName: 'Siège Social - Tunis',
      ip: '10.10.10.20',
      severity: 'major',
      message: 'CHAOS TEST : Charge CPU critique (96%) sur la base de données Oracle RAC.',
      timestamp: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR'),
      acknowledged: false,
      resolved: false,
      category: 'cpu'
    };

    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleRestoreAll = () => {
    setDevices(INITIAL_DEVICES);
    setAgencies(INITIAL_AGENCIES);
    setAlerts(prev => prev.map(a => ({ ...a, resolved: true, resolvedAt: new Date().toLocaleTimeString('fr-FR') })));
    setNodes(INITIAL_TOPOLOGY_NODES);
    setLinks(INITIAL_TOPOLOGY_LINKS);
  };

  const handleTriggerFailover = (agencyId: string) => {
    playAlertTone();
    setAgencies(prev => prev.map(a => {
      if (a.id === agencyId) {
        const isDegraded = a.mainLinkStatus === 'degraded';
        return {
          ...a,
          mainLinkStatus: isDegraded ? 'active' : 'degraded',
          backupLinkStatus: isDegraded ? 'standby' : 'active'
        };
      }
      return a;
    }));
  };

  const unacknowledgedAlertsCount = alerts.filter(a => !a.acknowledged && !a.resolved).length;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Top Header */}
      <Header 
        devices={devices}
        alerts={alerts}
        pollingIntervalSec={pollingIntervalSec}
        setPollingIntervalSec={setPollingIntervalSec}
        isPollingActive={isPollingActive}
        setIsPollingActive={setIsPollingActive}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenChaosModal={() => setIsChaosModalOpen(true)}
        onOpenMorningShiftModal={() => setIsMorningShiftModalOpen(true)}
        onTriggerManualRefresh={handleTriggerManualRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Layout (Sidebar + Content View) */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <Sidebar 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          unacknowledgedAlertsCount={unacknowledgedAlertsCount}
          darkMode={darkMode}
        />

        {/* Content View */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto overflow-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView 
              devices={devices}
              alerts={alerts}
              services={services}
              metricHistory={metricHistory}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onNavigateToTab={setCurrentTab}
              onOpenMorningShiftModal={() => setIsMorningShiftModalOpen(true)}
              darkMode={darkMode}
            />
          )}

          {currentTab === 'topology' && (
            <TopologyView 
              devices={devices}
              nodes={nodes}
              links={links}
              darkMode={darkMode}
              onNavigateToDiagnostics={handleNavigateToDiagnostics}
            />
          )}

          {currentTab === 'devices' && (
            <DevicesView 
              devices={devices}
              agencies={agencies}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddDevice={handleAddDevice}
              onDeleteDevice={handleDeleteDevice}
              onNavigateToDiagnostics={handleNavigateToDiagnostics}
              darkMode={darkMode}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsView 
              alerts={alerts}
              devices={devices}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onResolveAlert={handleResolveAlert}
              isSmartAutoResolveEnabled={isSmartAutoResolveEnabled}
              onToggleSmartAutoResolve={setIsSmartAutoResolveEnabled}
              autoResolvedCount={autoResolvedCount}
              onRunAutoResolve={() => runAutoResolveCheck(devices)}
              darkMode={darkMode}
            />
          )}

          {currentTab === 'traffic' && (
            <TrafficView 
              trafficApps={trafficApps}
              topTalkers={topTalkers}
              darkMode={darkMode}
            />
          )}

          {currentTab === 'agencies' && (
            <AgenciesView 
              agencies={agencies}
              onTriggerFailover={handleTriggerFailover}
              onNavigateToDiagnostics={handleNavigateToDiagnostics}
              darkMode={darkMode}
            />
          )}

          {currentTab === 'diagnostics' && (
            <DiagnosticView 
              initialTargetIp={diagnosticTargetIp}
              darkMode={darkMode}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView 
              devices={devices}
              alerts={alerts}
              agencies={agencies}
              darkMode={darkMode}
            />
          )}
        </main>
      </div>

      {/* Chaos Simulator Modal */}
      <ChaosModal 
        isOpen={isChaosModalOpen}
        onClose={() => setIsChaosModalOpen(false)}
        onTriggerLinkCut={handleTriggerLinkCut}
        onTriggerCpuSpike={handleTriggerCpuSpike}
        onTriggerPowerFailure={handleTriggerCpuSpike}
        onRestoreAll={handleRestoreAll}
        darkMode={darkMode}
      />

      {/* Admin Morning Shift & Datacenter Climatisation Modal */}
      <MorningShiftModal
        isOpen={isMorningShiftModalOpen}
        onClose={() => setIsMorningShiftModalOpen(false)}
        devices={devices}
        darkMode={darkMode}
        onNavigateToTab={(tab) => setCurrentTab(tab as NavTab)}
      />

    </div>
  );
}
