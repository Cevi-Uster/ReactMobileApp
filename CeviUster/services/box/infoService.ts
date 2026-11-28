import { decode } from 'html-entities';
import URLs from '../../constants/URLs';
import { fetchJson } from '../http';

export type Info = {
  stufe: string;
  aktuell: boolean;
  von?: Date;
  bis?: Date;
  wo?: string;
  infos?: string;
  mitnehmen?: string;
  email?: string;
};

type ChaeschtliResponse = {
  von?: string;
  bis?: string;
  wo?: string;
  infos?: string;
  mitnehmen?: string;
  email?: string;
};

const NO_INFO_TEXT =
  'Keine aktuelle Informationen verfügbar. Wende dich bei Fragen bitte an den Stufenleiter / die Stufenleiterin.';

export default async function fetchInfoData(stufenId: string, stufenName: string): Promise<Info> {
  const json = await fetchJson<ChaeschtliResponse | null>(
    `${URLs.INFOBOX_BASE_URL}chaeschtlizettel/${stufenId}`,
    { headers: { Accept: 'application/json' } }
  );
  if (!json) {
    throw new Error('Keine Daten erhalten');
  }

  const bis = json.bis ? new Date(Date.parse(json.bis)) : undefined;
  let isActual = false;
  if (bis && !Number.isNaN(bis.getTime())) {
    const expiry = new Date(bis);
    expiry.setHours(23, 59, 59, 999);
    isActual = Date.now() < expiry.getTime();
  }

  return {
    stufe: stufenName,
    aktuell: isActual,
    infos: isActual ? decode(json.infos ?? '') : NO_INFO_TEXT,
    von: isActual && json.von ? new Date(Date.parse(json.von)) : undefined,
    bis: isActual ? bis : undefined,
    wo: isActual ? decode(json.wo ?? '') : undefined,
    mitnehmen: decode(decode(json.mitnehmen ?? '')),
    email: decode(decode(json.email ?? '')),
  };
}
