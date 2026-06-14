# DoaKu AR - Islamic Doa AR App

An augmented reality application for learning and reciting Islamic prayers (dua) with AR visualization.

## Features
- 📱 AR Scanner for interactive doa visualization
- 📚 Comprehensive doa database with Arabic text, Latin transliteration, and meaning
- 🏃 Progress tracking for learning
- 🎯 Interactive practice mode
- 📍 Location-based AR markers

## Project Structure
```
DoaKu/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── server.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── config/
│   └── package.json
├── frontend/         # React web app
│   ├── src/
│   ├── public/
│   └── package.json
├── database/         # SQL schema
└── package.json      # Workspace configuration
```

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Java JDK 17 (for APK building)
- Android Studio (for APK generation)

### Installation

```bash
# Install all dependencies (workspace install)
npm install

# Or install individually
cd backend && npm install
cd frontend && npm install
```

### Running Locally

```bash
# Start both backend and frontend
npm run dev

# Or individually
npm run backend
npm run frontend
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:3000`

## Building APK

### Option 1: Using Capacitor (Recommended)
```bash
cd frontend
npm run build
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
npx cap open android
```
Then build from Android Studio: Build → Build APK(s)

### Option 2: GitHub Actions (Automatic)
Push to `main` branch - APK builds automatically and releases on GitHub!

## CI/CD

- **Workflow**: `.github/workflows/build-apk.yml`
- **Trigger**: Push to `main` or `develop` branch
- **Output**: Automatic APK release on GitHub Releases

## GitHub Setup

1. Create a new repository on GitHub: `DoaKu`
2. Initialize local git:
```bash
git init
git add .
git commit -m "Initial commit: DoaKu AR App"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/DoaKu.git
git push -u origin main
```

3. Enable GitHub Actions in repository settings

4. Every push to `main` will:
   - Build the React app
   - Generate APK via Capacitor
   - Create a release with APK attached

## Download APK
Visit `Releases` tab on GitHub to download the latest APK

## License
MIT

## Author
Your Name
