# 🎬 KouroshStream - Movie & Series Streaming Platform

A modern, full-featured streaming website template with Persian (RTL) and English (LTR) language support. Built with React, TypeScript, and Tailwind CSS.

![Demo Template](https://img.shields.io/badge/Demo-Template-orange.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

> **⚠️ This is a demo template project** - A showcase of a modern streaming website built for educational and demonstration purposes. Not intended for actual content streaming without proper licensing.

## ✨ Features

### 🌍 Bilingual Support
- **Persian (RTL) & English (LTR)** with seamless language switching
- **SEO-friendly URLs** with language prefixes (`/fa/movie/title`, `/en/movie/title`)
- Complete RTL/LTR layout support

### 🎥 Content Management
- Movies & TV Series with season/episode tracking
- Advanced search with autocomplete
- Filter by genre, year, country, quality, rating
- IMDb ratings and metadata
- Download links and streaming support
- Next episode countdown for ongoing series

### 🎨 Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark mode optimized
- Hero slideshow
- Trending section
- Cast information with hover tooltips
- Optimized images with lazy loading

### 💬 User Interaction
- Comment system with ratings
- Nested replies
- Suggestion system
- Contact forms
- Admin moderation panel

### 🛡️ Security
- Rate limiting
- Honeypot spam detection
- Form timing validation
- Captcha integration ready
- Input sanitization

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/saeedmasoudie/kouroshstream.git
cd kouroshstream

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

Visit `http://localhost:5173` to see the app running!

## 📦 Tech Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.1** - Styling
- **React Router 7** - Routing
- **Motion** - Animations
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Vite 6** - Build tool

## 🔧 Configuration

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
# API Configuration
VITE_API_MEDIA_LIST=https://your-api.workers.dev/
VITE_API_MEDIA_DETAIL=https://your-api.workers.dev/
VITE_API_SEARCH=https://your-api.workers.dev/
VITE_API_HOMEPAGE=https://your-api.workers.dev/
VITE_API_COMMENTS=https://your-api.workers.dev/
VITE_API_ADMIN=https://your-api.workers.dev/

# Captcha (optional)
VITE_TURNSTILE_SITE_KEY=your_site_key

# Demo Mode (set to false for production)
VITE_DEMO_MODE=true
```

### Demo Mode

The project includes a demo mode for testing without a backend:

- **Admin Panel**: `/sys-control-7x24` (secure path)
- **Password**: `demo123`
- **Features**: All UI components work with mock data

To disable demo mode:
1. Edit `src/app/config/api.ts`
2. Set `DEMO_MODE = false`
3. Update API URLs
4. Connect to your backend

## 🗄️ Backend Setup

This is a **frontend-only** template. You need to implement the backend:

### Recommended: Cloudflare Workers + D1

```bash
# Install Wrangler
npm install -g wrangler

# Create D1 database
wrangler d1 create kouroshstream-db

# Deploy workers for each endpoint
wrangler deploy
```

### Required API Endpoints

- `GET /media-list` - List movies/series with filters
- `GET /media-detail` - Get single item details
- `GET /search` - Search functionality
- `GET /homepage` - Homepage data
- `GET /comments` - Get comments
- `POST /comments` - Submit comment
- `POST /admin/login` - Admin authentication
- Plus admin CRUD endpoints

See `.env.example` for complete list.

## 📱 Features in Detail

### Multilingual URLs

```
English: /en/movie/inception
Persian: /fa/movie/تلقین
```

### Admin Dashboard

Access at `/sys-control-7x24` (secure path):
- Content management (add/edit/delete)
- Comment moderation
- User suggestions review
- Statistics dashboard
- Maintenance mode toggle

### Security Features

- IP-based rate limiting (configurable)
- Honeypot fields for bots
- Form submission timing checks
- Captcha verification
- XSS protection

### SEO Optimized

- Semantic HTML
- Meta tags for social sharing
- Structured data
- Sitemap ready
- Mobile-friendly

## 🎨 Customization

### Change Colors

Edit `src/styles/theme.css`:

```css
@theme {
  --color-primary: #8b5cf6; /* Purple */
  --color-surface: #1f2937; /* Dark surface */
  /* ... */
}
```

### Change Logo

Replace `/public/logo.png` with your logo or edit `src/app/components/Logo.tsx`

### Default Language

Edit `src/app/context/LanguageContext.tsx`:

```typescript
const [lang, setLang] = useState<'en' | 'fa'>('en'); // or 'fa'
```

## 🚀 Deployment

### Cloudflare Pages (Recommended)

```bash
# Build
pnpm build

# Deploy
wrangler pages deploy dist
```

### Vercel / Netlify

```bash
pnpm build
# Connect your repo to Vercel/Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build
# Serve with nginx or your preferred server
```

## 📂 Project Structure

```
kouroshstream/
├── src/
│   ├── app/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Page components
│   │   ├── config/         # Configuration
│   │   ├── context/        # React contexts
│   │   ├── utils/          # Utilities
│   │   └── App.tsx         # Main app
│   └── styles/             # Global styles
├── public/                 # Static assets
├── .env.example           # Environment template
└── package.json
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
pnpm dev --port 3000
```

### Build Fails

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### API Calls Failing

1. Check API URLs in `src/app/config/api.ts`
2. Verify CORS headers on backend
3. Check browser console for errors

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

**Important**: This is a template/framework. You are responsible for:
- Content licensing
- Copyright compliance
- Legal use of the software
- Obtaining rights for hosted content

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## 🔗 Links

- **GitHub**: https://github.com/saeedmasoudie/kouroshstream
- **Issues**: https://github.com/saeedmasoudie/kouroshstream/issues
- **Author**: [Saeed Masoudie](https://saeedmasoudie.ir)

## ⚠️ Disclaimer

This software is provided as-is under the MIT License. The developers are not responsible for:
- How the software is used
- Content hosted using this software
- Copyright violations by users
- Any legal issues arising from use

Users must comply with all applicable laws and obtain proper licenses for any content they host.

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

---

Made with ❤️ by [Saeed Masoudie](https://saeedmasoudie.ir)

If you find this project useful, please give it a ⭐️ on [GitHub](https://github.com/saeedmasoudie/kouroshstream)!
