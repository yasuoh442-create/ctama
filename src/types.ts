export type DeviceStatus = 'online' | 'warning' | 'critical' | 'offline' | 'maintenance';

export type DeviceType = 
  | 'router' 
  | 'switch' 
  | 'firewall' 
  | 'server' 
  | 'ip_phone' 
  | 'ups' 
  | 'camera' 
  | 'access_point';

export type ProtocolType = 'SNMP v2c' | 'SNMP v3' | 'ICMP Ping' | 'Syslog' | 'Modbus IP' | 'SSH' | 'HTTPS' | 'IPMI';

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: DeviceType;
  agencyId: string;
  agencyName: string;
  model: string;
  vendor: string;
  protocol: ProtocolType;
  status: DeviceStatus;
  responseTimeMs: number;
  packetLossPercent: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  bandwidthUsageMbps: number;
  maxBandwidthMbps: number;
  uptimeDays: number;
  lastPoll: string;
  consecutiveNormalPolls?: number;
  snmpCommunity?: string;
  locationDetails?: string;
  notes?: string;
}

export interface Agency {
  id: string;
  agencyCode?: number | string;
  name: string;
  region: 'Tunis & Banlieue' | 'Nord' | 'Sahel & Cap Bon' | 'Centre & Sud' | 'Tunis Nord' | 'Tunis Sud' | 'Cap Bon' | 'Béja' | 'Jendouba' | 'Le Kef & Siliana' | 'Centre 1 & 2' | 'Sfax' | 'Sud Est' | 'Sud Ouest' | 'Agents Généraux';
  city: string;
  address: string;
  mainLinkType: 'Fibre Optique TT' | 'Fibre Ooredoo' | 'Fibre Orange' | 'ADSL Topnet';
  backupLinkType: 'Fibre Ooredoo' | 'Fibre Orange' | '4G LTE Pro' | 'VSAT' | 'Liaison Louée' | 'ADSL Secours';
  mainLinkStatus: 'active' | 'degraded' | 'down';
  backupLinkStatus: 'standby' | 'active' | 'down';
  bandwidthCapacityMbps: number;
  currentBandwidthMbps: number;
  deviceCount: number;
  slaPercent: number;
  contactPerson: string;
  phone: string;
  reclamationPhone?: string;
  fixedIp?: string;
  topnetEmail?: string;
  adslAccount?: string;
  adslPassword?: string;
  firewallStatus?: string;
  fibreOptiqueSeq?: string;
  isGeneralAgent?: boolean;
  coordinates: { x: number; y: number }; // percentage on map
}

export type AlertSeverity = 'critical' | 'major' | 'minor' | 'info';

export interface NetworkAlert {
  id: string;
  deviceId: string;
  deviceName: string;
  agencyName: string;
  ip: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  autoResolved?: boolean;
  category: 'ping' | 'bandwidth' | 'cpu' | 'link_down' | 'security' | 'ups_power';
}

export interface ServiceStatus {
  id: string;
  name: string;
  description: string;
  type: 'database' | 'web' | 'vpn' | 'mail' | 'auth' | 'backup';
  status: 'healthy' | 'degraded' | 'down';
  uptimePercent: number;
  responseTimeMs: number;
  lastChecked: string;
  targetHost: string;
}

export interface NetworkTrafficApp {
  name: string;
  category: string;
  bandwidthMbps: number;
  percentage: number;
  color: string;
}

export interface TopTalker {
  ip: string;
  name: string;
  agency: string;
  bytesSentMB: number;
  bytesReceivedMB: number;
  activeConnections: number;
}

export interface MetricHistoryPoint {
  time: string;
  bandwidthInMbps: number;
  bandwidthOutMbps: number;
  avgLatencyMs: number;
  cpuLoadPercent: number;
  packetLossPercent: number;
}

export interface TopologyNode {
  id: string;
  label: string;
  type: DeviceType | 'hub' | 'cloud' | 'agency';
  ip: string;
  status: DeviceStatus;
  x: number; // percentage
  y: number; // percentage
  agencyId: string;
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  status: 'optimal' | 'warning' | 'down';
  speedMbps: number;
  currentMbps: number;
  label: string;
}

export interface PingResult {
  ip: string;
  packetsSent: number;
  packetsReceived: number;
  packetLoss: number;
  minTimeMs: number;
  maxTimeMs: number;
  avgTimeMs: number;
  history: { seq: number; timeMs: number; status: 'ok' | 'timeout' }[];
}

export interface TracerouteHop {
  hop: number;
  ip: string;
  hostname: string;
  timeMs: number;
  status: 'ok' | 'timeout';
  location: string;
}
