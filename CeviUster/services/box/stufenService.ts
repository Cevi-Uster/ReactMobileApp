import URLs from '../../constants/URLs';
import { fetchJson } from '../http';

export interface Stufe {
  stufen_id: number;
  name: string;
}

export function fetchStufenData(): Promise<Stufe[]> {
  return fetchJson<Stufe[]>(`${URLs.INFOBOX_BASE_URL}stufen/`);
}
