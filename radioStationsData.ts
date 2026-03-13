export interface RadioStation {
  name: string;
  schedule: string;
  time: string;
  repeat: 'Weekly' | 'Bi-weekly';
  country: string;
  timezone: string;
  url?: string;
  lat: number;
  lng: number;
}

export const radioStations: RadioStation[] = [
  { name: "UMSL RADIO", schedule: "Every Saturday", time: "22:00", repeat: "Weekly", country: "United States", timezone: "GMT-06:00", lat: 38.7, lng: -90.3, url: "https://umslradio.com" },
  { name: "PLUR Radio", schedule: "Every Wednesday", time: "22:00", repeat: "Weekly", country: "Canada", timezone: "GMT-05:00", lat: 43.7, lng: -79.4, url: "https://plurradio.ca" },
  { name: "ClubMix Radio Romania", schedule: "Every Saturday", time: "23:00", repeat: "Weekly", country: "Romania", timezone: "GMT+02:00", lat: 44.4, lng: 26.1, url: "https://clubmixradio.ro" },
  { name: "ProXima Radio", schedule: "Every Thursday", time: "13:00", repeat: "Weekly", country: "Italy", timezone: "GMT+01:00", lat: 41.9, lng: 12.5, url: "https://proximaradio.it" },
  { name: "JCW Entertainment", schedule: "Every Friday", time: "20:59", repeat: "Weekly", country: "United States", timezone: "GMT-06:00", lat: 32.8, lng: -96.8, url: "https://jcwentertainment.com" },
  { name: "Trance-Energy Radio", schedule: "Every Thursday", time: "15:00", repeat: "Weekly", country: "Italy", timezone: "GMT+01:00", lat: 45.5, lng: 9.2, url: "https://trance-energy.eu" },
  { name: "BPM Electro", schedule: "Every Tuesday", time: "14:00", repeat: "Weekly", country: "Colombia", timezone: "GMT-05:00", lat: 4.7, lng: -74.1, url: "https://bpmelectro.co" },
  { name: "CYBERStacja Radio", schedule: "Every Sunday", time: "15:00", repeat: "Weekly", country: "Poland", timezone: "GMT+01:00", lat: 52.2, lng: 21.0, url: "https://cyberstacja.pl" },
  { name: "Sunyfun Radio", schedule: "Every Saturday", time: "00:00", repeat: "Weekly", country: "France", timezone: "GMT+00:00", lat: 48.9, lng: 2.3, url: "https://sunyfun.fr" },
  { name: "Runback Radio", schedule: "Every Saturday", time: "20:00", repeat: "Weekly", country: "United Kingdom", timezone: "GMT+00:00", lat: 51.5, lng: -0.1, url: "https://runbackradio.co.uk" },
  { name: "Rin Italia Network", schedule: "Every Wednesday", time: "04:00", repeat: "Weekly", country: "Italy", timezone: "GMT+01:00", lat: 43.8, lng: 11.3, url: "https://rinitalianetwork.it" },
  { name: "Anti Radio", schedule: "Every Wednesday", time: "19:00", repeat: "Weekly", country: "Azerbaijan", timezone: "GMT+04:00", lat: 40.4, lng: 49.9, url: "https://antiradio.az" },
  { name: "Ellipticum", schedule: "Every Wednesday", time: "23:00", repeat: "Weekly", country: "Switzerland", timezone: "GMT+01:00", lat: 46.9, lng: 7.4, url: "https://ellipticum.ch" },
  { name: "Dancevibes Radio", schedule: "Every Wednesday", time: "20:00", repeat: "Weekly", country: "Netherlands", timezone: "GMT+01:00", lat: 52.4, lng: 4.9, url: "https://dancevibes.nl" },
  { name: "SyncBeat Magazine", schedule: "Every Monday", time: "20:00", repeat: "Weekly", country: "Spain", timezone: "GMT+01:00", lat: 40.4, lng: -3.7, url: "https://syncbeat.es" },
];
