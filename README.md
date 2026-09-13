# 🎮 Life RPG

Transform your daily tasks into epic adventures. Level up your character, complete quests, and become the hero of your own story.

## ✨ Features

- **Quest System** - Turn tasks into quests with XP and gold rewards
- **Character Progression** - Level up and improve 6 attributes (Strength, Intellect, Agility, Vitality, Charisma, Wisdom)
- **Streak Tracking** - Maintain daily streaks for bonus rewards
- **Item Shop** - Spend gold on themes, badges, and consumables
- **Multiple Themes** - Customize your experience with Fantasy, Cyberpunk, or Lo-fi themes
- **Responsive Design** - Works on desktop and mobile devices
- **Keyboard Accessible** - Full keyboard navigation support

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js v5
- **State Management**: Zustand, TanStack Query

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/life-rpg.git
cd life-rpg
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and NextAuth secret
```

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Play

1. **Create an Account** - Sign up to start your adventure
2. **Create Quests** - Add tasks with attributes and difficulty levels
3. **Complete Quests** - Mark tasks as done to earn XP and gold
4. **Level Up** - Watch your character grow stronger
5. **Visit the Shop** - Spend gold on themes, badges, and boosts
6. **Maintain Streaks** - Complete at least one quest daily for bonus rewards

## 🎨 Themes

- **Default** - Clean dark theme
- **Fantasy Realm** - Medieval fantasy aesthetic (100 gold)
- **Neon City** - Cyberpunk neon visuals (100 gold)
- **Cozy Study** - Warm lo-fi atmosphere (80 gold)

## 🏆 RPG Mechanics

### Attributes
- **Strength** 💪 - Gym, calisthenics, weight training
- **Intellect** 🧠 - Coding, reading, studying
- **Agility** ⚡ - Running, yoga, sports
- **Vitality** ❤️ - Sleep, hydration, meditation
- **Charisma** ✨ - Socializing, networking
- **Wisdom** 🔮 - Journaling, planning, reflection

### Leveling Formula
XP required = 100 × level^1.5 (exponential growth)

### Streak Bonuses
- Day 1-10: +10% XP per day (caps at 100%)

## 📁 Project Structure

```
life-rpg/
├── prisma/
│   └── schema.prisma        # Database schema
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   └── dashboard/       # Main app pages
│   ├── components/          # React components
│   │   ├── character/       # Character-related components
│   │   ├── layout/          # Layout components
│   │   ├── quests/          # Quest components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility functions
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── prisma.ts        # Prisma client
│   │   ├── rpg.ts           # RPG calculations
│   │   └── validations.ts   # Zod schemas
│   └── store/               # Zustand stores
├── .env.example             # Environment variables template
└── README.md
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your app URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## ♿ Accessibility

- Full keyboard navigation (Tab, Enter, Space)
- Focus indicators on interactive elements
- Semantic HTML structure
- ARIA labels for screen readers
- Reduced motion support

## 🎬 Demo Video

[Link to demo video]

## 📄 License

MIT License

## 🙏 Acknowledgments

- Built with Next.js
- Styled with Tailwind CSS
- Animated with Framer Motion
- Icons from Lucide React
