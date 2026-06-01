/**
 * MOCK DATA FILE
 * 
 * This file is NO LONGER USED for actual data in the application.
 * It only contains TypeScript interfaces/types for Media objects.
 * 
 * All data now comes from Cloudflare Workers API endpoints.
 * The mockMedia array below is kept for reference but is not imported anywhere.
 */

export interface Media {
  id: string;
  type: "movie" | "series";
  title: { en: string; fa: string };
  description: { en: string; fa: string };
  poster: string;
  backdrop: string;
  year: number;
  rating: number;
  genres: string[];
  quality: string;
  trailerUrl: string;
  director: string;
  country: string;
  views: number;
  slug?: string;
  status?: string;
  release_day_of_week?: number | null;
  release_time?: string | null;
  
  // Cast and Actors
  actors?: {
    name: string;
    character: string;
    image: string;
    nameLocal?: string; // For Persian names
  }[];
  
  downloadLinks?: { label: string; url: string }[];
  seasons?: {
    number: number;
    episodes: {
      number: number;
      title: string;
      streamUrl: string;
      downloadLinks?: { quality: string; size: string; url: string }[];
    }[];
  }[];
}

// ==============================================================================
// DEPRECATED: The following mock data is no longer used in the application
// All data now comes from the real API via Cloudflare Workers
// ==============================================================================

