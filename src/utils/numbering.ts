export function toRoman(num: number): string {
  const romanMap: { [key: number]: string } = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
    7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
  };
  return romanMap[num] || String(num);
}

export function padNumber(num: number, size: number = 3): string {
  let s = String(num);
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

export function generateProposalNumber(
  pattern: string,
  sequence: number,
  bidang: string,
  dateString: string
): string {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear() || new Date().getFullYear();
  const month = (date.getMonth() + 1) || (new Date().getMonth() + 1);
  const romanMonth = toRoman(month);
  
  // Format sequence, e.g. "001"
  const seqStr = padNumber(sequence, 3);
  
  // Replace placeholders
  let result = pattern;
  result = result.replace(/\[SEQ\]/g, seqStr);
  result = result.replace(/\[BIDANG\]/g, bidang || 'Bidang');
  result = result.replace(/\[ROMAN_MONTH\]/g, romanMonth);
  result = result.replace(/\[YEAR\]/g, String(year));
  
  return result;
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
