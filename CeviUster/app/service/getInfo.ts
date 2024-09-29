import { decode } from "html-entities";
import moment from "moment";
import URLs from "../../constants/URLs";
import Info from "../types/Info.ts"

export default async function getInfo(stufenId: string, stufenName: string) {
  var promise = new Promise(function(resolve, reject) {
    const url = `${URLs.INFOBOX_BASE_URL}chaeschtlizettel/${stufenId}`;
    console.log(`Try to load info from URL: ${url}`);
    const load = async () => {
      const chaeschliResponse = await fetch(url, {
        headers: {
          Accept: "application/json"
        }
      });
      console.log("Fetch finished");
      const json = await chaeschliResponse.json();
      if (json !== undefined && json !== null) {
        var expiryMoment = moment(Date.parse(json.bis)).endOf('day');
        let isActual: boolean = moment().diff(expiryMoment) < 0;
        const info: Info = {
          stufe: stufenName,
          aktuell: isActual,
          infos: isActual ? decode(json.infos) : 'Keine aktuelle Informationen verfügbar. Wende dich bei Fragen bitte an den Stufenleiter / die Stufenleiterin.',
          von: isActual ? new Date(Date.parse(json.von)) : null,
          bis: isActual ? new Date(Date.parse(json.bis)) : null,
          wo: isActual ? decode(json.wo) : null,
        }
        console.log(info.von);
        resolve(info);
      } else {
        const info: Info = {
          stufe: stufenName,
          aktuell: isActual,
          infos: 'Bei der Dateabfrage ist ein Fehler aufgetreten. Wende dich bei Fragen bitte an den Stufenleiter / die Stufenleiterin.',
        }
        resolve(info);
      }
    }
    load(); 
  });
  
  return promise;   
}