export const mockMedia: Media[] = [
  {
    id: "1",
    type: "movie",
    title: { en: "Cosmic Odyssey", fa: "سفر کیهانی" },
    description: { 
      en: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      fa: "تیمی از کاوشگران از طریق کرم‌چاله‌ای در فضا سفر می‌کنند تا بقای بشریت را تضمین کنند."
    },
    poster: "https://images.unsplash.com/photo-1555867088-2b3b7cd86b67?q=80&w=2094&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1707862313123-031db8cdd46e?q=80&w=2072&auto=format&fit=crop",
    year: 2024,
    rating: 8.7,
    genres: ["sciFi", "drama"],
    quality: "4K BlueRay",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    director: "Christopher Nolan",
    country: "USA",
    views: 1250000,
    
    // Cast and Actors
    actors: [
      {
        name: "Matthew McConaughey",
        nameLocal: "متیو مک‌کانهی",
        character: "Cooper",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Anne Hathaway",
        nameLocal: "آن هاتاوی",
        character: "Brand",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Jessica Chastain",
        nameLocal: "جسیکا چستین",
        character: "Murph",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Michael Caine",
        nameLocal: "مایکل کین",
        character: "Professor Brand",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Matt Damon",
        nameLocal: "مت دیمون",
        character: "Mann",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=450&auto=format&fit=crop"
      }
    ],
    
    downloadLinks: [
      { label: "2160p.4K.BlueRay.x265 (8.5GB)", url: "#" },
      { label: "1080p.BlueRay.x264 (2.5GB)", url: "#" },
      { label: "720p.BlueRay.x264 (1.2GB)", url: "#" },
    ],
  },
  {
    id: "2",
    type: "series",
    title: { en: "Neon Shadows", fa: "سایه‌های نئونی" },
    description: { 
      en: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
      fa: "هنگامی که یک پسر جوان ناپدید می‌شود، مادرش، رئیس پلیس و دوستانش باید با نیروهای ماوراء طبیعی وحشتناک روبرو شوند."
    },
    poster: "https://images.unsplash.com/photo-1641667838410-b257ca266e38?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1505775561242-727b7fba20f0?q=80&w=2070&auto=format&fit=crop",
    year: 2023,
    rating: 8.9,
    genres: ["horror", "sciFi"],
    quality: "1080p Web-DL",
    trailerUrl: "https://www.youtube.com/embed/b9EkMc79ZSU",
    director: "The Duffer Brothers",
    country: "USA",
    views: 3400000,
    actors: [
      {
        name: "Millie Bobby Brown",
        nameLocal: "میلی بابی براون",
        character: "Eleven",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Finn Wolfhard",
        nameLocal: "فین ولف‌هارد",
        character: "Mike Wheeler",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Noah Schnapp",
        nameLocal: "نوآ شنپ",
        character: "Will Byers",
        image: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Gaten Matarazzo",
        nameLocal: "گیتن ماتارازو",
        character: "Dustin Henderson",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Caleb McLaughlin",
        nameLocal: "کالب مک‌لافلین",
        character: "Lucas Sinclair",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Winona Ryder",
        nameLocal: "وینونا رایدر",
        character: "Joyce Byers",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "David Harbour",
        nameLocal: "دیوید هاربر",
        character: "Jim Hopper",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&h=450&auto=format&fit=crop"
      },
      {
        name: "Natalia Dyer",
        nameLocal: "ناتالیا دایر",
        character: "Nancy Wheeler",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=450&auto=format&fit=crop"
      }
    ],
    seasons: [
      {
        number: 1,
        episodes: [
          { 
            number: 1, 
            title: "The Beginning", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 2, 
            title: "Dark Streets", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 3, 
            title: "Into the Void", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 4, 
            title: "Echoes", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
        ],
      },
      {
        number: 2,
        episodes: [
          { 
            number: 1, 
            title: "Return to Darkness", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 2, 
            title: "The Mind Flayer", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 3, 
            title: "The Spy", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
        ],
      },
      {
        number: 3,
        episodes: [
          { 
            number: 1, 
            title: "Suzie, Do You Copy?", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 2, 
            title: "The Mall Rats", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 3, 
            title: "The Case of the Missing Lifeguard", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 4, 
            title: "The Sauna Test", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
        ],
      },
      {
        number: 4,
        episodes: [
          { 
            number: 1, 
            title: "The Hellfire Club", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 2, 
            title: "Vecna's Curse", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
          { 
            number: 3, 
            title: "The Monster and the Superhero", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" },
              { quality: "480p", size: "600MB", url: "#" }
            ]
          },
        ],
      },
    ],
  },
  {
    id: "3",
    type: "movie",
    title: { en: "Urban Echoes", fa: "پژواک‌های شهری" },
    description: { 
      en: "A thief who steals corporate secrets through the use of dream-sharing technology.",
      fa: "دزدی که اسرار شرکتی را از طریق استفاده از فناوری به اشتراک گذاری رویا می‌دزدد."
    },
    poster: "https://images.unsplash.com/photo-1734669579627-d558e9270bad?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    year: 2024,
    rating: 8.2,
    genres: ["action", "drama"],
    quality: "1080p BlueRay",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    director: "Zack Snyder",
    country: "UK",
    views: 890000,
    downloadLinks: [
      { label: "1080p.BlueRay (2.1GB)", url: "#" },
      { label: "720p.BlueRay (1.0GB)", url: "#" },
    ],
  },
  {
    id: "4",
    type: "series",
    title: { en: "The Last Frontier", fa: "آخرین مرز" },
    description: { 
      en: "A survival story set in a post-apocalyptic world where humanity struggles to find a new home.",
      fa: "داستانی از بقا در جهانی پسا-آخرالزمانی که در آن بشریت برای یافتن خانه‌ای جدید تلاش می‌کند."
    },
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2070&auto=format&fit=crop",
    year: 2024,
    rating: 9.1,
    genres: ["drama", "sciFi"],
    quality: "4K Web-DL",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    director: "Craig Mazin",
    country: "USA",
    views: 4500000,
    seasons: [
      {
        number: 1,
        episodes: [
          { 
            number: 1, 
            title: "Pilot", 
            streamUrl: "https://www.youtube.com/embed/zSWdZVtXT7E", 
            downloadLinks: [
              { quality: "4K", size: "5GB", url: "#" },
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" }
            ]
          },
          { 
            number: 2, 
            title: "Infected", 
            streamUrl: "https://www.youtube.com/embed/zSWdZVtXT7E", 
            downloadLinks: [
              { quality: "4K", size: "5GB", url: "#" },
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" }
            ]
          },
          { 
            number: 3, 
            title: "Long Long Time", 
            streamUrl: "https://www.youtube.com/embed/zSWdZVtXT7E", 
            downloadLinks: [
              { quality: "4K", size: "5GB", url: "#" },
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" }
            ]
          },
        ],
      },
      {
        number: 2,
        episodes: [
          { 
            number: 1, 
            title: "When We Are in Need", 
            streamUrl: "https://www.youtube.com/embed/zSWdZVtXT7E", 
            downloadLinks: [
              { quality: "4K", size: "5GB", url: "#" },
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" }
            ]
          },
          { 
            number: 2, 
            title: "Infected", 
            streamUrl: "https://www.youtube.com/embed/zSWdZVtXT7E", 
            downloadLinks: [
              { quality: "4K", size: "5GB", url: "#" },
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" }
            ]
          },
        ],
      },
    ],
  },
  // Add more movies and series to test pagination
  {
    id: "5",
    type: "movie",
    title: { en: "Shadow Hunter", fa: "شکارچی سایه" },
    description: { 
      en: "An action-packed thriller about a bounty hunter tracking down the world's most dangerous criminals.",
      fa: "یک تریلر پر هیجان درباره یک شکارچی جایزه که خطرناک‌ترین جنایتکاران جهان را تعقیب می‌کند."
    },
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2070&auto=format&fit=crop",
    year: 2023,
    rating: 7.5,
    genres: ["action"],
    quality: "1080p BlueRay",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    director: "David Leitch",
    country: "USA",
    views: 620000,
    downloadLinks: [
      { label: "1080p.BlueRay (2.0GB)", url: "#" },
      { label: "720p.BlueRay (950MB)", url: "#" },
    ],
  },
  {
    id: "6",
    type: "movie",
    title: { en: "Laugh Out Loud", fa: "خنده بلند" },
    description: { 
      en: "A hilarious comedy about a group of friends getting into unexpected situations.",
      fa: "کمدی خنده‌داری درباره گروهی از دوستان که در موقعیت‌های غیرمنتظره قرار می‌گیرند."
    },
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
    year: 2024,
    rating: 6.8,
    genres: ["comedy"],
    quality: "1080p Web-DL",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    director: "Judd Apatow",
    country: "USA",
    views: 440000,
    downloadLinks: [
      { label: "1080p.Web-DL (1.8GB)", url: "#" },
      { label: "720p.Web-DL (900MB)", url: "#" },
    ],
  },
  {
    id: "7",
    type: "movie",
    title: { en: "The Silent Witness", fa: "شاهد خاموش" },
    description: { 
      en: "A gripping drama about a lawyer defending an innocent man accused of murder.",
      fa: "یک درام جذاب درباره وکیلی که از مردی بی‌گناه که به قتل متهم شده دفاع می‌کند."
    },
    poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop",
    year: 2023,
    rating: 8.0,
    genres: ["drama"],
    quality: "1080p BlueRay",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    director: "Aaron Sorkin",
    country: "USA",
    views: 750000,
    downloadLinks: [
      { label: "1080p.BlueRay (2.3GB)", url: "#" },
      { label: "720p.BlueRay (1.1GB)", url: "#" },
    ],
  },
  {
    id: "8",
    type: "series",
    title: { en: "Mystery Manor", fa: "عمارت رمز" },
    description: { 
      en: "A detective investigates a series of mysterious murders in a secluded mansion.",
      fa: "یک کارآگاه زنجیره‌ای از قتل‌های مرموز در یک عمارت منزوی را بررسی می‌کند."
    },
    poster: "https://images.unsplash.com/photo-1518331483807-f6adb0e1ad23?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2070&auto=format&fit=crop",
    year: 2024,
    rating: 7.9,
    genres: ["horror", "drama"],
    quality: "1080p Web-DL",
    trailerUrl: "https://www.youtube.com/embed/b9EkMc79ZSU",
    director: "Mike Flanagan",
    country: "USA",
    views: 1800000,
    seasons: [
      {
        number: 1,
        episodes: [
          { 
            number: 1, 
            title: "The Arrival", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" }
            ]
          },
          { 
            number: 2, 
            title: "First Blood", 
            streamUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            downloadLinks: [
              { quality: "1080p", size: "2.5GB", url: "#" },
              { quality: "720p", size: "1.2GB", url: "#" }
            ]
          },
        ],
      },
    ],
  },
  {
    id: "9",
    type: "movie",
    title: { en: "Night Terrors", fa: "وحشت شب" },
    description: { 
      en: "A family moves into a haunted house and must fight to survive the evil spirits.",
      fa: "خانواده‌ای به خانه‌ای جن‌زده نقل مکان می‌کنند و باید برای زنده ماندن با ارواح شیطانی مبارزه کنند."
    },
    poster: "https://images.unsplash.com/photo-1509368863345-d19ed1f1eb36?q=80&w=2070&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2070&auto=format&fit=crop",
    year: 2024,
    rating: 7.2,
    genres: ["horror"],
    quality: "1080p BlueRay",
    trailerUrl: "https://www.youtube.com/embed/b9EkMc79ZSU",
    director: "James Wan",
    country: "USA",
    views: 980000,
    downloadLinks: [
      { label: "1080p.BlueRay (2.0GB)", url: "#" },
      { label: "720p.BlueRay (1.0GB)", url: "#" },
    ],
  },
  {
    id: "10",
    type: "movie",
    title: { en: "Space Rangers", fa: "محافظان فضا" },
    description: { 
      en: "An elite team of space rangers protects the galaxy from alien invasions.",
      fa: "تیمی نخبه از محافظان فضایی از کهکشان در برابر حملات بیگانگان محافظت می‌کنند."
    },
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    year: 2023,
    rating: 7.8,
    genres: ["sciFi", "action"],
    quality: "4K BlueRay",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    director: "James Gunn",
    country: "USA",
    views: 1100000,
    downloadLinks: [
      { label: "2160p.4K.BlueRay.x265 (9GB)", url: "#" },
      { label: "1080p.BlueRay (2.8GB)", url: "#" },
      { label: "720p.BlueRay (1.4GB)", url: "#" },
    ],
  },
];

// Mock search suggestions for autocomplete
export const searchSuggestions = [
  { en: "Cosmic Odyssey", fa: "سفر کیهانی", id: "1" },
  { en: "Neon Shadows", fa: "سایه‌های نئونی", id: "2" },
  { en: "Urban Echoes", fa: "پژواک‌های شهری", id: "3" },
  { en: "The Last Frontier", fa: "آخرین مرز", id: "4" },
  { en: "Shadow Hunter", fa: "شکارچی سایه", id: "5" },
  { en: "Laugh Out Loud", fa: "خنده بلند", id: "6" },
  { en: "The Silent Witness", fa: "شاهد خاموش", id: "7" },
  { en: "Mystery Manor", fa: "عمارت رمز", id: "8" },
  { en: "Night Terrors", fa: "وحشت شب", id: "9" },
  { en: "Space Rangers", fa: "محافظان فضا", id: "10" },
];