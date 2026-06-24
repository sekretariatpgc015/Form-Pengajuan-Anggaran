import React, { useState } from 'react';
import { NumberingSettings } from '../types';
import { generateProposalNumber } from '../utils/numbering';
import { Settings, RefreshCw, Check, Info } from 'lucide-react';

interface Props {
  settings: NumberingSettings;
  onSaveSettings: (newSettings: NumberingSettings) => Promise<void>;
  currentBidang: string;
}

export default function NumberingSettingsComponent({ settings, onSaveSettings, currentBidang }: Props) {
  const [pattern, setPattern] = useState(settings.formatPattern);
  const [seq, setSeq] = useState(settings.nextSequence);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const previewNumber = generateProposalNumber(
    pattern,
    seq,
    currentBidang || 'Bidang',
    new Date().toISOString()
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    try {
      await onSaveSettings({
        formatPattern: pattern,
        nextSequence: Number(seq)
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm" id="settings-panel">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
          <Settings className="w-5 h-5" id="settings-icon" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase" id="settings-title">Format Penomoran Otomatis</h3>
          <p className="text-xs text-slate-400 mt-0.5">Sesuaikan pola nomor surat anggaran dinamis administrasi RW 015</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide" htmlFor="pattern-input">
              Pola Format Penomoran
            </label>
            <input
              id="pattern-input"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500"
              placeholder="e.g. [SEQ] / RAB / [BIDANG] / [ROMAN_MONTH] / [YEAR]"
              required
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              <span className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-2 py-1 rounded cursor-pointer border border-slate-200 transition-colors" title="Nomor urut otomatis" onClick={() => setPattern(p => p + ' [SEQ]')}>[SEQ]</span>
              <span className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-2 py-1 rounded cursor-pointer border border-slate-200 transition-colors" title="Bidang terpilih" onClick={() => setPattern(p => p + ' [BIDANG]')}>[BIDANG]</span>
              <span className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-2 py-1 rounded cursor-pointer border border-slate-200 transition-colors" title="Bulan Romawi saat ini" onClick={() => setPattern(p => p + ' [ROMAN_MONTH]')}>[ROMAN_MONTH]</span>
              <span className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-2 py-1 rounded cursor-pointer border border-slate-200 transition-colors" title="Tahun 4 digit" onClick={() => setPattern(p => p + ' [YEAR]')}>[YEAR]</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide" htmlFor="seq-input">
              Nomor Urut Selanjutnya (Sequence)
            </label>
            <input
              id="seq-input"
              type="number"
              min="1"
              value={seq}
              onChange={(e) => setSeq(Number(e.target.value))}
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500"
              required
            />
            <p className="text-[10px] text-blue-600 font-medium italic mt-1">Sistem akan menambah urutan secara otomatis saat formulir baru disimpan.</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" id="info-icon" />
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pratinjau Nomor Selanjutnya</p>
              <p className="text-sm font-bold font-mono text-blue-700 mt-1 tracking-wide">{previewNumber}</p>
            </div>
          </div>

          <button
            id="btn-save-settings"
            type="submit"
            disabled={isSaving}
            className={`px-5 h-11 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              success
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" id="spin-icon" />
            ) : success ? (
              <Check className="w-3.5 h-3.5" id="check-icon" />
            ) : (
              <Settings className="w-3.5 h-3.5" id="save-settings-icon" />
            )}
            {isSaving ? 'Menyimpan...' : success ? 'Tersimpan!' : 'Simpan Format'}
          </button>
        </div>
      </form>
    </div>
  );
}
