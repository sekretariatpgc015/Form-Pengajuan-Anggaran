export interface BudgetItem {
  id: string;
  uraian: string;
  satuan: string;
  volume: number;
  hargaSatuan: number;
  jumlah: number;
}

export interface BudgetProposal {
  id: string;
  nomor: string;
  tanggalPengajuan: string;
  namaLengkap: string;
  bidang: 'K3' | 'Sekretariat' | 'Keamanan' | string;
  namaKegiatan: string;
  tanggalPelaksanaan: string;
  tempatPelaksanaan: string;
  items: BudgetItem[];
  jumlahTotal: number;
  createdAt: string;
}

export interface NumberingSettings {
  formatPattern: string; // e.g. "[SEQ] / RAB / [BIDANG] / [ROMAN_MONTH] / [YEAR]"
  nextSequence: number;  // e.g. 1
}
