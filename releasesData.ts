export interface Release {
  id: string;
  spotifyId: string;
  name: string;
  type: 'single' | 'album' | 'EP';
  releaseDate: string;
  image: string;
  links: {
    spotify: string;
    deezer: string;
    youtube: string;
    appleMusic: string;
    beatport: string;
  };
}

// Helper to generate platform search links
const generateLinks = (spotifyId: string, trackName: string) => {
  const encoded = encodeURIComponent(`Terry Golden ${trackName}`);
  return {
    spotify: `https://open.spotify.com/album/${spotifyId}`,
    deezer: `https://www.deezer.com/search/${encoded}`,
    youtube: `https://www.youtube.com/results?search_query=${encoded}`,
    appleMusic: `https://music.apple.com/search?term=${encoded}`,
    beatport: `https://www.beatport.com/search?q=${encoded}`,
  };
};

export const albumIds = [
  '6xtQ6vfvlDW8Z57VZQhkq1', '7sHsjjYkDmb38STUmWy3R6', '7F7lguQZAnEYGD31wSDSj2',
  '4Tfgzj1Rb28jlMT1q2sYKX', '0Mm2wDt3UR9QERYmVfITEv', '5BDfG4viN0DPmWDwtwCAhy',
  '5DgRGvgRlfzbiLHHdZ7XIx', '3clVDG9hGnnQ954xieiuDx', '4h4MyWiZyQjvkhZvxPJmD1',
  '4OJxIiwfhpBw9Qrk0GWOhq', '6I7n1RR9ucKvwsvnOmNhyl', '0KrOkxRdg6sJ0dcuVmTV7Q',
  '6LHeG5PAzmLPR9gwSbzJYS', '3HGpAjKhZ3pxoYud5H8k2L', '6kssY8IdaeBRny2it6JVG9',
  '2gdueYVirDq5z3GfJOQ3Xc', '4FfWcVd7O3MLNJl5SzFuLY', '7ffKJVAYY91Kgn1gnMjLw2',
  '62vzbnFEOBguIekzVKZ2Kc', '1aZBF4ydiciuUNcQ5HgGHS', '71HCULdqOJtvcZLLj1jyCi',
  '6osjJyq5quIWwls5QjCH5S', '1Sqea0mw2zfvc80BA4MsUC', '4yw6d5iWucu0XMjHEQV29M',
  '1790H8xmtSjsJx5aeUFfoV', '1Ve3r6RNGQ8JFsessNMyxk', '6szji6vVXfHqg5xMwik2k3',
  '1gYd1uKBhPiCqdtkKlJY52', '0KWmuOgEWbH9evFl5poHjX', '1gxyFwo3e3Zz2CzpsrgIYs',
  '3zFXAw8VaG0Ey0VbbT2UAN'
];

export { generateLinks };
