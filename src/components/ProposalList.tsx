import React, { useState } from 'react';
import { BudgetProposal } from '../types';
import { formatRupiah } from '../utils/numbering';
import { Search, Filter, Printer, Trash2, Plus, Calendar, MapPin, Building, Eye, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  proposals: BudgetProposal[];
  onSelectProposal: (proposal: BudgetProposal) => void;
  onDeleteProposal: (id: string) => Promise<void>;
  onAddNewClick: () => void;
}

export default function ProposalList({ proposals, onSelectProposal, onDeleteProposal, onAddNewClick }: Props) {
  const [search, setSearch] = useState('');
  const [filterBidang, setFilterBidang] = useState('All');

  // Filter logic
  const filteredProposals = proposals.filter(p => {
    const matchesSearch = 
      p.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      p.namaKegiatan.toLowerCase().includes(search.toLowerCase()) ||
      p.nomor.toLowerCase().includes(search.toLowerCase());
    
    const matchesBidang = filterBidang === 'All' || p.bidang === filterBidang;
    
    return matchesSearch && matchesBidang;
  });

  const totalFilteredBudget = filteredProposals.reduce((sum, p) => sum + p.jumlahTotal, 0);

  const getBidangBadgeClass = (bidang: string) => {
    switch (bidang) {
      case 'K3':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Sekretariat':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Keamanan':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6" id="proposal-list-section">
      {/* Top Welcome / Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="metrics-grid">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Pengajuan</span>
            <h4 className="text-3xl font-black mt-2 font-mono text-blue-400">{proposals.length} <span className="text-sm font-normal text-slate-300">Berkas</span></h4>
          </div>
          <p className="text-slate-400 text-xs mt-4">Seluruh berkas usulan anggaran warga RW 015</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Total Anggaran (Filtered)</span>
            <h4 className="text-2xl font-black mt-2 font-mono text-slate-800">{formatRupiah(totalFilteredBudget)}</h4>
          </div>
          <p className="text-slate-400 text-xs mt-4">Akumulasi pengajuan yang aktif disaring</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Aksi Cepat</span>
            <div className="mt-2">
              <button
                id="btn-add-quick"
                onClick={onAddNewClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200/50 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Buat Pengajuan Baru
              </button>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-3">Gunakan form pengisian untuk nomor otomatis</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" id="search-icon" />
          <input
            id="search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama, kegiatan, nomor..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-lg text-sm transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" id="filter-icon" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 hidden sm:inline">Saring Bidang</span>
          <select
            id="filter-bidang"
            value={filterBidang}
            onChange={(e) => setFilterBidang(e.target.value)}
            className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="All">Semua Bidang</option>
            <option value="K3">K3</option>
            <option value="Sekretariat">Sekretariat</option>
            <option value="Keamanan">Keamanan</option>
          </select>
        </div>
      </div>

      {/* Proposals Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filteredProposals.length === 0 ? (
          <div className="p-12 text-center space-y-3" id="empty-state">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mx-auto border border-slate-200">
              <Eye className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-slate-700 text-sm">Tidak ada pengajuan ditemukan</h5>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Silakan sesuaikan filter pencarian atau buat pengajuan baru melalui tombol aksi.</p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No. Pengajuan</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pemohon / Bidang</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kegiatan / Agenda</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rencana Pelaksanaan</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Anggaran</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredProposals.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Number */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-800 text-xs whitespace-nowrap">
                        {p.nomor}
                      </td>

                      {/* Applicant */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{p.namaLengkap}</div>
                        <span className={`inline-block px-2 py-0.5 mt-1 border rounded-md text-[10px] font-bold ${getBidangBadgeClass(p.bidang)}`}>
                          {p.bidang}
                        </span>
                      </td>

                      {/* Activity */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 line-clamp-1">{p.namaKegiatan}</div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" /> {p.tempatPelaksanaan}
                        </div>
                      </td>

                      {/* Implementation Date */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(p.tanggalPelaksanaan).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 font-bold text-slate-800 font-mono">
                        {formatRupiah(p.jumlahTotal)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            id={`btn-view-${p.id}`}
                            onClick={() => onSelectProposal(p)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg transition-all cursor-pointer"
                            title="Pratinjau Cetak"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          
                          <button
                            id={`btn-delete-${p.id}`}
                            onClick={() => {
                              if (confirm('Apakah Anda yakin ingin menghapus pengajuan ini?')) {
                                onDeleteProposal(p.id);
                              }
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-800 rounded-lg transition-all cursor-pointer"
                            title="Hapus"
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

            {/* Mobile Card-List View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredProposals.map((p) => (
                <div key={p.id} className="p-4 space-y-3.5 hover:bg-slate-50/50 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-mono text-[11px] font-extrabold text-blue-700 tracking-wide">{p.nomor}</p>
                      <h4 className="font-bold text-slate-900 text-base">{p.namaKegiatan}</h4>
                    </div>
                    <span className={`px-2 py-0.5 border rounded-md text-[10px] font-bold shrink-0 ${getBidangBadgeClass(p.bidang)}`}>
                      {p.bidang}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pemohon</span>
                      <span className="text-slate-800 font-bold">{p.namaLengkap}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pelaksanaan</span>
                      <span className="text-slate-700 font-bold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(p.tanggalPelaksanaan).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <div className="col-span-2 border-t border-slate-200/50 pt-2 mt-1">
                      <span className="text-[10px] text-slate-400 block">Tempat</span>
                      <span className="text-slate-700 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{p.tempatPelaksanaan}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Total Anggaran</span>
                      <span className="text-base font-black text-slate-900 font-mono">{formatRupiah(p.jumlahTotal)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectProposal(p)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-200"
                      >
                        <Printer className="w-3.5 h-3.5" /> Cetak
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus pengajuan ini?')) {
                            onDeleteProposal(p.id);
                          }
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-800 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
