// Cloudflare Workers API Configuration
// These URLs will be updated with your actual worker endpoints

// DEMO MODE FLAG - Set to false when connecting to real API
const DEMO_MODE = true;

// Demo/Mock Data for testing
const DEMO_MOVIES = [
  {
    id: 'demo-movie-1',
    type: 'movie',
    title: 'Inception',
    title_fa: 'تلقین',
    slug: 'inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    description_fa: 'دزدی که با استفاده از فناوری اشتراک رویا اسرار شرکتی را می‌دزدد، وظیفه معکوس کاشتن یک ایده را در ذهن مدیر عامل دریافت می‌کند.',
    poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop',
    year: 2010,
    imdb_rating: 8.8,
    genres: ['action', 'sciFi', 'thriller'],
    quality: '1080p BluRay',
    views: 125000,
    country: 'US',
    director: 'Christopher Nolan',
    director_fa: 'کریستوفر نولان',
    language: 'English',
    language_fa: 'انگلیسی',
    duration: 148,
    trailer_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy',
    actors_fa: 'لئوناردو دی‌کاپریو، جوزف گوردون-لویت، الیوت پیج، تام هاردی',
    cast_json: [
      { name: 'Leonardo DiCaprio', character: 'Dom Cobb', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { name: 'Joseph Gordon-Levitt', character: 'Arthur', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { name: 'Elliot Page', character: 'Ariadne', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
      { name: 'Tom Hardy', character: 'Eames', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
    ],
    downloadLinks: [
      { quality: '480p', size: '450 MB', url: '#demo-download-480p' },
      { quality: '720p', size: '950 MB', url: '#demo-download-720p' },
      { quality: '1080p', size: '2.1 GB', url: '#demo-download-1080p' },
    ],
    streamUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
    subtitle_link: '#demo-subtitle',
  },
  {
    id: 'demo-movie-2',
    type: 'movie',
    title: 'The Dark Knight',
    title_fa: 'شوالیه تاریکی',
    slug: 'the-dark-knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    description_fa: 'وقتی تهدیدی به نام جوکر در میان مردم گاتهام خرابکاری و آشوب ایجاد می‌کند، بتمن باید یکی از بزرگترین آزمون‌های روانی و فیزیکی توانایی خود را برای مبارزه با بی‌عدالتی بپذیرد.',
    poster_url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop',
    year: 2008,
    imdb_rating: 9.0,
    genres: ['action', 'drama', 'crime'],
    quality: '4K BluRay',
    views: 250000,
    country: 'US',
    director: 'Christopher Nolan',
    director_fa: 'کریستوفر نولان',
    language: 'English',
    language_fa: 'انگلیسی',
    duration: 152,
    trailer_url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    actors: 'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine',
    actors_fa: 'کریستین بیل، هیث لجر، آرون اکهارت، مایکل کین',
    cast_json: [
      { name: 'Christian Bale', character: 'Bruce Wayne / Batman', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { name: 'Heath Ledger', character: 'The Joker', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { name: 'Aaron Eckhart', character: 'Harvey Dent', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
      { name: 'Michael Caine', character: 'Alfred', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
    ],
    downloadLinks: [
      { quality: '720p', size: '1.2 GB', url: '#demo-download-720p' },
      { quality: '1080p', size: '2.5 GB', url: '#demo-download-1080p' },
      { quality: '4K', size: '8.0 GB', url: '#demo-download-4k' },
    ],
    streamUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    subtitle_link: '#demo-subtitle',
  },
  {
    id: 'demo-movie-3',
    type: 'movie',
    title: 'Interstellar',
    title_fa: 'در میان ستارگان',
    slug: 'interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as Earth becomes uninhabitable.',
    description_fa: 'تیمی از کاوشگران از طریق کرم‌چاله‌ای در فضا سفر می‌کنند تا بقای بشریت را با نزدیک شدن زمین به غیرقابل سکونت بودن تضمین کنند.',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=600&fit=crop',
    year: 2014,
    imdb_rating: 8.7,
    genres: ['sciFi', 'drama', 'adventure'],
    quality: '4K BluRay',
    views: 180000,
    country: 'US',
    director: 'Christopher Nolan',
    director_fa: 'کریستوفر نولان',
    language: 'English',
    language_fa: 'انگلیسی',
    duration: 169,
    trailer_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
    actors_fa: 'متیو مک‌کانهی، آن هاثاوی، جسیکا چستین، مایکل کین',
    cast_json: [
      { name: 'Matthew McConaughey', character: 'Cooper', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { name: 'Anne Hathaway', character: 'Brand', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
      { name: 'Jessica Chastain', character: 'Murph', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
      { name: 'Michael Caine', character: 'Professor Brand', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
    ],
    downloadLinks: [
      { quality: '720p', size: '1.5 GB', url: '#demo-download-720p' },
      { quality: '1080p', size: '3.2 GB', url: '#demo-download-1080p' },
      { quality: '4K', size: '12.0 GB', url: '#demo-download-4k' },
    ],
    streamUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    subtitle_link: '#demo-subtitle',
  },
];

const DEMO_SERIES = [
  {
    id: 'demo-series-1',
    type: 'series',
    title: 'Breaking Bad',
    title_fa: 'بریکینگ بد',
    slug: 'breaking-bad',
    description: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family\'s future.',
    description_fa: 'معلم شیمی که به سرطان ریه غیرقابل درمان مبتلا شده است، برای تامین آینده خانواده‌اش با یک شاگرد سابق به تولید و فروش متامفتامین روی می‌آورد.',
    poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop',
    year: 2008,
    imdb_rating: 9.5,
    genres: ['crime', 'drama', 'thriller'],
    quality: '1080p WEB-DL',
    views: 450000,
    country: 'US',
    status: 'ended',
    director: 'Vince Gilligan',
    director_fa: 'وینس گیلیگان',
    language: 'English',
    language_fa: 'انگلیسی',
    duration: 47,
    trailer_url: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
    actors: 'Bryan Cranston, Aaron Paul, Anna Gunn, Dean Norris',
    actors_fa: 'برایان کرانستون، آرون پل، آنا گان، دین نوریس',
    cast_json: [
      { name: 'Bryan Cranston', character: 'Walter White', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { name: 'Aaron Paul', character: 'Jesse Pinkman', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { name: 'Anna Gunn', character: 'Skyler White', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
      { name: 'Dean Norris', character: 'Hank Schrader', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
    ],
    subtitle_link: '#demo-subtitle',
    seasons: [
      {
        number: 1,
        title: 'Season 1',
        title_fa: 'فصل ۱',
        subtitle_link: '#demo-season-1-subtitle',
        episodes: [
          { episode_number: 1, title: 'Pilot', title_fa: 'پایلوت', stream_link: 'https://www.youtube.com/embed/HhesaQXLuRY', download_links: [
            { quality: '480p', size: '200 MB', url: '#demo-ep1-480p' },
            { quality: '720p', size: '400 MB', url: '#demo-ep1-720p' },
            { quality: '1080p', size: '800 MB', url: '#demo-ep1-1080p' },
          ]},
          { episode_number: 2, title: 'Cat\'s in the Bag...', title_fa: 'گربه در کیسه...', stream_link: '#demo-stream', download_links: [
            { quality: '480p', size: '200 MB', url: '#demo-ep2-480p' },
            { quality: '720p', size: '400 MB', url: '#demo-ep2-720p' },
            { quality: '1080p', size: '800 MB', url: '#demo-ep2-1080p' },
          ]},
          { episode_number: 3, title: '...And the Bag\'s in the River', title_fa: '...و کیسه در رودخانه', stream_link: '#demo-stream', download_links: [
            { quality: '480p', size: '200 MB', url: '#demo-ep3-480p' },
            { quality: '720p', size: '400 MB', url: '#demo-ep3-720p' },
            { quality: '1080p', size: '800 MB', url: '#demo-ep3-1080p' },
          ]},
        ]
      },
      {
        number: 2,
        title: 'Season 2',
        title_fa: 'فصل ۲',
        subtitle_link: '#demo-season-2-subtitle',
        episodes: [
          { episode_number: 1, title: 'Seven Thirty-Seven', title_fa: 'هفت سی و هفت', stream_link: '#demo-stream', download_links: [
            { quality: '480p', size: '200 MB', url: '#demo-s2e1-480p' },
            { quality: '720p', size: '400 MB', url: '#demo-s2e1-720p' },
            { quality: '1080p', size: '800 MB', url: '#demo-s2e1-1080p' },
          ]},
          { episode_number: 2, title: 'Grilled', title_fa: 'کباب شده', stream_link: '#demo-stream', download_links: [
            { quality: '480p', size: '200 MB', url: '#demo-s2e2-480p' },
            { quality: '720p', size: '400 MB', url: '#demo-s2e2-720p' },
            { quality: '1080p', size: '800 MB', url: '#demo-s2e2-1080p' },
          ]},
        ]
      },
    ],
  },
  {
    id: 'demo-series-2',
    type: 'series',
    title: 'Stranger Things',
    title_fa: 'چیزهای عجیب',
    slug: 'stranger-things',
    description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
    description_fa: 'وقتی پسر جوانی ناپدید می‌شود، مادرش، رئیس پلیس و دوستانش باید برای بازگرداندن او با نیروهای ماورایی وحشتناک روبرو شوند.',
    poster_url: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1518331483807-f6adb0e1ad23?w=1200&h=600&fit=crop',
    year: 2016,
    imdb_rating: 8.7,
    genres: ['drama', 'fantasy', 'horror'],
    quality: '4K WEB-DL',
    views: 380000,
    country: 'US',
    status: 'ongoing',
    director: 'The Duffer Brothers',
    director_fa: 'برادران داف',
    language: 'English',
    language_fa: 'انگلیسی',
    duration: 51,
    trailer_url: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
    actors: 'Millie Bobby Brown, Finn Wolfhard, Winona Ryder, David Harbour',
    actors_fa: 'میلی بابی براون، فین ولفهارد، وینونا رایدر، دیوید هاربر',
    cast_json: [
      { name: 'Millie Bobby Brown', character: 'Eleven', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
      { name: 'Finn Wolfhard', character: 'Mike Wheeler', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { name: 'Winona Ryder', character: 'Joyce Byers', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
      { name: 'David Harbour', character: 'Jim Hopper', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
    ],
    subtitle_link: '#demo-subtitle',
    release_day_of_week: 1,
    release_time: '12:00 AM PST',
    seasons: [
      {
        number: 1,
        title: 'Season 1',
        title_fa: 'فصل ۱',
        subtitle_link: '#demo-season-1-subtitle',
        episodes: [
          { episode_number: 1, title: 'Chapter One: The Vanishing of Will Byers', title_fa: 'فصل اول: ناپدید شدن ویل بایرز', stream_link: 'https://www.youtube.com/embed/b9EkMc79ZSU', download_links: [
            { quality: '720p', size: '500 MB', url: '#demo-ep1-720p' },
            { quality: '1080p', size: '1.2 GB', url: '#demo-ep1-1080p' },
            { quality: '4K', size: '4.5 GB', url: '#demo-ep1-4k' },
          ]},
          { episode_number: 2, title: 'Chapter Two: The Weirdo on Maple Street', title_fa: 'فصل دوم: عجیبه خیابان میپل', stream_link: '#demo-stream', download_links: [
            { quality: '720p', size: '500 MB', url: '#demo-ep2-720p' },
            { quality: '1080p', size: '1.2 GB', url: '#demo-ep2-1080p' },
            { quality: '4K', size: '4.5 GB', url: '#demo-ep2-4k' },
          ]},
        ]
      },
    ],
  },
];

// Demo comments with nested replies
const DEMO_COMMENTS = {
  'demo-movie-1': [
    {
      id: 'comment-1',
      name: 'John Smith',
      email: 'john@example.com',
      comment: 'Absolutely mind-blowing! One of Nolan\'s best works. The concept of dreams within dreams is executed perfectly.',
      comment_fa: 'کاملاً خارق‌العاده! یکی از بهترین آثار نولان. مفهوم رویا در رویا به طور کامل اجرا شده است.',
      rating: 5,
      created_at: '2024-03-15T10:30:00Z',
      approved: true,
      replies: [
        {
          id: 'reply-1',
          name: 'Admin',
          comment: 'Thank you for your feedback! We\'re glad you enjoyed it.',
          comment_fa: 'از بازخورد شما متشکریم! خوشحالیم که لذت بردید.',
          created_at: '2024-03-15T14:20:00Z',
          is_admin: true,
        }
      ]
    },
    {
      id: 'comment-2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      comment: 'The visual effects are stunning and the storyline keeps you engaged throughout. A must-watch!',
      comment_fa: 'جلوه‌های بصری خیره‌کننده هستند و خط داستان شما را در تمام مدت درگیر نگه می‌دارد. حتماً ببینید!',
      rating: 5,
      created_at: '2024-03-14T08:15:00Z',
      approved: true,
      replies: [
        {
          id: 'reply-2a',
          name: 'Admin',
          comment: 'Absolutely! The practical effects combined with CGI make it unforgettable.',
          comment_fa: 'کاملاً! جلوه‌های عملی همراه با جلوه‌های کامپیوتری آن را فراموش‌نشدنی می‌کند.',
          created_at: '2024-03-14T10:30:00Z',
          is_admin: true,
        },
        {
          id: 'reply-2b',
          name: 'Mike Chen',
          comment: 'I especially loved the hallway fight scene!',
          comment_fa: 'من به خصوص صحنه مبارزه راهرو را دوست داشتم!',
          created_at: '2024-03-14T12:00:00Z',
          is_admin: false,
        }
      ]
    },
    {
      id: 'comment-3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      comment: 'Great movie but a bit confusing at times. Had to watch it twice to fully understand.',
      comment_fa: 'فیلم عالی اما گاهی کمی گیج‌کننده. مجبور شدم دوبار ببینم تا کاملاً درک کنم.',
      rating: 4,
      created_at: '2024-03-13T16:45:00Z',
      approved: true,
      replies: [
        {
          id: 'reply-2',
          name: 'John Smith',
          comment: 'I agree! The second viewing makes everything click into place.',
          comment_fa: 'موافقم! مشاهده دوم همه چیز را جا می‌اندازد.',
          created_at: '2024-03-13T18:30:00Z',
          is_admin: false,
        },
        {
          id: 'reply-2c',
          name: 'Admin',
          comment: 'That\'s the beauty of Nolan\'s films - they reward multiple viewings!',
          comment_fa: 'این زیبایی فیلم‌های نولان است - با تماشای چندباره پاداش می‌دهند!',
          created_at: '2024-03-13T20:00:00Z',
          is_admin: true,
        }
      ]
    }
  ],
  'demo-movie-2': [
    {
      id: 'comment-4',
      name: 'Emma Watson',
      email: 'emma@example.com',
      comment: 'Heath Ledger\'s performance as the Joker is legendary. This movie sets the bar for superhero films.',
      comment_fa: 'بازی هیث لجر به عنوان جوکر افسانه‌ای است. این فیلم استاندارد فیلم‌های ابرقهرمانی را تعیین می‌کند.',
      rating: 5,
      created_at: '2024-03-12T09:20:00Z',
      approved: true,
      replies: [
        {
          id: 'reply-4a',
          name: 'David Lee',
          comment: 'Agreed! His portrayal is haunting and mesmerizing.',
          comment_fa: 'موافقم! نمایش او وحشتناک و مسحورکننده است.',
          created_at: '2024-03-12T11:45:00Z',
          is_admin: false,
        },
        {
          id: 'reply-4b',
          name: 'Admin',
          comment: 'A performance that will be remembered for generations. RIP Heath Ledger.',
          comment_fa: 'اجرایی که برای نسل‌ها به یاد خواهد ماند. روحش شاد.',
          created_at: '2024-03-12T14:00:00Z',
          is_admin: true,
        }
      ]
    },
    {
      id: 'comment-5',
      name: 'David Lee',
      email: 'david@example.com',
      comment: 'The action sequences are incredible and the story is compelling. Christopher Nolan is a genius!',
      comment_fa: 'سکانس‌های اکشن باورنکردنی و داستان قانع‌کننده است. کریستوفر نولان یک نابغه است!',
      rating: 5,
      created_at: '2024-03-11T13:40:00Z',
      approved: true,
      replies: [
        {
          id: 'reply-3',
          name: 'Admin',
          comment: 'Couldn\'t agree more! Thanks for watching.',
          comment_fa: 'کاملاً موافقم! از تماشای شما متشکریم.',
          created_at: '2024-03-11T15:10:00Z',
          is_admin: true,
        },
        {
          id: 'reply-3a',
          name: 'Emma Watson',
          comment: 'The bank heist opening scene is one of the best in cinema history!',
          comment_fa: 'صحنه آغازین سرقت بانک یکی از بهترین‌ها در تاریخ سینما است!',
          created_at: '2024-03-11T16:30:00Z',
          is_admin: false,
        }
      ]
    }
  ],
  'demo-movie-3': [
    {
      id: 'comment-6',
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      comment: 'A masterpiece! The science, the emotion, the cinematography - everything is perfect.',
      comment_fa: 'یک شاهکار! علم، احساس، فیلمبرداری - همه چیز عالی است.',
      rating: 5,
      created_at: '2024-03-10T11:25:00Z',
      approved: true,
      replies: [
        {
          id: 'reply-6a',
          name: 'Tom Harris',
          comment: 'The docking scene with the music gives me goosebumps every time!',
          comment_fa: 'صحنه اتصال با موسیقی هر بار مو به تنم راست می‌کند!',
          created_at: '2024-03-10T13:00:00Z',
          is_admin: false,
        },
        {
          id: 'reply-6b',
          name: 'Admin',
          comment: 'Hans Zimmer\'s score elevated this film to another level. Truly epic!',
          comment_fa: 'موسیقی هنس زیمر این فیلم را به سطح دیگری برد. واقعاً حماسی!',
          created_at: '2024-03-10T15:30:00Z',
          is_admin: true,
        }
      ]
    }
  ],
  'demo-series-1': [
    {
      id: 'comment-7',
      name: 'Tom Harris',
      email: 'tom@example.com',
      comment: 'Best TV series ever made! Every season is better than the last. Bryan Cranston is phenomenal.',
      comment_fa: 'بهترین سریال تلویزیونی که تا به حال ساخته شده! هر فصل بهتر از قبلی است. برایان کرانستون فوق‌العاده است.',
      rating: 5,
      created_at: '2024-03-09T14:50:00Z',
      approved: true,
      replies: [
        {
          id: 'reply-4',
          name: 'Admin',
          comment: 'It\'s definitely a masterclass in storytelling!',
          comment_fa: 'قطعاً یک کلاس درجه یک در داستان‌سرایی است!',
          created_at: '2024-03-09T16:20:00Z',
          is_admin: true,
        },
        {
          id: 'reply-4a',
          name: 'Rachel Green',
          comment: 'The final episodes are absolutely intense!',
          comment_fa: 'قسمت‌های پایانی کاملاً پرهیجان هستند!',
          created_at: '2024-03-09T18:45:00Z',
          is_admin: false,
        }
      ]
    },
    {
      id: 'comment-8',
      name: 'Rachel Green',
      email: 'rachel@example.com',
      comment: 'The character development is incredible. You really feel for Walter White despite his actions.',
      comment_fa: 'توسعه شخصیت باورنکردنی است. علیرغم اعمالش واقعاً با والتر وایت همدردی می‌کنید.',
      rating: 5,
      created_at: '2024-03-08T10:15:00Z',
      approved: true,
      replies: [
        {
          id: 'reply-8a',
          name: 'Tom Harris',
          comment: 'Jesse Pinkman\'s journey is equally compelling!',
          comment_fa: 'سفر جسی پینکمن به همان اندازه قانع‌کننده است!',
          created_at: '2024-03-08T12:30:00Z',
          is_admin: false,
        },
        {
          id: 'reply-8b',
          name: 'Admin',
          comment: 'The chemistry between the two leads is what makes this show special.',
          comment_fa: 'شیمی بین دو بازیگر اصلی چیزی است که این سریال را خاص می‌کند.',
          created_at: '2024-03-08T14:00:00Z',
          is_admin: true,
        }
      ]
    }
  ],
  'demo-series-2': [
    {
      id: 'comment-9',
      name: 'Alex Turner',
      email: 'alex@example.com',
      comment: 'Perfect blend of horror, sci-fi, and nostalgia. The kids\' performances are outstanding!',
      comment_fa: 'ترکیب کاملی از وحشت، علمی-تخیلی و نوستالژی. بازی بچه‌ها فوق‌العاده است!',
      rating: 5,
      created_at: '2024-03-07T15:30:00Z',
      approved: true,
      replies: [
        {
          id: 'reply-9a',
          name: 'Lisa Anderson',
          comment: 'Millie Bobby Brown is incredible as Eleven!',
          comment_fa: 'میلی بابی براون به عنوان الون باورنکردنی است!',
          created_at: '2024-03-07T17:00:00Z',
          is_admin: false,
        },
        {
          id: 'reply-9b',
          name: 'Admin',
          comment: 'The 80s soundtrack and atmosphere are perfectly executed. Can\'t wait for the next season!',
          comment_fa: 'موسیقی متن و فضای دهه ۸۰ به طور کامل اجرا شده است. نمی‌توانم برای فصل بعدی صبر کنم!',
          created_at: '2024-03-07T19:30:00Z',
          is_admin: true,
        }
      ]
    }
  ]
};

// Demo approved suggestions
const DEMO_SUGGESTIONS = [
  {
    id: 'suggestion-1',
    title: 'The Shawshank Redemption',
    type: 'movie',
    description: 'Would love to see this classic added to the collection!',
    status: 'in_progress',
    notes: 'Working on adding this soon',
    name: 'James Wilson',
    created_at: '2024-03-05T09:00:00Z',
    updated_at: '2024-03-10T14:00:00Z',
  },
  {
    id: 'suggestion-2',
    title: 'Game of Thrones',
    type: 'series',
    description: 'Please add all seasons of Game of Thrones',
    status: 'completed',
    notes: 'Added! Check it out in the series section',
    name: 'Emily Davis',
    created_at: '2024-02-20T11:30:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 'suggestion-3',
    title: 'The Matrix Trilogy',
    type: 'movie',
    description: 'All three Matrix movies would be great',
    status: 'in_progress',
    notes: 'Adding The Matrix series next week',
    name: 'Robert Martinez',
    created_at: '2024-03-08T13:20:00Z',
    updated_at: '2024-03-12T09:00:00Z',
  },
  {
    id: 'suggestion-4',
    title: 'Better Search Filters',
    type: 'website',
    description: 'It would be great to filter by multiple genres at once',
    status: 'completed',
    notes: 'Multi-genre filter has been implemented!',
    name: 'Admin',
    created_at: '2024-02-15T08:00:00Z',
    updated_at: '2024-02-28T16:00:00Z',
  },
  {
    id: 'suggestion-5',
    title: 'The Lord of the Rings Extended Edition',
    type: 'movie',
    description: 'Extended editions of LOTR trilogy would be amazing',
    status: 'in_progress',
    notes: 'Working on securing the extended editions',
    name: 'Chris Brown',
    created_at: '2024-03-11T10:45:00Z',
    updated_at: '2024-03-14T11:30:00Z',
  },
  {
    id: 'suggestion-6',
    title: 'Dark Mode Toggle',
    type: 'website',
    description: 'Add a light/dark mode toggle option',
    status: 'rejected',
    notes: 'The site is optimized for dark mode viewing experience',
    name: 'Sophia Taylor',
    created_at: '2024-03-01T14:00:00Z',
    updated_at: '2024-03-03T09:00:00Z',
  },
];

export const API_CONFIG = {
  // DEMO MODE: These are placeholder API endpoints
  // Replace these with your actual Cloudflare Worker URLs when deploying
  MEDIA_LIST: 'https://your-media-list-worker.workers.dev/',
  MEDIA_DETAIL: 'https://your-media-detail-worker.workers.dev/',
  SEARCH: 'https://your-search-worker.workers.dev/',
  HOMEPAGE: 'https://your-homepage-worker.workers.dev/',
  COMMENTS: 'https://your-comments-worker.workers.dev/',
  CONTACT: 'https://your-contact-worker.workers.dev/contact',
  SUGGESTIONS: 'https://your-contact-worker.workers.dev/suggestions',
  SUGGESTIONS_APPROVED: 'https://your-contact-worker.workers.dev/suggestions/approved',

  // Admin Worker - Full CRUD control
  ADMIN_API: 'https://your-admin-worker.workers.dev',

  // Captcha Configuration - Replace with your own captcha solution
  TURNSTILE_SITE_KEY: 'DEMO_MODE',
};

// Helper function to transform worker data to frontend format
const transformMediaItem = (item: any) => {
  // Determine type from data if not explicitly set
  // If seasons exist, it's a series; otherwise it's a movie
  const mediaType = item.type || (item.seasons && item.seasons.length > 0 ? 'series' : 'movie');
  
  // Transform seasons structure from database format to frontend format
  let transformedSeasons = [];
  if (item.seasons && Array.isArray(item.seasons)) {
    transformedSeasons = item.seasons.map((season: any) => ({
      // Worker already returns 'number', not 'season_number'
      number: season.number || season.season_number,
      title: {
        en: season.title || `Season ${season.number || season.season_number}`,
        fa: season.title_fa || `فصل ${season.number || season.season_number}`
      },
      subtitle_link: season.subtitle_link || '',
      episodes: (season.episodes || []).map((episode: any) => ({
        number: episode.episode_number,
        title: {
          en: episode.title || `Episode ${episode.episode_number}`,
          fa: episode.title_fa || `قسمت ${episode.episode_number}`
        },
        streamUrl: episode.stream_link || '',
        downloadLinks: (() => {
          if (!episode.download_links) return [];
          if (typeof episode.download_links === 'string') {
            try {
              return JSON.parse(episode.download_links);
            } catch (e) {
              console.error('Failed to parse episode download_links:', e);
              return [];
            }
          }
          return episode.download_links;
        })()
      }))
    }));
  }
  
  return {
    id: item.id,
    type: mediaType,
    title: { 
      en: item.title || item.title_en || '', 
      fa: item.title_fa || '' 
    },
    description: { 
      en: item.description || item.description_en || '', 
      fa: item.description_fa || '' 
    },
    poster: item.poster_url || item.poster || '',
    backdrop: item.backdrop_url || item.backdrop || '',
    year: item.year,
    rating: item.imdb_rating || item.rating || 0,
    genres: typeof item.genres === 'string' ? item.genres.split(',').map((g: string) => g.trim()) : (item.genres || []),
    quality: item.quality || '',
    trailerUrl: item.trailer_url || item.trailerUrl || '',
    director: item.director || '',
    director_fa: item.director_fa || '',
    country: item.country || '',
    language: item.language || '',
    language_fa: item.language_fa || '',
    views: item.views || 0,
    actors: item.actors || [],
    actors_fa: item.actors_fa || '',
    // Include new structured cast data
    cast_json: item.cast_json || null,
    cast_fa_json: item.cast_fa_json || null,
    slug: item.slug || '',
    downloadLinks: item.downloadLinks || (item.download_links ? JSON.parse(item.download_links) : []),
    seasons: transformedSeasons,
    streamUrl: item.stream_embed || item.stream_url || item.streamUrl || '',
    duration: item.duration || 0,
    release_date: item.release_date || '',
    status: item.status || 'ended',
    release_day_of_week: item.release_day_of_week !== null && item.release_day_of_week !== undefined ? Number(item.release_day_of_week) : null,
    release_time: item.release_time,
    subtitle_link: item.subtitle_link || '',
  };
};

// API Helper Functions
export const apiService = {
  // Fetch media list with filters
  async getMediaList(params: {
    type?: 'movie' | 'series';
    genre?: string;
    year?: string;
    country?: string;
    min_rating?: number;
    quality?: string;
    sort?: 'newest' | 'oldest' | 'rating' | 'views';
    page?: number;
  }) {
    if (DEMO_MODE) {
      // Demo mode - return mock data
      let items = [...DEMO_MOVIES, ...DEMO_SERIES];

      // Apply filters
      if (params.type) {
        items = items.filter(item => item.type === params.type);
      }
      if (params.genre) {
        items = items.filter(item => item.genres?.includes(params.genre));
      }
      if (params.year) {
        items = items.filter(item => item.year?.toString() === params.year);
      }
      if (params.min_rating) {
        items = items.filter(item => (item.imdb_rating || 0) >= params.min_rating);
      }

      return {
        success: true,
        items: items.map(transformMediaItem),
        total: items.length,
        page: params.page || 1,
        totalPages: 1,
      };
    }

    const queryParams = new URLSearchParams();

    if (params.type) queryParams.append('type', params.type);
    if (params.genre) queryParams.append('genre', params.genre);
    if (params.year) queryParams.append('year', params.year);
    if (params.country) queryParams.append('country', params.country);
    if (params.min_rating) queryParams.append('min_rating', params.min_rating.toString());
    if (params.quality) queryParams.append('quality', params.quality);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.page) queryParams.append('page', params.page.toString());

    const response = await fetch(`${API_CONFIG.MEDIA_LIST}?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch media list');
    const data = await response.json();

    // Transform items if they exist
    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map(transformMediaItem);
    }

    return data;
  },

  // Fetch single media detail
  async getMediaDetail(slugOrId: string, type?: 'movie' | 'series') {
    if (DEMO_MODE) {
      // Demo mode - find item by slug or ID
      const allContent = [...DEMO_MOVIES, ...DEMO_SERIES];
      const item = allContent.find(i => i.slug === slugOrId || i.id === slugOrId);

      if (!item) {
        throw new Error('Media not found');
      }

      // Get comments for this item
      const comments = DEMO_COMMENTS[item.id] || [];
      const commentsCount = comments.length;
      const averageRating = commentsCount > 0
        ? comments.reduce((sum, c) => sum + (c.rating || 0), 0) / commentsCount
        : 0;

      return {
        success: true,
        media: transformMediaItem(item),
        type: item.type,
        seasons: item.seasons || [],
        comments: comments,
        commentsStats: {
          count: commentsCount,
          averageRating: Math.round(averageRating * 10) / 10,
        }
      };
    }

    // Check if this is a slug-based lookup or ID-based lookup
    const isNumeric = /^\d+$/.test(slugOrId);
    let queryParam = '';

    if (isNumeric) {
      queryParam = `id=${slugOrId}`;
    } else {
      queryParam = `slug=${encodeURIComponent(slugOrId)}`;
    }

    if (type) {
      queryParam += `&type=${type}`;
    }

    const url = `${API_CONFIG.MEDIA_DETAIL}?${queryParam}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch media detail: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform media item
    if (data.media) {
      if (data.type) data.media.type = data.type;
      if (data.seasons) data.media.seasons = data.seasons;
      data.media = transformMediaItem(data.media);

      // Fetch comments for this media
      try {
        const commentsResponse = await fetch(`${API_CONFIG.COMMENTS}?media_id=${data.media.id}&media_type=${data.type || 'movie'}`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          data.comments = commentsData.comments || [];
          data.commentsStats = commentsData.stats || { count: 0, averageRating: 0 };
        }
      } catch (e) {
        console.warn('Failed to fetch comments:', e);
        data.comments = [];
      }
    }

    return data;
  },

  // Track view for a media item (IP-based)
  async trackView(mediaId: string) {
    try {
      const response = await fetch(`${API_CONFIG.MEDIA_DETAIL}view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_id: mediaId }),
      });
      // Don't throw error if view tracking fails - it's not critical
      if (!response.ok) {
        console.warn('Failed to track view');
      }
    } catch (error) {
      console.warn('Failed to track view:', error);
    }
  },

  // Search media
  async search(query: string, lang?: string, type?: 'movie' | 'series') {
    if (DEMO_MODE) {
      // Demo mode - search in mock data
      const allContent = [...DEMO_MOVIES, ...DEMO_SERIES];
      const searchLower = query.toLowerCase();

      let results = allContent.filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(searchLower);
        const titleFaMatch = item.title_fa?.toLowerCase().includes(searchLower);
        const descMatch = item.description?.toLowerCase().includes(searchLower);
        return titleMatch || titleFaMatch || descMatch;
      });

      // Filter by type if specified
      if (type) {
        results = results.filter(item => item.type === type);
      }

      return {
        success: true,
        results: results.map(transformMediaItem),
        total: results.length,
      };
    }

    const params = new URLSearchParams({ q: query });
    if (lang) params.append('lang', lang);
    if (type) params.append('type', type);

    try {
      const response = await fetch(`${API_CONFIG.SEARCH}?${params}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search API Error:', errorText);
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check if the response indicates an error
      if (data.success === false) {
        throw new Error(data.error || 'Search request failed');
      }

      // Transform results if they exist
      if (data.results && Array.isArray(data.results)) {
        data.results = data.results.map(transformMediaItem);
      }

      return data;
    } catch (error) {
      console.error('Search API Full Error:', error);
      throw error;
    }
  },

  // Fetch homepage data
  async getHomepageData() {
    if (DEMO_MODE) {
      // Demo mode - return mock homepage data
      const allContent = [...DEMO_MOVIES, ...DEMO_SERIES];
      return {
        success: true,
        featured: allContent.slice(0, 3).map(transformMediaItem),
        newestMovies: DEMO_MOVIES.map(transformMediaItem),
        newestSeries: DEMO_SERIES.map(transformMediaItem),
        trending: allContent.map(transformMediaItem),
        slideshow: allContent.slice(0, 3).map(transformMediaItem),
        recent: allContent.map(transformMediaItem),
      };
    }

    const response = await fetch(API_CONFIG.HOMEPAGE);
    if (!response.ok) throw new Error('Failed to fetch homepage data');
    const data = await response.json();

    // Transform featured, newestMovies, newestSeries, and trending items
    if (data.featured && Array.isArray(data.featured)) {
      data.featured = data.featured.map(transformMediaItem);
    }
    if (data.newestMovies && Array.isArray(data.newestMovies)) {
      data.newestMovies = data.newestMovies.map(transformMediaItem);
    }
    if (data.newestSeries && Array.isArray(data.newestSeries)) {
      data.newestSeries = data.newestSeries.map(transformMediaItem);
    }
    if (data.trending && Array.isArray(data.trending)) {
      data.trending = data.trending.map(transformMediaItem);
    }

    // Legacy support for old field names
    if (data.slideshow && Array.isArray(data.slideshow)) {
      data.slideshow = data.slideshow.map(transformMediaItem);
    }
    if (data.recent && Array.isArray(data.recent)) {
      data.recent = data.recent.map(transformMediaItem);
    }

    return data;
  },

  // Submit comment
  async submitComment(data: {
    media_id: string;
    media_type: string;
    parent_id?: string;
    name: string;
    email: string;
    comment: string;
    rating?: number;
    captcha: string;
  }) {
    if (DEMO_MODE) {
      // Demo mode - simulate comment submission
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Comment submitted successfully (Demo Mode - will be visible after admin approval)',
            comment: {
              id: 'demo-comment-' + Date.now(),
              ...data,
              created_at: new Date().toISOString(),
              approved: false,
            }
          });
        }, 500);
      });
    }

    const response = await fetch(API_CONFIG.COMMENTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Comment submission error:', errorData);
      throw new Error(errorData.error || errorData.details || 'Failed to submit comment');
    }

    return response.json();
  },

  // Submit contact form
  async submitContact(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    captcha: string;
  }) {
    if (DEMO_MODE) {
      // Demo mode - simulate contact form submission
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Thank you for contacting us! We will get back to you soon. (Demo Mode)',
          });
        }, 500);
      });
    }

    const response = await fetch(API_CONFIG.CONTACT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit contact form');
    return response.json();
  },

  // Submit suggestion
  async submitSuggestion(data: {
    name: string;
    email: string;
    title: string;
    type?: 'movie' | 'series' | 'website';
    imdb_link?: string;
    description?: string;
    captcha: string;
  }) {
    if (DEMO_MODE) {
      // Demo mode - simulate suggestion submission
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Thank you for your suggestion! We\'ll review it soon. (Demo Mode)',
            suggestion: {
              id: 'demo-suggestion-' + Date.now(),
              ...data,
              status: 'pending',
              created_at: new Date().toISOString(),
            }
          });
        }, 500);
      });
    }

    const response = await fetch(API_CONFIG.SUGGESTIONS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit suggestion');
    return response.json();
  },

  // Get approved suggestions for public display
  async getApprovedSuggestions() {
    if (DEMO_MODE) {
      // Demo mode - return mock suggestions
      return {
        success: true,
        suggestions: DEMO_SUGGESTIONS,
        total: DEMO_SUGGESTIONS.length,
      };
    }

    const response = await fetch(API_CONFIG.SUGGESTIONS_APPROVED);
    if (!response.ok) throw new Error('Failed to fetch approved suggestions');
    return response.json();
  },

  // === ADMIN FUNCTIONS ===

  // Admin: Login (DEMO MODE)
  async adminLogin(password: string) {
    // DEMO MODE: Local authentication for GitHub demo
    // Username: admin
    // Password: demo123
    //
    // To connect to real API:
    // 1. Deploy your Cloudflare Workers
    // 2. Update API_CONFIG.ADMIN_API with your worker URL
    // 3. Replace this function with the commented code below

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === 'demo123') {
          resolve({
            success: true,
            token: 'demo_token_' + Date.now(),
            message: 'Login successful (Demo Mode)'
          });
        } else {
          reject(new Error('Invalid password. Use: demo123'));
        }
      }, 500);
    });

    /* Production code - uncomment when connecting to real API:
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
    */
  },

  // Admin: Add new media
  async addMedia(data: any, token: string) {
    const endpoint = data.type === 'series' ? '/admin/series' : '/admin/movies';
    
    const response = await fetch(`${API_CONFIG.ADMIN_API}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add media');
    return response.json();
  },

  // Admin: Get all movies
  async getAdminMovies(token: string) {
    if (DEMO_MODE) {
      return { movies: [], total: 0, message: 'Demo mode - No movies in database' };
    }
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/movies`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch movies');
    return response.json();
  },

  // Admin: Update movie
  async updateMovie(movieId: string, data: any, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/movies/${movieId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update movie error:', errorText);
      throw new Error(`Failed to update movie: ${response.status}`);
    }
    return response.json();
  },

  // Admin: Delete movie
  async deleteMovie(movieId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/movies/${movieId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete movie');
    return response.json();
  },

  // Admin: Get all series
  async getAdminSeries(token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/series`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch series');
    return response.json();
  },

  // Admin: Update series
  async updateSeries(seriesId: string, data: any, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/series/${seriesId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update series error:', errorText);
      throw new Error(`Failed to update series: ${response.status}`);
    }
    return response.json();
  },

  // Admin: Delete series
  async deleteSeries(seriesId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/series/${seriesId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete series');
    return response.json();
  },

  // Admin: Add episode
  async addEpisode(data: any, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/episodes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      const errorMessage = errorData.details 
        ? `${errorData.error}: ${errorData.details}` 
        : errorData.error || 'Failed to add episode';
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Admin: Update episode
  async updateEpisode(episodeId: string, data: any, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/episodes/${episodeId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update episode error:', errorText);
      throw new Error(`Failed to update episode: ${response.status}`);
    }
    return response.json();
  },

  // Admin: Delete episode
  async deleteEpisode(episodeId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/episodes/${episodeId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete episode');
    return response.json();
  },

  // Admin: Get episodes for a season
  async getSeasonEpisodes(seasonId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/episodes/season/${seasonId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch episodes');
    return response.json();
  },

  // Admin: Add season
  async addSeason(data: any, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/seasons`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add season');
    return response.json();
  },

  // Admin: Get seasons for a series
  async getSeriesSeasons(seriesId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/seasons/series/${seriesId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch seasons');
    return response.json();
  },

  // Admin: Update season
  async updateSeason(seasonId: string, data: any, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/seasons/${seasonId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update season error:', errorText);
      throw new Error(`Failed to update season: ${response.status}`);
    }
    return response.json();
  },

  // Admin: Delete season
  async deleteSeason(seasonId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/seasons/${seasonId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete season');
    return response.json();
  },

  // Admin: Get stats
  async getAdminStats(token: string) {
    if (DEMO_MODE) {
      return {
        stats: {
          totalMovies: 0,
          totalSeries: 0,
          totalEpisodes: 0,
          totalComments: 0,
          pendingComments: 0,
          totalSuggestions: 0,
          totalViews: 0,
        },
        message: 'Demo mode stats'
      };
    }
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Admin: Get pending comments
  async getPendingComments(token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/comments/pending`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch pending comments');
    return response.json();
  },

  // Admin: Get all comments
  async getAllComments(token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/comments`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch all comments');
    return response.json();
  },

  // Admin: Update comment
  async updateComment(commentId: string, data: any, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/comments/${commentId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
  },

  // Admin: Approve comment
  async approveComment(commentId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/comments/${commentId}/approve`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to approve comment');
    return response.json();
  },

  // Admin: Delete comment
  async deleteComment(commentId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete comment');
    return response.json();
  },

  // Admin: Reply to comment
  async replyToComment(data: {
    media_id: string;
    media_type: string;
    parent_id?: string;
    comment: string;
    name?: string;
  }, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/comments/reply`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to post admin reply');
    return response.json();
  },

  // Admin: Get suggestions
  async getSuggestions(status: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/suggestions?status=${status}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    return response.json();
  },

  // Admin: Approve suggestion
  async approveSuggestion(suggestionId: string, notes: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/suggestions/${suggestionId}/approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ notes }),
    });
    if (!response.ok) throw new Error('Failed to approve suggestion');
    return response.json();
  },

  // Admin: Update suggestion status (new unified method)
  async updateSuggestionStatus(suggestionId: string, status: string, notes: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/suggestions/${suggestionId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, notes }),
    });
    if (!response.ok) throw new Error('Failed to update suggestion status');
    return response.json();
  },

  // Admin: Reject suggestion (legacy)
  async rejectSuggestion(suggestionId: string, notes: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/suggestions/${suggestionId}/reject`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ notes }),
    });
    if (!response.ok) throw new Error('Failed to reject suggestion');
    return response.json();
  },

  // Admin: Delete suggestion
  async deleteSuggestion(suggestionId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/suggestions/${suggestionId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete suggestion');
    return response.json();
  },

  // Admin: Get Settings (Maintenance Mode, etc.)
  async getSettings() {
    if (DEMO_MODE) {
      // Demo mode - return default settings
      return {
        success: true,
        settings: {
          maintenance_mode: false,
          site_title: 'KouroshStream',
          site_description: 'Watch and download movies and series'
        }
      };
    }

    // Note: this endpoint should be public or require a specific public-facing key if needed,
    // but usually maintenance status is public info.
    const response = await fetch(`${API_CONFIG.ADMIN_API}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  // Admin: Update Settings
  async updateSettings(data: any, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  },

  // Admin: Get all contact messages
  async getContactMessages(token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/contact-messages`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch contact messages');
    return response.json();
  },

  // Admin: Delete contact message
  async deleteContactMessage(messageId: string, token: string) {
    const response = await fetch(`${API_CONFIG.ADMIN_API}/admin/contact-messages/${messageId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete contact message');
    return response.json();
  },

  // Donor Wall (Demo Mode - disabled)
  async submitDonationRecord(data: any) {
    // Demo mode - donor wall feature disabled
    // To enable: set up your own backend endpoint
    console.warn('Donor wall feature is disabled in demo mode');
    return { success: false, message: 'Donor wall feature not configured' };
  },

  async getDonors() {
    // Demo mode - donor wall feature disabled
    // To enable: set up your own backend endpoint
    return { donors: [] };
  },
};