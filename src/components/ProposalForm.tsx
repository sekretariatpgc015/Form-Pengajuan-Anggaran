import React, { useState, useEffect } from 'react';
import { BudgetProposal, BudgetItem, NumberingSettings } from '../types';
import { generateProposalNumber, formatRupiah } from '../utils/numbering';
import { Plus, Trash2, Save, Printer, ArrowLeft, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  settings: NumberingSettings;
  onSubmit: (proposal: Omit<BudgetProposal, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface FormErrors {
  namaLengkap?: string;
  namaKegiatan?: string;
  tanggalPelaksanaan?: string;
  tempatPelaksanaan?: string;
  items?: string;
}

export default function ProposalFormComponent({ settings, onSubmit, onCancel, isSubmitting }: Props) {
  // Form states
  const [namaLengkap, setNamaLengkap] = useState('');
  const [bidang, setBidang] = useState<'K3' | 'Sekretariat' | 'Keamanan' | string>('K3');
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState('');
  const [tempatPelaksanaan, setTempatPelaksanaan] = useState('');
  const [tanggalPengajuan, setTanggalPengajuan] = useState(new Date().toISOString().split('T')[0]);

  // Budget items state
  const [items, setItems] = useState<BudgetItem[]>([
    { id: '1', uraian: '', satuan: '', volume: 1, hargaSatuan: 0, jumlah: 0 },
    { id: '2', uraian: '', satuan: '', volume: 1, hargaSatuan: 0, jumlah: 0 },
    { id: '3', uraian: '', satuan: '', volume: 1, hargaSatuan: 0, jumlah: 0 },
  ]);

  // Validation state
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<FormErrors>({});

  // Auto generated proposal number
  const proposalNumber = generateProposalNumber(
    settings.formatPattern,
    settings.nextSequence,
    bidang,
    tanggalPengajuan
  );

  // Validate form on data change
  useEffect(() => {
    const newErrors: FormErrors = {};

    if (!namaLengkap.trim()) {
      newErrors.namaLengkap = 'Nama Lengkap wajib diisi';
    } else if (namaLengkap.trim().length < 3) {
      newErrors.namaLengkap = 'Nama Lengkap minimal 3 karakter';
    }

    if (!namaKegiatan.trim()) {
      newErrors.namaKegiatan = 'Nama Kegiatan wajib diisi';
    }

    if (!tanggalPelaksanaan) {
      newErrors.tanggalPelaksanaan = 'Tanggal Pelaksanaan wajib dipilih';
    }

    if (!tempatPelaksanaan.trim()) {
      newErrors.tempatPelaksanaan = 'Tempat Pelaksanaan wajib diisi';
    }

    // Table items validation
    const hasValidItem = items.some(item => item.uraian.trim() && item.volume > 0 && item.hargaSatuan > 0);
    if (!hasValidItem) {
      newErrors.items = 'Minimal harus mengisi 1 baris anggaran (Uraian, Volume, & Harga harus valid)';
    }

    setErrors(newErrors);
  }, [namaLengkap, namaKegiatan, tanggalPelaksanaan, tempatPelaksanaan, items]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Budget table item helper functions
  const handleItemChange = (id: string, field: keyof Omit<BudgetItem, 'id' | 'jumlah'>, value: any) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Calculate amount
          if (field === 'volume' || field === 'hargaSatuan') {
            const vol = field === 'volume' ? Number(value) : item.volume;
            const price = field === 'hargaSatuan' ? Number(value) : item.hargaSatuan;
            updatedItem.jumlah = vol * price;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addRow = () => {
    const newId = String(Date.now());
    setItems(prev => [...prev, { id: newId, uraian: '', satuan: '', volume: 1, hargaSatuan: 0, jumlah: 0 }]);
  };

  const removeRow = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Grand total calculation
  const grandTotal = items.reduce((sum, item) => sum + (item.jumlah || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to show any validation errors
    setTouched({
      namaLengkap: true,
      namaKegiatan: true,
      tanggalPelaksanaan: true,
      tempatPelaksanaan: true,
    });

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Filter out completely empty items before saving
    const validItems = items.filter(item => item.uraian.trim() !== '');

    await onSubmit({
      nomor: proposalNumber,
      tanggalPengajuan,
      namaLengkap: namaLengkap.trim(),
      bidang,
      namaKegiatan: namaKegiatan.trim(),
      tanggalPelaksanaan,
      tempatPelaksanaan: tempatPelaksanaan.trim(),
      items: validItems,
      jumlahTotal: grandTotal,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="proposal-form-container">
      {/* Header section with back button */}
      <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="form-header-bar">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-form"
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-all cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" id="back-icon" />
          </button>
          <div>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">FORMULIR BARU</span>
            <h2 className="text-lg font-bold text-slate-800 mt-1" id="form-header-title">Buat Pengajuan Anggaran (RAB)</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-500 bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200">
          <span className="font-semibold text-slate-700">No. Dokumen:</span>
          <span className="text-blue-700 font-bold tracking-wide" id="preview-form-number">{proposalNumber}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-8" id="actual-proposal-form">
        {/* SECTION 1: IDENTITAS PEMOHON */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-xs">1</span>
            <h3 className="font-bold text-slate-800 text-base">Identitas Pemohon</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide" htmlFor="namaLengkap">
                Nama Lengkap Pemohon <span className="text-rose-500">*</span>
              </label>
              <input
                id="namaLengkap"
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                onBlur={() => handleBlur('namaLengkap')}
                className={`w-full h-11 px-4 border rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 ${
                  touched.namaLengkap && errors.namaLengkap
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
              {touched.namaLengkap && errors.namaLengkap && (
                <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.namaLengkap}
                </p>
              )}
            </div>

            {/* Bidang */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide" htmlFor="bidang">
                Bidang / Divisi <span className="text-rose-500">*</span>
              </label>
              <select
                id="bidang"
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm transition-all bg-slate-50 focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 cursor-pointer outline-none appearance-none"
              >
                <option value="K3">K3 (Kebersihan, Keindahan, Ketertiban)</option>
                <option value="Sekretariat">Sekretariat</option>
                <option value="Keamanan">Keamanan</option>
              </select>
            </div>

            {/* Nama Kegiatan */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide" htmlFor="namaKegiatan">
                Nama Kegiatan <span className="text-rose-500">*</span>
              </label>
              <input
                id="namaKegiatan"
                type="text"
                placeholder="Contoh: Kerja Bakti Massal, Hut RI 81, Perbaikan Pos Ronda"
                value={namaKegiatan}
                onChange={(e) => setNamaKegiatan(e.target.value)}
                onBlur={() => handleBlur('namaKegiatan')}
                className={`w-full h-11 px-4 border rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 ${
                  touched.namaKegiatan && errors.namaKegiatan
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
              {touched.namaKegiatan && errors.namaKegiatan && (
                <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.namaKegiatan}
                </p>
              )}
            </div>

            {/* Tanggal Pelaksanaan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide" htmlFor="tanggalPelaksanaan">
                Tanggal Pelaksanaan <span className="text-rose-500">*</span>
              </label>
              <input
                id="tanggalPelaksanaan"
                type="date"
                value={tanggalPelaksanaan}
                onChange={(e) => setTanggalPelaksanaan(e.target.value)}
                onBlur={() => handleBlur('tanggalPelaksanaan')}
                className={`w-full h-11 px-4 border rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 cursor-pointer ${
                  touched.tanggalPelaksanaan && errors.tanggalPelaksanaan
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
              {touched.tanggalPelaksanaan && errors.tanggalPelaksanaan && (
                <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.tanggalPelaksanaan}
                </p>
              )}
            </div>

            {/* Tempat Pelaksanaan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide" htmlFor="tempatPelaksanaan">
                Tempat Pelaksanaan <span className="text-rose-500">*</span>
              </label>
              <input
                id="tempatPelaksanaan"
                type="text"
                placeholder="Contoh: Balai Warga RW 015, Lingkungan RT 02"
                value={tempatPelaksanaan}
                onChange={(e) => setTempatPelaksanaan(e.target.value)}
                onBlur={() => handleBlur('tempatPelaksanaan')}
                className={`w-full h-11 px-4 border rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 ${
                  touched.tempatPelaksanaan && errors.tempatPelaksanaan
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
              {touched.tempatPelaksanaan && errors.tempatPelaksanaan && (
                <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.tempatPelaksanaan}
                </p>
              )}
            </div>

            {/* Tanggal Pengajuan (Hidden/Disabled by default, but customizable if they need to back-date) */}
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide" htmlFor="tanggalPengajuan">
                Tanggal Pengajuan Dokumen
              </label>
              <input
                id="tanggalPengajuan"
                type="date"
                value={tanggalPengajuan}
                onChange={(e) => setTanggalPengajuan(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 cursor-pointer text-slate-600 bg-slate-100"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: RENCANA ANGGARAN BIAYA */}
        <div className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">II</span>
              <h3 className="font-bold text-slate-800 text-base">Rencana Anggaran Biaya (RAB)</h3>
            </div>
            
            <button
              id="btn-add-row"
              type="button"
              onClick={addRow}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer w-fit self-end sm:self-auto border border-slate-200 hover:border-blue-100"
            >
              <Plus className="w-3.5 h-3.5" id="plus-icon" /> Tambah Baris
            </button>
          </div>

          {/* Dynamic Responsive Table / List on Mobile */}
          <div className="overflow-x-auto rounded-xl border border-slate-200" id="budget-items-table">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-12 text-center">No</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Uraian / Kebutuhan</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-24">Satuan</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-24 text-center">Volume</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-40">Harga Satuan</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-40">Jumlah</th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider w-12">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* No */}
                    <td className="px-3 py-3 text-sm font-medium text-slate-500 text-center">
                      {index + 1}
                    </td>

                    {/* Uraian */}
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={item.uraian}
                        onChange={(e) => handleItemChange(item.id, 'uraian', e.target.value)}
                        placeholder="Contoh: Konsumsi rapat, Semen, Spanduk"
                        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-transparent transition-all"
                        required
                      />
                    </td>

                    {/* Satuan */}
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={item.satuan}
                        onChange={(e) => handleItemChange(item.id, 'satuan', e.target.value)}
                        placeholder="e.g. Pax, Pcs, Hari"
                        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-transparent transition-all"
                      />
                    </td>

                    {/* Volume */}
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.volume}
                        onChange={(e) => handleItemChange(item.id, 'volume', Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-center bg-transparent transition-all"
                        required
                      />
                    </td>

                    {/* Harga Satuan */}
                    <td className="px-2 py-2">
                      <div className="relative rounded-lg">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-semibold text-slate-400">Rp</span>
                        <input
                          type="number"
                          min="0"
                          value={item.hargaSatuan || ''}
                          onChange={(e) => handleItemChange(item.id, 'hargaSatuan', Number(e.target.value))}
                          placeholder="0"
                          className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-transparent transition-all"
                          required
                        />
                      </div>
                    </td>

                    {/* Jumlah */}
                    <td className="px-4 py-3 text-sm font-semibold text-slate-700 font-mono">
                      {formatRupiah(item.jumlah)}
                    </td>

                    {/* Action */}
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(item.id)}
                        disabled={items.length <= 1}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          items.length <= 1
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                        }`}
                        title="Hapus baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Validation Alert for items */}
          {errors.items && (
            <p className="text-xs font-medium text-rose-500 flex items-center gap-1.5 mt-2 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errors.items}
            </p>
          )}

          {/* JUMLAH TOTAL Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah Total Anggaran</p>
              <p className="text-xs text-slate-400 mt-0.5">Akumulasi dari seluruh rencana pengeluaran di atas.</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-xl flex items-baseline gap-1">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Total:</span>
              <span className="text-2xl font-black font-mono text-blue-700">{formatRupiah(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-end gap-3" id="form-actions-footer">
          <button
            id="btn-cancel-submit"
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer text-center"
          >
            Batal
          </button>
          
          <button
            id="btn-save-submit"
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className={`w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer ${
              isSubmitting || Object.keys(errors).length > 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" id="submit-spin" />
            ) : (
              <Save className="w-4 h-4" id="save-icon" />
            )}
            {isSubmitting ? 'Menyimpan...' : 'Simpan Pengajuan'}
          </button>
        </div>
      </form>
    </div>
  );
}
