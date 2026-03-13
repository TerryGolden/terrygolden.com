export interface GuestDJEpisode {
  episodeNumber: number;
  title: string;
  date: string;
  mixcloudUrl?: string;
}

export interface GuestDJAppearance {
  event: string;
  venue: string;
  location: string;
  date: string;
  ticketUrl?: string;
}

export interface GuestDJ {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  bio: string;
  shortBio: string;
  country: string;
  genres: string[];
  imageUrl: string;
  socialLinks: {
    spotify?: string;
    soundcloud?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  episodes: GuestDJEpisode[];
  upcomingAppearances: GuestDJAppearance[];
  stats: {
    monthlyListeners?: string;
    followers?: string;
    releases?: number;
  };
}

export const guestDJsData: GuestDJ[] = [
  // ============================================
  // TIER 1 - HEADLINERS
  // ============================================
  {
    id: 'hardwell',
    name: 'Hardwell',
    tier: 1,
    bio: 'Robbert van de Corput, known professionally as Hardwell, is a Dutch DJ, record producer, and musician. He was voted the World\'s No.1 DJ by DJ Mag in 2013 and 2014. After a brief hiatus, Hardwell made a triumphant return at Ultra Music Festival 2022, showcasing a new, harder sound that has redefined his artistic direction. His productions blend big room house with techno and hardstyle elements.',
    shortBio: 'Two-time #1 DJ in the world, Dutch big room house pioneer',
    country: 'Netherlands',
    genres: ['Big Room House', 'Progressive House', 'Techno', 'Hardstyle'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765810950553_0951fb46.png',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/6BrvowZBreEkXzJQMpL174',
      soundcloud: 'https://soundcloud.com/hardwell',
      instagram: 'https://instagram.com/hardwell',
      twitter: 'https://twitter.com/HARDWELL',
      website: 'https://www.hardwell.com'
    },
    episodes: [
      { episodeNumber: 187, title: 'Art of Rave 187 - Hardwell Guest Mix', date: '2024-03-15' }
    ],
    upcomingAppearances: [
      { event: 'Ultra Music Festival', venue: 'Bayfront Park', location: 'Miami, USA', date: '2025-03-28', ticketUrl: 'https://ultramusicfestival.com' },
      { event: 'Tomorrowland', venue: 'De Schorre', location: 'Boom, Belgium', date: '2025-07-18', ticketUrl: 'https://tomorrowland.com' }
    ],
    stats: { monthlyListeners: '8.5M', followers: '12M', releases: 150 }
  },
  {
    id: 'dimitri-vegas-like-mike',
    name: 'Dimitri Vegas & Like Mike',
    tier: 1,
    bio: 'Dimitri Vegas & Like Mike are a Belgian DJ duo consisting of brothers Dimitri Thivaios and Michael Thivaios. They have been ranked as the World\'s No.1 DJs by DJ Mag multiple times. Known for their energetic performances and massive festival anthems, they are Tomorrowland residents and have produced hits like "Mammoth" and "The Hum".',
    shortBio: 'Belgian brothers, multi-time #1 DJs, Tomorrowland residents',
    country: 'Belgium',
    genres: ['Big Room House', 'Electro House', 'Progressive House'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811005353_836d0dbf.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/0ySbfUxv4Ka6L0V9FHOpgU',
      soundcloud: 'https://soundcloud.com/dimitrivegasandlikemike',
      instagram: 'https://instagram.com/dimitrivegasandlikemike',
      twitter: 'https://twitter.com/dimitaboris',
      website: 'https://dimitrivegasandlikemike.com'
    },
    episodes: [
      { episodeNumber: 175, title: 'Art of Rave 175 - DVLM Takeover', date: '2023-12-22' }
    ],
    upcomingAppearances: [
      { event: 'Tomorrowland Winter', venue: 'Alpe d\'Huez', location: 'France', date: '2025-03-15', ticketUrl: 'https://tomorrowland.com/winter' }
    ],
    stats: { monthlyListeners: '7.2M', followers: '15M', releases: 200 }
  },
  {
    id: 'steve-aoki',
    name: 'Steve Aoki',
    tier: 1,
    bio: 'Steve Aoki is an American DJ, record producer, and music executive. Known for his wild stage antics including crowd surfing in rafts and throwing cakes at audiences, Aoki has built Dim Mak Records into a powerhouse label. He has collaborated with artists across genres and holds the Guinness World Record for the most traveled musician in a single calendar year.',
    shortBio: 'American DJ, Dim Mak founder, cake-throwing legend',
    country: 'United States',
    genres: ['Electro House', 'Bass House', 'Future Bass'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765810949221_990ecc0d.png',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/77AiFEVeAVj2ORpC85QVJs',
      soundcloud: 'https://soundcloud.com/steveaoki',
      instagram: 'https://instagram.com/steveaoki',
      twitter: 'https://twitter.com/steveaoki',
      website: 'https://steveaoki.com'
    },
    episodes: [
      { episodeNumber: 165, title: 'Art of Rave 165 - Steve Aoki Special', date: '2023-10-13' }
    ],
    upcomingAppearances: [
      { event: 'EDC Las Vegas', venue: 'Las Vegas Motor Speedway', location: 'Las Vegas, USA', date: '2025-05-16', ticketUrl: 'https://lasvegas.electricdaisycarnival.com' }
    ],
    stats: { monthlyListeners: '6.8M', followers: '18M', releases: 180 }
  },
  {
    id: 'nicky-romero',
    name: 'Nicky Romero',
    tier: 1,
    bio: 'Nick Rotteveel, known as Nicky Romero, is a Dutch DJ and music producer. He founded Protocol Recordings and has produced chart-topping hits like "Toulouse" and "I Could Be the One" with Avicii. Known for his melodic progressive house sound, Romero has collaborated with industry giants and continues to evolve his sound.',
    shortBio: 'Dutch producer, Protocol Recordings founder, progressive house master',
    country: 'Netherlands',
    genres: ['Progressive House', 'Electro House', 'Future Rave'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765810950651_c3de05bb.png',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/5ChF3i92IPZHduM7jN3dpg',
      soundcloud: 'https://soundcloud.com/nickyromero',
      instagram: 'https://instagram.com/nickyromero',
      twitter: 'https://twitter.com/nickyromero',
      website: 'https://nickyromero.com'
    },
    episodes: [
      { episodeNumber: 192, title: 'Art of Rave 192 - Nicky Romero Guest Mix', date: '2024-04-19' }
    ],
    upcomingAppearances: [
      { event: 'Protocol Recordings Night', venue: 'Ziggo Dome', location: 'Amsterdam, Netherlands', date: '2025-04-12' }
    ],
    stats: { monthlyListeners: '5.5M', followers: '8M', releases: 120 }
  },
  {
    id: 'showtek',
    name: 'Showtek',
    tier: 1,
    bio: 'Showtek is a Dutch DJ duo consisting of brothers Wouter and Sjoerd Janssen. Originally hardstyle producers, they transitioned to electro and big room house, creating massive hits like "Booyah" and "Bad". Their energetic performances and versatile production style have made them festival favorites worldwide.',
    shortBio: 'Dutch DJ duo, hardstyle pioneers turned big room kings',
    country: 'Netherlands',
    genres: ['Big Room House', 'Electro House', 'Hardstyle'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765810951532_0cf39e6c.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/7rftCSetkU4UK2AtJJbRBBw',
      soundcloud: 'https://soundcloud.com/showtekofficialmusic',
      instagram: 'https://instagram.com/showtekofficialmusic',
      twitter: 'https://twitter.com/ABORDEAUX',
      website: 'https://showtek.nl'
    },
    episodes: [
      { episodeNumber: 158, title: 'Art of Rave 158 - Showtek Brothers Mix', date: '2023-08-25' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '4.2M', followers: '6M', releases: 100 }
  },
  {
    id: 'ferry-corsten',
    name: 'Ferry Corsten',
    tier: 1,
    bio: 'Ferry Corsten is a Dutch DJ and producer, considered one of the founding fathers of trance music. Under various aliases including System F and Gouryella, he has shaped the trance genre for over two decades. His track "Out of the Blue" remains a trance anthem, and his Gouryella project continues to deliver euphoric productions.',
    shortBio: 'Dutch trance legend, Gouryella creator, genre pioneer',
    country: 'Netherlands',
    genres: ['Trance', 'Progressive Trance', 'Uplifting Trance'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765810950958_c0599972.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/0hqAWKZDhuOfFb6aK002Ph',
      soundcloud: 'https://soundcloud.com/ferrycorsten',
      instagram: 'https://instagram.com/ferrycorsten',
      twitter: 'https://twitter.com/FerryCorsten',
      website: 'https://ferrycorsten.com'
    },
    episodes: [
      { episodeNumber: 200, title: 'Art of Rave 200 - Ferry Corsten Anniversary Mix', date: '2024-06-07' }
    ],
    upcomingAppearances: [
      { event: 'A State of Trance', venue: 'Jaarbeurs', location: 'Utrecht, Netherlands', date: '2025-02-22', ticketUrl: 'https://astateoftrance.com' }
    ],
    stats: { monthlyListeners: '2.8M', followers: '3M', releases: 250 }
  },
  {
    id: 'robin-schulz',
    name: 'Robin Schulz',
    tier: 1,
    bio: 'Robin Schulz is a German DJ and record producer known for his deep house and tropical house sound. His remix of "Waves" and original track "Sugar" became international hits, bringing melodic house music to mainstream audiences. His smooth, summery productions have earned him multiple platinum certifications.',
    shortBio: 'German DJ, deep house hitmaker, "Sugar" producer',
    country: 'Germany',
    genres: ['Deep House', 'Tropical House', 'Dance Pop'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765810952079_14a6e98f.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/3t5xRXzsuZmMDkQzgOX35S',
      soundcloud: 'https://soundcloud.com/robin-schulz',
      instagram: 'https://instagram.com/robin__schulz',
      twitter: 'https://twitter.com/robin_schulz',
      website: 'https://robin-schulz.com'
    },
    episodes: [
      { episodeNumber: 145, title: 'Art of Rave 145 - Robin Schulz Summer Mix', date: '2023-06-02' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '12M', followers: '5M', releases: 80 }
  },

  // ============================================
  // TIER 2 - MAJOR ARTISTS
  // ============================================
  {
    id: 'darude',
    name: 'Darude',
    tier: 2,
    bio: 'Ville Virtanen, known as Darude, is a Finnish DJ and producer who created one of the most iconic dance tracks ever - "Sandstorm". Released in 1999, it became a global phenomenon and internet meme. Beyond the memes, Darude continues to produce quality trance and progressive house music.',
    shortBio: 'Finnish producer, creator of the legendary "Sandstorm"',
    country: 'Finland',
    genres: ['Trance', 'Progressive House', 'Eurodance'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765810952774_68f840ab.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/0Y7Dkeub4bMewOGkbfOVga',
      soundcloud: 'https://soundcloud.com/darikiofficial',
      instagram: 'https://instagram.com/daabordeauxofficial',
      twitter: 'https://twitter.com/darude'
    },
    episodes: [
      { episodeNumber: 130, title: 'Art of Rave 130 - Darude Guest Mix', date: '2023-02-17' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '3.5M', followers: '1.2M', releases: 60 }
  },
  {
    id: 'bassjackers',
    name: 'Bassjackers',
    tier: 2,
    bio: 'Bassjackers is a Dutch DJ duo consisting of Marlon Flohr and Ralph van Hilst. Known for their high-energy big room and electro house productions, they have released tracks on major labels including Spinnin\' Records and Revealed Recordings. Their collaboration "Crackin" with Martin Garrix was a breakthrough hit.',
    shortBio: 'Dutch duo, big room specialists, festival favorites',
    country: 'Netherlands',
    genres: ['Big Room House', 'Electro House', 'Future House'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765810954425_4e430afd.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/2Z7UcsdweVlRbAk5wfcc9Z',
      soundcloud: 'https://soundcloud.com/bassjackers',
      instagram: 'https://instagram.com/bassjackers',
      twitter: 'https://twitter.com/BASSJACKERS'
    },
    episodes: [
      { episodeNumber: 178, title: 'Art of Rave 178 - Bassjackers Takeover', date: '2024-01-12' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '2.1M', followers: '2.5M', releases: 150 }
  },
  {
    id: 'martin-jensen',
    name: 'Martin Jensen',
    tier: 2,
    bio: 'Martin Jensen is a Danish DJ and producer who rose to fame with his hit single "Solo Dance". His tropical and future house productions have a distinctive melodic quality that has earned him billions of streams. He continues to release chart-topping dance music with crossover appeal.',
    shortBio: 'Danish producer, "Solo Dance" hitmaker, melodic house specialist',
    country: 'Denmark',
    genres: ['Future House', 'Tropical House', 'Dance Pop'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811037349_11fb013e.png',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/5wTAi7QkpP6kp8a54lmTOq',
      soundcloud: 'https://soundcloud.com/martinjensen',
      instagram: 'https://instagram.com/martinjensen',
      twitter: 'https://twitter.com/MartinJensenDJ'
    },
    episodes: [
      { episodeNumber: 162, title: 'Art of Rave 162 - Martin Jensen Mix', date: '2023-09-15' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '8M', followers: '2M', releases: 50 }
  },
  {
    id: 'morgan-page',
    name: 'Morgan Page',
    tier: 2,
    bio: 'Morgan Page is an American DJ and producer known for his progressive and electro house productions. A Grammy-nominated artist, he has produced hits like "The Longest Road" and collaborated with major artists. His In The Air podcast has been running for over a decade.',
    shortBio: 'American producer, Grammy nominee, progressive house veteran',
    country: 'United States',
    genres: ['Progressive House', 'Electro House', 'Trance'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811031188_0baee874.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/6vH3QLBap4Uw6dMDqHqGdP',
      soundcloud: 'https://soundcloud.com/mabordeauxpage',
      instagram: 'https://instagram.com/morganpage',
      twitter: 'https://twitter.com/MorganPage',
      website: 'https://morganpage.com'
    },
    episodes: [
      { episodeNumber: 155, title: 'Art of Rave 155 - Morgan Page Guest Mix', date: '2023-08-04' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '1.5M', followers: '800K', releases: 100 }
  },
  {
    id: 'gabry-ponte',
    name: 'Gabry Ponte',
    tier: 2,
    bio: 'Gabry Ponte is an Italian DJ and producer, best known as a member of the Eurodance group Eiffel 65. Their hit "Blue (Da Ba Dee)" became a worldwide phenomenon. As a solo artist, Ponte has continued to produce dance music and remains one of Italy\'s most successful DJs.',
    shortBio: 'Italian DJ, Eiffel 65 member, "Blue (Da Ba Dee)" creator',
    country: 'Italy',
    genres: ['Eurodance', 'Electro House', 'Dance Pop'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811027682_715e514b.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/0BvkDsjIUla7X0k6CSWh1I',
      soundcloud: 'https://soundcloud.com/gabryponte',
      instagram: 'https://instagram.com/gabryponte',
      twitter: 'https://twitter.com/GabryPonte'
    },
    episodes: [
      { episodeNumber: 140, title: 'Art of Rave 140 - Gabry Ponte Italian Mix', date: '2023-04-28' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '4M', followers: '1.5M', releases: 120 }
  },
  {
    id: 'firebeatz',
    name: 'Firebeatz',
    tier: 2,
    bio: 'Firebeatz is a Dutch DJ duo consisting of Tim Smulders and Jurre van Doeselaar. Known for their hard-hitting big room and electro house productions, they have released on labels like Spinnin\' Records and collaborated with major artists including Calvin Harris.',
    shortBio: 'Dutch duo, hard-hitting big room producers',
    country: 'Netherlands',
    genres: ['Big Room House', 'Electro House', 'Bass House'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811080026_56a050ed.png',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/3CjlHNtplJyTf9npxaPl5w',
      soundcloud: 'https://soundcloud.com/firebeatz',
      instagram: 'https://instagram.com/firebeatz',
      twitter: 'https://twitter.com/Firebeatz'
    },
    episodes: [
      { episodeNumber: 168, title: 'Art of Rave 168 - Firebeatz Mix', date: '2023-11-03' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '1.8M', followers: '1.2M', releases: 80 }
  },
  {
    id: 'thomas-gold',
    name: 'Thomas Gold',
    tier: 2,
    bio: 'Thomas Gold is a German DJ and producer known for his progressive and electro house sound. He has released on major labels including Axtone, Size, and Armada. His tracks "Sing2Me" and "Remember" showcased his ability to create emotional, festival-ready anthems.',
    shortBio: 'German producer, progressive house specialist',
    country: 'Germany',
    genres: ['Progressive House', 'Electro House', 'Big Room'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811034790_3671a0d0.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/4Wz2cHhOb8WCMPIjZDjpHV',
      soundcloud: 'https://soundcloud.com/thomasgold',
      instagram: 'https://instagram.com/thomasgold',
      twitter: 'https://twitter.com/Thomas_Gold'
    },
    episodes: [
      { episodeNumber: 152, title: 'Art of Rave 152 - Thomas Gold Guest Mix', date: '2023-07-14' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '900K', followers: '600K', releases: 70 }
  },
  {
    id: 'yves-v',
    name: 'Yves V',
    tier: 2,
    bio: 'Yves V is a Belgian DJ and producer, and one of the resident DJs at Tomorrowland. Known for his energetic big room and progressive house productions, he has been a fixture in the Belgian dance music scene for over a decade. His track "We Got That Cool" with Afrojack was a major hit.',
    shortBio: 'Belgian DJ, Tomorrowland resident, big room specialist',
    country: 'Belgium',
    genres: ['Big Room House', 'Progressive House', 'Electro House'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811042208_cda4930d.png',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/1nJvji2KIlWSseXRSlNYsC',
      soundcloud: 'https://soundcloud.com/yvesv',
      instagram: 'https://instagram.com/yvesv',
      twitter: 'https://twitter.com/YvesVofficial'
    },
    episodes: [
      { episodeNumber: 148, title: 'Art of Rave 148 - Yves V Tomorrowland Mix', date: '2023-06-23' }
    ],
    upcomingAppearances: [
      { event: 'Tomorrowland', venue: 'De Schorre', location: 'Boom, Belgium', date: '2025-07-18' }
    ],
    stats: { monthlyListeners: '1.2M', followers: '800K', releases: 60 }
  },

  // ============================================
  // TIER 3 - RISING STARS
  // ============================================
  {
    id: 'boris-way',
    name: 'Boris Way',
    tier: 3,
    bio: 'Boris Way is a French DJ and producer known for his melodic house and future house productions. His remixes and original tracks have gained support from major DJs, and he continues to build his reputation in the European dance music scene.',
    shortBio: 'French producer, melodic house rising star',
    country: 'France',
    genres: ['Future House', 'Melodic House', 'Deep House'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811043391_2a7ea5ab.png',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/4qNnBaZr0eDIGpfPfVrfQR',
      soundcloud: 'https://soundcloud.com/borisway',
      instagram: 'https://instagram.com/boriswaymusic'
    },
    episodes: [
      { episodeNumber: 195, title: 'Art of Rave 195 - Boris Way Mix', date: '2024-05-10' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '500K', followers: '150K', releases: 30 }
  },
  {
    id: 'kream',
    name: 'KREAM',
    tier: 3,
    bio: 'KREAM is a Norwegian DJ duo consisting of brothers Daniel and Markus Slettebakken. Known for their deep house and future bass productions, they gained recognition with their remix of "Creepin" and continue to release melodic dance music.',
    shortBio: 'Norwegian duo, deep house and future bass producers',
    country: 'Norway',
    genres: ['Deep House', 'Future Bass', 'Dance Pop'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811035180_bdf12f9d.jpg',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/1PFSt1FfPJPdFuaAZVHFBL',
      soundcloud: 'https://soundcloud.com/kabordeauxeamofficial',
      instagram: 'https://instagram.com/kreamofficial'
    },
    episodes: [
      { episodeNumber: 182, title: 'Art of Rave 182 - KREAM Guest Mix', date: '2024-02-09' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '3M', followers: '300K', releases: 25 }
  },
  {
    id: 'liquid-five',
    name: 'Liquid Five',
    tier: 3,
    bio: 'Liquid Five is a rising DJ and producer known for energetic house music productions. With a growing catalog of releases on respected labels, they are building a reputation for quality dance floor tracks.',
    shortBio: 'Rising house music producer',
    country: 'Germany',
    genres: ['House', 'Tech House', 'Progressive House'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811113312_0cf778bd.png',
    socialLinks: {
      soundcloud: 'https://soundcloud.com/liquidfive',
      instagram: 'https://instagram.com/liquidfive'
    },
    episodes: [
      { episodeNumber: 172, title: 'Art of Rave 172 - Liquid Five Mix', date: '2023-12-01' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '100K', followers: '50K', releases: 20 }
  },
  {
    id: 'zonderling',
    name: 'Zonderling',
    tier: 3,
    bio: 'Zonderling is a Dutch DJ duo known for their unique blend of house music with quirky, melodic elements. Their track "Tunnel Vision" with Dirty South was a breakthrough hit, and they continue to release innovative dance music.',
    shortBio: 'Dutch duo, quirky melodic house producers',
    country: 'Netherlands',
    genres: ['House', 'Progressive House', 'Melodic House'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811114532_a2604ea5.png',
    socialLinks: {
      spotify: 'https://open.spotify.com/artist/5HA5aLY3jJV7eimXWkRBBp',
      soundcloud: 'https://soundcloud.com/zonderlingofficial',
      instagram: 'https://instagram.com/zonderlingofficial'
    },
    episodes: [
      { episodeNumber: 160, title: 'Art of Rave 160 - Zonderling Mix', date: '2023-09-01' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '1.5M', followers: '200K', releases: 35 }
  },
  {
    id: 'the-criminal-sound',
    name: 'The Criminal Sound',
    tier: 3,
    bio: 'The Criminal Sound is a DJ and producer bringing dark, driving techno and tech house to the underground scene. With a focus on raw, energetic productions, they are carving out a niche in the electronic music world.',
    shortBio: 'Underground techno and tech house producer',
    country: 'Spain',
    genres: ['Techno', 'Tech House', 'Dark Techno'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811116964_72033fc5.png',
    socialLinks: {
      soundcloud: 'https://soundcloud.com/thecriminalsound',
      instagram: 'https://instagram.com/thecriminalsound'
    },
    episodes: [
      { episodeNumber: 188, title: 'Art of Rave 188 - The Criminal Sound Mix', date: '2024-03-22' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '50K', followers: '30K', releases: 15 }
  },
  {
    id: 'lexley',
    name: 'Lexley',
    tier: 3,
    bio: 'Lexley is a rising talent in the house music scene, known for groovy, bass-driven productions. With releases on respected labels and growing DJ support, Lexley is an artist to watch.',
    shortBio: 'Rising house music talent',
    country: 'United Kingdom',
    genres: ['House', 'Bass House', 'UK Garage'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811139575_6c375660.png',
    socialLinks: {
      soundcloud: 'https://soundcloud.com/lexley',
      instagram: 'https://instagram.com/lexleymusic'
    },
    episodes: [
      { episodeNumber: 176, title: 'Art of Rave 176 - Lexley Guest Mix', date: '2023-12-29' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '80K', followers: '40K', releases: 18 }
  },
  {
    id: 'fovos',
    name: 'FOVOS',
    tier: 3,
    bio: 'FOVOS is a producer pushing the boundaries of bass music and future house. With a unique sound design approach and hard-hitting productions, FOVOS is making waves in the electronic music community.',
    shortBio: 'Bass music and future house innovator',
    country: 'Greece',
    genres: ['Future House', 'Bass House', 'Electro House'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811107466_a5eec17e.jpg',
    socialLinks: {
      soundcloud: 'https://soundcloud.com/fovosmusic',
      instagram: 'https://instagram.com/fovosmusic'
    },
    episodes: [
      { episodeNumber: 190, title: 'Art of Rave 190 - FOVOS Mix', date: '2024-04-05' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '60K', followers: '25K', releases: 12 }
  },
  {
    id: 'sebastiaan-hooft',
    name: 'Sebastiaan Hooft',
    tier: 3,
    bio: 'Sebastiaan Hooft is a Dutch DJ and producer with a passion for melodic progressive house. His emotional productions and DJ sets have earned him a dedicated following in the Netherlands and beyond.',
    shortBio: 'Dutch melodic progressive house producer',
    country: 'Netherlands',
    genres: ['Progressive House', 'Melodic House', 'Trance'],
    imageUrl: 'https://d64gsuwffb70l.cloudfront.net/692727738d1c8dbd5ed78de0_1765811108068_f6e785bb.jpg',
    socialLinks: {
      soundcloud: 'https://soundcloud.com/sebastiaanhooft',
      instagram: 'https://instagram.com/sebastiaanhooft'
    },
    episodes: [
      { episodeNumber: 184, title: 'Art of Rave 184 - Sebastiaan Hooft Mix', date: '2024-02-23' }
    ],
    upcomingAppearances: [],
    stats: { monthlyListeners: '40K', followers: '20K', releases: 10 }
  }
];

// Helper function to get DJ by ID
export const getDJById = (id: string): GuestDJ | undefined => {
  return guestDJsData.find(dj => dj.id === id);
};

// Helper function to get DJ by name
export const getDJByName = (name: string): GuestDJ | undefined => {
  return guestDJsData.find(dj => dj.name.toLowerCase() === name.toLowerCase());
};
