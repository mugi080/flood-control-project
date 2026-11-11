import type { FloodZone } from '@flood-control/shared';

/** The 33 barangays of Lucena City, used only for the search dropdown. */
export const LUCENA_BARANGAYS: string[] = [
  'Barangay 1',
  'Barangay 2',
  'Barangay 3',
  'Barangay 4',
  'Barangay 5',
  'Barangay 6',
  'Barangay 7',
  'Barangay 8',
  'Barangay 9',
  'Barangay 10',
  'Barangay 11',
  'Barra',
  'Bocohan',
  'Cotta',
  'Dalahican',
  'Domoit',
  'Gulang-Gulang',
  'Ibabang Dupay',
  'Ibabang Iyam',
  'Ibabang Talim',
  'Ilayang Dupay',
  'Ilayang Iyam',
  'Ilayang Talim',
  'Isabang',
  'Market View',
  'Mayao Castillo',
  'Mayao Crossing',
  'Mayao Kanluran',
  'Mayao Parada',
  'Mayao Silangan',
  'Ransohan',
  'Salinas',
  'Talao-Talao',
];

/** Converts a zone into the matching name in LUCENA_BARANGAYS. */
export function getBarangayName(zone: FloodZone): string {
  return zone.barangayNumber ? `Barangay ${zone.barangayNumber}` : zone.barangay;
}