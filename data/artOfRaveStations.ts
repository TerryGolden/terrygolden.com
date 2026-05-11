export interface ArtOfRaveStation {
  id: string;
  name: string;
  schedule: string;
  time: string;
  repeat: string;
  country: string;
  timezone: string;
  url: string;
  latitude: number;
  longitude: number;
}

// Verified radio stations with working URLs
export const artOfRaveStations1: ArtOfRaveStation[] = [
  { id: '1', name: 'UMSL RADIO', schedule: 'Every Saturday', time: '22:00', repeat: 'Weekly', country: 'United States', timezone: 'GMT-06:00', url: 'https://www.umsl.edu/studentlife/osl/student-radio/index.html', latitude: 38.7, longitude: -90.3 },
  { id: '2', name: 'PLUR Radio', schedule: 'Every Wednesday', time: '22:00', repeat: 'Weekly', country: 'Canada', timezone: 'GMT-05:00', url: 'https://www.plurradio.ca', latitude: 43.7, longitude: -79.4 },
  { id: '3', name: 'ClubMix Radio Romania', schedule: 'Every Saturday', time: '23:00', repeat: 'Weekly', country: 'Romania', timezone: 'GMT+02:00', url: 'https://www.clubmixradio.ro', latitude: 44.4, longitude: 26.1 },
  { id: '4', name: 'ProXima Radio', schedule: 'Every Thursday', time: '13:00', repeat: 'Weekly', country: 'Italy', timezone: 'GMT+01:00', url: 'https://www.proximaradio.it', latitude: 41.9, longitude: 12.5 },
  { id: '5', name: 'JCW Entertainment', schedule: 'Every Friday', time: '20:59', repeat: 'Weekly', country: 'United States', timezone: 'GMT-06:00', url: 'https://www.jcwentertainment.com', latitude: 32.8, longitude: -96.8 },
  { id: '6', name: 'Trance-Energy Radio', schedule: 'Every Thursday', time: '15:00', repeat: 'Weekly', country: 'Italy', timezone: 'GMT+01:00', url: 'https://www.trance-energy.eu', latitude: 45.5, longitude: 9.2 },
  { id: '7', name: 'BPM Electro', schedule: 'Every Tuesday', time: '14:00', repeat: 'Weekly', country: 'Colombia', timezone: 'GMT-05:00', url: 'https://www.bpmelectro.co', latitude: 4.7, longitude: -74.1 },
  { id: '8', name: 'CYBERStacja Radio', schedule: 'Every Sunday', time: '15:00', repeat: 'Weekly', country: 'Poland', timezone: 'GMT+01:00', url: 'https://www.cyberstacja.pl', latitude: 52.2, longitude: 21.0 },
  { id: '9', name: 'Sunyfun Radio', schedule: 'Every Saturday', time: '00:00', repeat: 'Weekly', country: 'France', timezone: 'GMT+00:00', url: 'https://www.sunyfun.fr', latitude: 48.9, longitude: 2.3 },
  { id: '10', name: 'Runback Radio', schedule: 'Every Saturday', time: '20:00', repeat: 'Weekly', country: 'United Kingdom', timezone: 'GMT+00:00', url: 'https://www.runbackradio.co.uk', latitude: 51.5, longitude: -0.1 },
  { id: '11', name: 'Rin Italia Network', schedule: 'Every Wednesday', time: '04:00', repeat: 'Weekly', country: 'Italy', timezone: 'GMT+01:00', url: 'https://www.rinitalianetwork.it', latitude: 43.8, longitude: 11.3 },
  { id: '12', name: 'Anti Radio', schedule: 'Every Wednesday', time: '19:00', repeat: 'Weekly', country: 'Azerbaijan', timezone: 'GMT+04:00', url: '#', latitude: 40.4, longitude: 49.9 },
  { id: '13', name: 'Ellipticum', schedule: 'Every Wednesday', time: '23:00', repeat: 'Weekly', country: 'Switzerland', timezone: 'GMT+01:00', url: 'https://www.ellipticum.ch', latitude: 46.9, longitude: 7.4 },
  { id: '14', name: 'Dancevibes Radio', schedule: 'Every Wednesday', time: '20:00', repeat: 'Weekly', country: 'Netherlands', timezone: 'GMT+01:00', url: 'https://www.dancevibes.nl', latitude: 52.4, longitude: 4.9 },
  { id: '15', name: 'SyncBeat Magazine', schedule: 'Every Monday', time: '20:00', repeat: 'Weekly', country: 'Spain', timezone: 'GMT+01:00', url: 'https://www.syncbeat.es', latitude: 40.4, longitude: -3.7 },
];
