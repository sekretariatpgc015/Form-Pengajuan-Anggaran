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
      <div className="bg-white w-full max-w-[800px] min-h-[1120px] print:min-h-0 print:h-auto p-8 sm:p-12 print:p-6 shadow-2xl rounded-none sm:rounded-2xl overflow-hidden print:shadow-none print:rounded-none relative flex flex-col justify-between" id="print-paper-stage">
        
        {/* Top Header - Logo and Text (KOP SURAT) */}
        <div>
          <div className="flex items-center justify-between border-b-4 border-double border-slate-900 pb-5" id="kop-surat-header">
            {/* Shield Logo with custom vector styling */}
            <div className="w-20 h-20 bg-slate-950 flex-shrink-0 flex flex-col items-center justify-center p-1.5 relative rounded-lg border border-slate-800" style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 80%, 50% 100%, 0% 80%, 0% 15%)' }}>
              <div className="text-[10px] font-black text-white tracking-wider text-center leading-none mt-1">RW. 015</div>
              <div className="w-12 h-[2px] bg-amber-400 my-1"></div>
              <div className="text-[7px] text-center text-slate-300 font-extrabold leading-tight uppercase px-0.5">PESONA GADING</div>
              <div className="text-[5px] text-amber-300 font-black tracking-widest mt-1.5 uppercase">CIBITUNG</div>
            </div>

            {/* Official Letterhead Text */}
            <div className="flex-1 text-center px-4 font-sans">
              <h1 className="text-lg font-black text-slate-900 tracking-wide uppercase leading-tight">
                PENGURUS RUKUN WARGA 015 PESONA GADING CIBITUNG
              </h1>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-0.5">
                DESA WANAJAYA • KECAMATAN CIBITUNG • KABUPATEN BEKASI
              </h2>
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                Sekretariat: Perumahan Pesona Gading Cibitung Blok H, Desa Wanajaya, Kec. Cibitung, Kab. Bekasi, Jawa Barat 17520
              </p>
              <p className="text-[9px] text-slate-500 font-medium">
                Email: <span className="font-semibold text-slate-700">sekretariat.pgc015@gmail.com</span> • WhatsApp: <span className="font-semibold text-slate-700">+62 813-1647-5311</span>
              </p>
            </div>

            {/* Hidden spacer to balance flex box centering on desktop/print */}
            <div className="w-20 h-20 flex-shrink-0 invisible block"></div>
          </div>

          {/* Document Title under Kop Surat */}
          <div className="text-center mt-6 print:mt-4 mb-4">
            <h3 className="text-base font-black text-slate-950 tracking-wider font-sans uppercase underline decoration-2 underline-offset-4">
              FORMULIR PENGAJUAN RENCANA ANGGARAN BIAYA (RAB)
            </h3>
          </div>

          {/* Doc metadata */}
          <div className="mt-4 space-y-1.5 text-sm font-medium border-b border-slate-200 pb-4">
            <div className="flex">
              <span className="w-40 text-slate-600 font-semibold uppercase tracking-wider text-xs">Nomor Dokumen</span>
              <span className="mr-3 text-slate-800">:</span>
              <span className="font-bold font-mono tracking-wide text-blue-700 text-sm">{proposal.nomor}</span>
            </div>
            <div className="flex">
              <span className="w-40 text-slate-600 font-semibold uppercase tracking-wider text-xs">Tanggal Pengajuan</span>
              <span className="mr-3 text-slate-800">:</span>
              <span className="text-slate-900">{formatDateIndo(proposal.tanggalPengajuan)}</span>
            </div>
          </div>

          {/* I. IDENTITAS PEMOHON */}
          <div className="mt-6 print:mt-4">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">I. IDENTITAS PEMOHON</h4>
            <div className="mt-3 space-y-1.5 text-sm">
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
          <div className="mt-6 print:mt-4">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">II. RENCANA ANGGARAN BIAYA</h4>
            
            <div className="mt-3 border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-800">
                    <th className="px-2 py-1.5 border-r border-slate-800 font-bold text-center w-12 text-slate-900">No</th>
                    <th className="px-4 py-1.5 border-r border-slate-800 font-bold text-left text-slate-900">Uraian</th>
                    <th className="px-3 py-1.5 border-r border-slate-800 font-bold text-center w-24 text-slate-900">Satuan</th>
                    <th className="px-3 py-1.5 border-r border-slate-800 font-bold text-center w-20 text-slate-900">Volume</th>
                    <th className="px-4 py-1.5 border-r border-slate-800 font-bold text-right w-36 text-slate-900">Harga Satuan</th>
                    <th className="px-4 py-1.5 font-bold text-right w-36 text-slate-900">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {proposal.items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-800">
                      <td className="px-2 py-1.5 border-r border-slate-800 text-center text-slate-900">{idx + 1}</td>
                      <td className="px-4 py-1.5 border-r border-slate-800 text-slate-900">{item.uraian}</td>
                      <td className="px-3 py-1.5 border-r border-slate-800 text-center text-slate-900">{item.satuan || '-'}</td>
                      <td className="px-3 py-1.5 border-r border-slate-800 text-center text-slate-900">{item.volume}</td>
                      <td className="px-4 py-1.5 border-r border-slate-800 text-right text-slate-900 font-mono">{formatRupiah(item.hargaSatuan)}</td>
                      <td className="px-4 py-1.5 text-right text-slate-900 font-mono font-semibold">{formatRupiah(item.jumlah)}</td>
                    </tr>
                  ))}
                  {/* Fill empty rows to maintain professional length (at least 2 rows to keep it concise and strictly fit 1 page) */}
                  {proposal.items.length < 2 && 
                    Array.from({ length: 2 - proposal.items.length }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-b border-slate-800 h-8">
                        <td className="px-2 py-1 border-r border-slate-800 text-center text-slate-400">{proposal.items.length + i + 1}</td>
                        <td className="px-4 py-1 border-r border-slate-800"></td>
                        <td className="px-3 py-1 border-r border-slate-800"></td>
                        <td className="px-3 py-1 border-r border-slate-800"></td>
                        <td className="px-4 py-1 border-r border-slate-800"></td>
                        <td className="px-4 py-1"></td>
                      </tr>
                    ))
                  }
                  {/* Grand Total */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-800">
                    <td colSpan={4} className="px-4 py-2 border-r border-slate-800 text-right uppercase tracking-wide text-slate-950 font-bold">JUMLAH TOTAL</td>
                    <td colSpan={2} className="px-4 py-2 text-right font-mono text-base text-slate-950 font-extrabold">{formatRupiah(proposal.jumlahTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - SIGNATURES */}
        <div className="mt-10 print:mt-8 text-sm grid grid-cols-2 gap-12 font-medium">
          <div className="text-center space-y-16 print:space-y-12">
            <div>
              <p className="text-slate-700">Mengetahui</p>
              <p className="font-bold text-slate-900 uppercase">KETUA RW. 015</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-900 border-b border-slate-900 pb-0.5 inline-block min-w-36 uppercase">WARDIYANTO</p>
            </div>
          </div>

          <div className="text-center space-y-16 print:space-y-12">
            <div>
              <p className="text-slate-700">Cibitung, {formatDateIndo(proposal.tanggalPengajuan)}</p>
              <p className="font-bold text-slate-900 uppercase">BIDANG: {proposal.bidang}</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-900 border-b border-slate-900 pb-0.5 inline-block min-w-36 uppercase">{proposal.namaLengkap}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
