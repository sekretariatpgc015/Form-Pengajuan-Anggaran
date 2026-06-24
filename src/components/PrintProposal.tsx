import React from 'react';
import { BudgetProposal } from '../types';
import { formatRupiah } from '../utils/numbering';
import { Printer, X } from 'lucide-react';

interface Props {
  proposal: BudgetProposal;
  onClose: () => void;
}

export default function PrintProposal({ proposal, onClose }: Props) {
  const handlePrint = () => {
    window.print();
  };

  // Format date to local Indonesian format, e.g. "23 Juni 2026"
  const formatDateIndo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 print:p-0 print:bg-white print:relative print:inset-auto" id="print-preview-modal">
      
      {/* Top action bar - hidden during print */}
      <div className="absolute top-4 right-4 flex items-center gap-2 print:hidden z-50">
        <button
          id="btn-print-trigger"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-blue-500/20 cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4" /> Cetak Sekarang
        </button>
        <button
          id="btn-close-print"
          onClick={onClose}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl cursor-pointer transition-all border border-slate-700"
          title="Tutup Pratinjau"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Print Container */}
      <div className="bg-white w-full max-w-[800px] min-h-[1120px] p-8 sm:p-12 shadow-2xl rounded-none sm:rounded-2xl overflow-hidden print:shadow-none print:p-0 print:rounded-none relative flex flex-col justify-between" id="print-paper-stage">
        
        {/* Top Header - Logo and Text */}
        <div>
          <div className="flex items-center gap-6 border-b-2 border-slate-800 pb-4">
            {/* Shield Logo with custom vector styling */}
            <div className="w-20 h-20 bg-slate-900 flex-shrink-0 flex flex-col items-center justify-center p-1 relative rounded-lg border-2 border-slate-700" style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 80%, 50% 100%, 0% 80%, 0% 15%)' }}>
              <div className="text-[9px] font-bold text-white tracking-widest text-center mt-1 leading-none">RW. 015</div>
              <div className="w-10 h-0.5 bg-yellow-500 my-1"></div>
              <div className="text-[6px] text-center text-slate-300 font-semibold leading-tight uppercase px-1">Pesona Gading Cibitung</div>
              <div className="text-[5px] text-yellow-400 font-bold tracking-widest mt-1.5">- TERMUKTI -</div>
            </div>

            <div className="text-left space-y-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-wide font-sans leading-tight">RW. 015 PESONA GADING CIBITUNG</h1>
              <h2 className="text-sm font-semibold text-slate-800 font-sans tracking-normal uppercase">DESA WANAJAYA KECAMATAN CIBITUNG</h2>
              <div className="h-[2px] bg-slate-900 w-full mt-2"></div>
              <h3 className="text-base font-bold text-slate-900 tracking-wider font-sans uppercase pt-1 text-center sm:text-left">FORM PENGAJUAN ANGGARAN</h3>
            </div>
          </div>

          {/* Doc metadata */}
          <div className="mt-6 space-y-1 text-sm font-medium">
            <div className="flex">
              <span className="w-40">Nomor</span>
              <span className="mr-3">:</span>
              <span className="font-semibold font-mono tracking-wide text-slate-900">{proposal.nomor}</span>
            </div>
            <div className="flex">
              <span className="w-40">Tanggal Pengajuan</span>
              <span className="mr-3">:</span>
              <span>{formatDateIndo(proposal.tanggalPengajuan)}</span>
            </div>
          </div>

          {/* I. IDENTITAS PEMOHON */}
          <div className="mt-8">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">I. IDENTITAS PEMOHON</h4>
            <div className="mt-3.5 space-y-2 text-sm">
              <div className="flex">
                <span className="w-44 text-slate-700">1. Nama Lengkap</span>
                <span className="mr-3 text-slate-800">:</span>
                <span className="font-semibold text-slate-900">{proposal.namaLengkap}</span>
              </div>
              <div className="flex">
                <span className="w-44 text-slate-700">2. Bidang</span>
                <span className="mr-3 text-slate-800">:</span>
                <span className="font-semibold text-slate-900">{proposal.bidang}</span>
              </div>
              <div className="flex">
                <span className="w-44 text-slate-700">3. Nama Kegiatan</span>
                <span className="mr-3 text-slate-800">:</span>
                <span className="font-semibold text-slate-900">{proposal.namaKegiatan}</span>
              </div>
              <div className="flex">
                <span className="w-44 text-slate-700">4. Tanggal Pelaksanaan</span>
                <span className="mr-3 text-slate-800">:</span>
                <span className="font-medium text-slate-900">{formatDateIndo(proposal.tanggalPelaksanaan)}</span>
              </div>
              <div className="flex">
                <span className="w-44 text-slate-700">5. Tempat Pelaksanaan</span>
                <span className="mr-3 text-slate-800">:</span>
                <span className="font-medium text-slate-900">{proposal.tempatPelaksanaan}</span>
              </div>
            </div>
          </div>

          {/* II. RENCANA ANGGARAN BIAYA */}
          <div className="mt-8">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">II. RENCANA ANGGARAN BIAYA</h4>
            
            <div className="mt-4 border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-800">
                    <th className="px-2 py-2 border-r border-slate-800 font-bold text-center w-12 text-slate-900">No</th>
                    <th className="px-4 py-2 border-r border-slate-800 font-bold text-left text-slate-900">Uraian</th>
                    <th className="px-3 py-2 border-r border-slate-800 font-bold text-center w-24 text-slate-900">Satuan</th>
                    <th className="px-3 py-2 border-r border-slate-800 font-bold text-center w-20 text-slate-900">Volume</th>
                    <th className="px-4 py-2 border-r border-slate-800 font-bold text-right w-36 text-slate-900">Harga Satuan</th>
                    <th className="px-4 py-2 font-bold text-right w-36 text-slate-900">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {proposal.items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-800">
                      <td className="px-2 py-2 border-r border-slate-800 text-center text-slate-900">{idx + 1}</td>
                      <td className="px-4 py-2 border-r border-slate-800 text-slate-900">{item.uraian}</td>
                      <td className="px-3 py-2 border-r border-slate-800 text-center text-slate-900">{item.satuan || '-'}</td>
                      <td className="px-3 py-2 border-r border-slate-800 text-center text-slate-900">{item.volume}</td>
                      <td className="px-4 py-2 border-r border-slate-800 text-right text-slate-900 font-mono">{formatRupiah(item.hargaSatuan)}</td>
                      <td className="px-4 py-2 text-right text-slate-900 font-mono font-semibold">{formatRupiah(item.jumlah)}</td>
                    </tr>
                  ))}
                  {/* Fill empty rows to maintain professional length (at least 3 rows like in original template) */}
                  {proposal.items.length < 3 && 
                    Array.from({ length: 3 - proposal.items.length }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-b border-slate-800 h-9">
                        <td className="px-2 py-2 border-r border-slate-800 text-center text-slate-400">{proposal.items.length + i + 1}</td>
                        <td className="px-4 py-2 border-r border-slate-800"></td>
                        <td className="px-3 py-2 border-r border-slate-800"></td>
                        <td className="px-3 py-2 border-r border-slate-800"></td>
                        <td className="px-4 py-2 border-r border-slate-800"></td>
                        <td className="px-4 py-2"></td>
                      </tr>
                    ))
                  }
                  {/* Grand Total */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-800">
                    <td colSpan={4} className="px-4 py-2.5 border-r border-slate-800 text-right uppercase tracking-wide text-slate-950 font-bold">JUMLAH TOTAL</td>
                    <td colSpan={2} className="px-4 py-2.5 text-right font-mono text-base text-slate-950 font-extrabold">{formatRupiah(proposal.jumlahTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - SIGNATURES */}
        <div className="mt-16 text-sm grid grid-cols-2 gap-12 font-medium">
          <div className="text-center space-y-20">
            <div>
              <p className="text-slate-700">Mengetahui</p>
              <p className="font-bold text-slate-900 uppercase">KETUA RW. 015</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-900 border-b border-slate-900 pb-0.5 inline-block min-w-36">WARDIYANTO</p>
            </div>
          </div>

          <div className="text-center space-y-20">
            <div>
              <p className="text-slate-700">Cibitung, {formatDateIndo(proposal.tanggalPengajuan)}</p>
              <p className="font-bold text-slate-900 uppercase">BIDANG: {proposal.bidang}</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-900 border-b border-slate-900 pb-0.5 inline-block min-w-36 uppercase">PEMOHON</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
