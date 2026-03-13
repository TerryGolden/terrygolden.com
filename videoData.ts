export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId?: string;
  videoUrl?: string;
  description: string;
  releaseDate: string;
  views: string;
  duration: string;
  type: 'official' | 'live' | 'short' | 'mix';
  year: number;
}


export const videos: Video[] = [
  {
    id: '1',
    title: 'Melodic Techno in Abandoned Ibiza Club',
    thumbnail: 'https://i.ytimg.com/vi/N4aZwQKtaCs/hqdefault.jpg',
    youtubeId: 'N4aZwQKtaCs',
    description: 'An immersive melodic techno set filmed in an abandoned club in Ibiza, showcasing Terry Golden\'s signature progressive sound.',
    releaseDate: 'October 2024',
    views: '59K',
    duration: '1:02:11',
    type: 'live',
    year: 2024
  },
  {
    id: '2',
    title: 'GOLDEN Demo Session EP3 - Melodic Techno & Progressive Mix',
    thumbnail: 'https://i.ytimg.com/vi/iDPD91d8sZM/hqdefault.jpg',
    youtubeId: 'iDPD91d8sZM',
    description: '1 hour of melodic techno and progressive house featuring unreleased tracks and exclusive edits.',
    releaseDate: 'August 2024',
    views: '57K',
    duration: '1:03:56',
    type: 'mix',
    year: 2024
  },
  {
    id: '3',
    title: 'GOLDEN Demo Session EP2 - Melodic Techno & Progressive Mix',
    thumbnail: 'https://i.ytimg.com/vi/8D1-NcqIPcU/hqdefault.jpg',
    youtubeId: '8D1-NcqIPcU',
    description: 'Second episode of the GOLDEN Demo Session series featuring cutting-edge progressive house.',
    releaseDate: 'May 2024',
    views: '9.3K',
    duration: '59:28',
    type: 'mix',
    year: 2024
  },
  {
    id: '4',
    title: 'GOLDEN Demo Session EP1 - Melodic Techno & Progressive Mix',
    thumbnail: 'https://i.ytimg.com/vi/A-k68v9cE-s/hqdefault.jpg',
    youtubeId: 'A-k68v9cE-s',
    description: 'The first episode of Terry Golden\'s GOLDEN Demo Session, featuring 1 hour of melodic techno.',
    releaseDate: 'April 2024',
    views: '29K',
    duration: '55:56',
    type: 'mix',
    year: 2024
  },
  {
    id: '5',
    title: 'Live from Ultra Miami 2023',
    thumbnail: 'https://i.ytimg.com/vi/urahEgBAxgI/hqdefault.jpg',
    youtubeId: 'urahEgBAxgI',
    description: 'Terry Golden\'s electrifying performance at Ultra Music Festival Miami 2023.',
    releaseDate: 'March 2023',
    views: '868',
    duration: '11:48',
    type: 'live',
    year: 2023
  },
  {
    id: '6',
    title: 'Space - Official Music Video',
    thumbnail: 'https://i.ytimg.com/vi/OMbfQA5UQSo/hqdefault.jpg',
    youtubeId: 'OMbfQA5UQSo',
    description: 'Official music video for "Space" by Terry Golden.',
    releaseDate: 'October 2024',
    views: '383',
    duration: '0:30',
    type: 'short',
    year: 2024
  },
  {
    id: '7',
    title: 'Walk Like An Egyptian - Official Video',
    thumbnail: 'https://i.ytimg.com/vi/5LvpUlidIew/hqdefault.jpg',
    youtubeId: '5LvpUlidIew',
    description: 'Official video for Terry Golden\'s "Walk Like An Egyptian" remix.',
    releaseDate: 'September 2024',
    views: '469',
    duration: '0:30',
    type: 'short',
    year: 2024
  },
  {
    id: '8',
    title: 'Another Life - Live from Ministry of Sound',
    thumbnail: 'https://i.ytimg.com/vi/S6e8DUANZY0/hqdefault.jpg',
    youtubeId: 'S6e8DUANZY0',
    description: 'Live performance of "Another Life" from the legendary Ministry of Sound in London.',
    releaseDate: 'October 2024',
    views: '294',
    duration: '0:30',
    type: 'short',
    year: 2024

  },
  {
    id: '9',
    title: 'Another Life - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AHUYjuVOLsm3zNA_8xpesno/LIve%20shots/Live%20DJ%20MOS_3.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AO-yj2VlRJZPpr359a-czkw/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Another%20Life.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Live performance of "Another Life" at Ministry of Sound, London',
    releaseDate: 'November 2024',
    views: '1.2K',
    duration: '2:45',
    type: 'live',
    year: 2024
  },
  {
    id: '10',
    title: 'Bring Me To Life - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/ACD_MDkj63RY2kINovXGp7Q/LIve%20shots/Live%20DJ%20MOS_4.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AOp-mZDlB6ezXG5-rLBdvRA/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Bring%20me%20to%20life.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Electrifying performance of "Bring Me To Life" at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '980',
    duration: '2:42',
    type: 'live',
    year: 2024
  },
  {
    id: '11',
    title: 'Cola Rework - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AP-mKtSECVMeeZKtq3tWiG8/LIve%20shots/Live%20DJ%20MOS_5%20.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AHxVFir5dp35yq1e3Ewww00/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Cola%20rework.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Terry Golden\'s unique rework of "Cola" live at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '1.5K',
    duration: '3:12',
    type: 'live',
    year: 2024
  },
  {
    id: '12',
    title: 'Don\'t Let Me Go Edit - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/ACoEjP2-A80cEv1LPqCUIxA/LIve%20shots/Live%20DJ%20MOS_6.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AGUx9tgAcyN9ePaijhkV8Tc/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Dont%20let%20me%20go%20edit.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Exclusive edit of "Don\'t Let Me Go" performed live',
    releaseDate: 'November 2024',
    views: '850',
    duration: '1:28',
    type: 'live',
    year: 2024

  },
  {
    id: '13',
    title: 'Don\'t Wake Me Up - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AAETmw_tOXTNvphv7HPIb-A/LIve%20shots/Live%20DJ%20MOS_7.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AING9U5Cskki04KH50IrFIs/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Dont%20wake%20me%20up.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Powerful performance of "Don\'t Wake Me Up" live at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '1.1K',
    duration: '2:18',
    type: 'live',
    year: 2024
  },
  {
    id: '14',
    title: 'Faded Rework - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AJEoMJuKmfTrE5-8Y9R25x4/LIve%20shots/Live%20DJ%20MOS_8.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AEPN6ySQV8Y2MKjMC1rAaG8/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Faded%20rework.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Terry Golden\'s progressive rework of "Faded" at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '1.3K',
    duration: '1:45',
    type: 'live',
    year: 2024
  },
  {
    id: '15',
    title: 'For A Feeling Rework - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AIVX0QzlO5SnVQYKkaL4k0A/LIve%20shots/Live%20DJ%20MOS_9.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/APHX-YzFJrU5GuySsATkhZg/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20For%20a%20feeling%20rework.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Emotional rework of "For A Feeling" performed live',
    releaseDate: 'November 2024',
    views: '1.4K',
    duration: '2:50',
    type: 'live',
    year: 2024
  },
  {
    id: '16',
    title: 'Hold Me Now - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AL9AIWPM_JCjLw9_NbQIlWU/LIve%20shots/Live%20DJ%20MOS_10.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/ACAh7bX-CndsYxujjY6z_pA/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Hold%20me%20now.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Captivating performance of "Hold Me Now" at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '1.6K',
    duration: '2:48',
    type: 'live',
    year: 2024

  },
  {
    id: '17',
    title: 'Innerbloom - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AFgGWk7HAnr4oxbYFrmuYyc/LIve%20shots/Live%20DJ%20MOS_2.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AOnSyK5aUERKFEfPB_N6Ziw/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Innerbloom.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Epic performance of "Innerbloom" at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '2.1K',
    duration: '3:12',
    type: 'live',
    year: 2024
  },
  {
    id: '18',
    title: 'Innerbloom 2 - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AG7YVuXFMyPXpTO-_ACoxeo/LIve%20shots/Live%20DJ%20MOS_1.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AH63s3Kqb3obp0UeAojEo9U/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Innerbloom%202.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Extended version of "Innerbloom" live at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '1.8K',
    duration: '2:28',
    type: 'live',
    year: 2024
  },
  {
    id: '19',
    title: 'Last One Edit - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AHUYjuVOLsm3zNA_8xpesno/LIve%20shots/Live%20DJ%20MOS_3.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AOE5ZEsy3CqC75waB-F31dg/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Last%20One%20edit.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Exclusive edit of "Last One" performed live',
    releaseDate: 'November 2024',
    views: '920',
    duration: '1:05',
    type: 'live',
    year: 2024
  },
  {
    id: '20',
    title: 'Let\'s Go x Satisfaction - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/ACD_MDkj63RY2kINovXGp7Q/LIve%20shots/Live%20DJ%20MOS_4.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/ACzxPca81dJcSke4HAxYc8k/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Lets%20Go%20x%20Satisfaction.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Explosive mashup of "Let\'s Go" and "Satisfaction" live',
    releaseDate: 'November 2024',
    views: '1.7K',
    duration: '1:43',
    type: 'live',
    year: 2024

  },
  {
    id: '21',
    title: 'Mashup Intro - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AP-mKtSECVMeeZKtq3tWiG8/LIve%20shots/Live%20DJ%20MOS_5%20.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AIeyXakBIwLwVOgjg5T7iWA/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Mashup%20Intro.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'High-energy mashup intro at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '1.9K',
    duration: '1:56',
    type: 'live',
    year: 2024
  },
  {
    id: '22',
    title: 'Numb Edit - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/ACoEjP2-A80cEv1LPqCUIxA/LIve%20shots/Live%20DJ%20MOS_6.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/ALOCxmg3wrs1OEiEPLGyRgU/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Numb%20edit.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Powerful edit of "Numb" performed live at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '2.3K',
    duration: '2:51',
    type: 'live',
    year: 2024
  },
  {
    id: '23',
    title: 'Obsession - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AAETmw_tOXTNvphv7HPIb-A/LIve%20shots/Live%20DJ%20MOS_7.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/APvlIYlU81U6Td16yXaUE6Q/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20Obsession.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Mesmerizing performance of "Obsession" at Ministry of Sound',
    releaseDate: 'November 2024',
    views: '2.5K',
    duration: '2:57',
    type: 'live',
    year: 2024
  },
  {
    id: '24',
    title: 'People Are People Rework - Ministry of Sound London',
    thumbnail: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AJEoMJuKmfTrE5-8Y9R25x4/LIve%20shots/Live%20DJ%20MOS_8.jpg?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    videoUrl: 'https://www.dropbox.com/scl/fo/xyfj5g2ipqq09cfypft9w/AFjEpdJYKLejzMZn3bWZ8Io/Live%20Videos/Terry%20Golden%2C%20London%2C%20Ministry%20of%20Sound%20-%20People%20are%20People%20rework.mov?rlkey=011xzugx1d4qg77qx9uw585tk&raw=1',
    description: 'Terry Golden\'s unique rework of "People Are People" live',
    releaseDate: 'November 2024',
    views: '2.0K',
    duration: '2:33',
    type: 'live',
    year: 2024
  }
];




