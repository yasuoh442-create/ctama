import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Clock, 
  Server,
  FileSpreadsheet
} from 'lucide-react';
import { Device, NetworkAlert, Agency } from '../types';

interface ReportsViewProps {
  devices: Device[];
  alerts: NetworkAlert[];
  agencies: Agency[];
  darkMode: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  devices,
  alerts,
  agencies,
  darkMode
}) => {
  const [reportType, setReportType] = useState<'monthly' | 'inventory' | 'incidents'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState('Août 2026');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            Générateur de Rapports & Audits DSI CTAMA
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rapports de performance réseau imprimables pour la Direction Générale et la DSI CTAMA.
          </p>
        </div>

        <button
          onClick={() => setIsPreviewOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Générer Aperçu Imprimable</span>
        </button>
      </div>

      {/* Options Panel */}
      <div className={`p-5 rounded-2xl border grid grid-cols-1 md:grid-cols-3 gap-4 ${
        darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
      }`}>
        <div>
          <label className="block text-xs font-bold mb-1">Type de Rapport</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
              darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <option value="monthly">Rapport Mensuel de Disponibilité Réseau</option>
            <option value="incidents">Journal Bilan des Incidents & Alertes</option>
            <option value="inventory">Inventaire Complet du Parc Réseau</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Période d'Audit</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
              darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <option value="Août 2026">Août 2026 (Mois en cours)</option>
            <option value="Juillet 2026">Juillet 2026</option>
            <option value="Juin 2026">Juin 2026</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Consulter le Document</span>
          </button>
        </div>
      </div>

      {/* Printable Preview Container */}
      {isPreviewOpen && (
        <div className="p-8 rounded-2xl bg-white border border-slate-300 text-slate-900 space-y-6 shadow-2xl printable-area max-w-4xl mx-auto">
          
          {/* Document Header */}
          <div className="flex items-center justify-between border-b pb-4 border-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xl">
                CTAMA
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-emerald-800">
                  Caisse Tunisienne d'Assurance Mutuelle Agricole
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Direction des Systèmes d'Information (DSI) - Division Supervision Réseau NMS
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div className="font-bold text-slate-900">Rapport NMS-2026-08</div>
              <div>Date : {new Date().toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <h1 className="text-base font-extrabold text-emerald-900 uppercase">
              {reportType === 'monthly' && `Rapport Mensuel de Performance & Disponibilité Réseau (${selectedMonth})`}
              {reportType === 'incidents' && `Bilan des Incidents & Alertes Réseau (${selectedMonth})`}
              {reportType === 'inventory' && `Inventaire Général des Équipements de Réseau & Sécurité`}
            </h1>
          </div>

          {/* Summary Executive KPIs */}
          <div className="grid grid-cols-3 gap-4 text-xs text-slate-800">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Taux Global de Service</span>
              <span className="text-xl font-black text-emerald-600">99.92%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Équipements</span>
              <span className="text-xl font-black text-slate-900">{devices.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Agences Régionales</span>
              <span className="text-xl font-black text-slate-900">{agencies.length}</span>
            </div>
          </div>

          {/* Table Details */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase text-slate-700 border-b pb-1">
              Synthèse de Disponibilité des Agences CTAMA
            </h3>

            <table className="w-full text-left text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2 border-r border-slate-200">Agence / Site</th>
                  <th className="p-2 border-r border-slate-200">Liaison Principale</th>
                  <th className="p-2 border-r border-slate-200">Liaison Secours</th>
                  <th className="p-2">SLA Atteint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {agencies.map((ag) => (
                  <tr key={ag.id}>
                    <td className="p-2 border-r border-slate-200 font-bold">{ag.name}</td>
                    <td className="p-2 border-r border-slate-200">{ag.mainLinkType}</td>
                    <td className="p-2 border-r border-slate-200">{ag.backupLinkType}</td>
                    <td className="p-2 font-bold text-emerald-700">{ag.slaPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 text-xs font-bold text-slate-700 border-t border-slate-200">
            <div>
              <span>Le Responsable Réseau DSI :</span>
              <div className="h-12 mt-2 italic text-slate-400 font-normal">[ Signature numérique NMS ]</div>
            </div>
            <div className="text-right">
              <span>Validation Directeur DSI CTAMA :</span>
              <div className="h-12 mt-2 italic text-slate-400 font-normal">[ Approuvé ]</div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Exporter PDF</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
