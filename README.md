# 🧠 FluentAI — English Learning App

An AI-powered English learning app built with **Expo (React Native)**. Practice grammar, vocabulary, and conversation with a real-time AI tutor. Features speech recognition, text-to-speech, and multi-mode learning.

---

## 📱 App Screens

| Screen | Description |
|---|---|
| **Home** (`index.tsx`) | Welcome screen, mode selection, start chatting |
| **Chat** (`chat.tsx`) | Real-time AI conversation with speech support |
| **Settings** (`settings.tsx`) | Configure language level, AI mode, preferences |
| **Explore** (`explore.tsx`) | Browse learning exercises and content |

---

## 🛠️ Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Version | Install |
|---|---|---|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ (comes with Node) | Included with Node.js |
| **Expo CLI** | Latest | `npm install -g expo-cli` |
| **Git** | Any | [git-scm.com](https://git-scm.com) |
| **Android Studio** *(optional)* | Latest | For Android emulator |
| **Xcode** *(macOS only, optional)* | Latest | For iOS simulator |

> **Android Device?** Enable **USB Debugging** in Developer Options and use the **Expo Go** app for quick testing.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/anirban8007/english-learning-app.git
cd english-learning-app
```

### 2. Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json` including Expo, React Native, and all UI libraries.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or manually create `.env` and add your keys:

```env
EXPO_NO_DEVTOOLS=1
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> 🔑 Get a free Groq API key at [console.groq.com](https://console.groq.com)  
> 🗄️ Get Supabase credentials at [supabase.com](https://supabase.com)

---

## ▶️ Running the App

### Start the Development Server

```bash
npm start
```

This launches the **Expo dev server**. You'll see a QR code and options in the terminal.

---

### Run on Android (Physical Device)

1. Install **Expo Go** from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Open Expo Go → Scan the QR code shown in terminal
3. The app will load on your device

```bash
npm start
# then press 'a' to open on Android emulator (if Android Studio is set up)
```

### Run on Android Emulator

```bash
# Make sure Android Studio is installed and AVD is created
npm run android
```

### Run on iOS (macOS only)

```bash
npm run ios
```

### Run in Web Browser

```bash
npm run web
```

---

## 📦 Installing a Specific Package (if needed)

```bash
# Install an Expo-compatible package
npx expo install <package-name>

# Example: reinstall expo-speech
npx expo install expo-speech
```

> ⚠️ Always use `npx expo install` instead of `npm install` for Expo packages — it pins the correct version for your SDK.

---

## 🗂️ Project Structure

```
english-learning-app/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── _layout.tsx         # Root navigation layout
│   │   ├── index.tsx           # Home screen
│   │   ├── chat.tsx            # AI Chat screen
│   │   ├── settings.tsx        # Settings screen
│   │   └── explore.tsx         # Explore screen
│   ├── components/             # Reusable UI components
│   │   ├── app-tabs.tsx        # Bottom tab navigator
│   │   ├── themed-text.tsx     # Theme-aware text
│   │   ├── themed-view.tsx     # Theme-aware view
│   │   └── ui/                 # UI primitives
│   ├── constants/
│   │   └── theme.ts            # Color tokens & theme config
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-color-scheme.ts # Dark/light mode hook
│   │   └── use-theme.ts        # Theme access hook
│   └── global.css              # Global styles (NativeWind)
├── assets/
│   └── images/                 # App icons & images
├── android/                    # Native Android project
├── app.json                    # Expo configuration
├── package.json                # Dependencies & scripts
└── tsconfig.json               # TypeScript configuration
```

---

## 🧩 Key Dependencies

| Package | Purpose |
|---|---|
| `expo ~56.0.5` | Core Expo SDK |
| `expo-router ~56.2.7` | File-based navigation |
| `expo-speech ~56.0.3` | Text-to-speech |
| `expo-speech-recognition ^56.0.0` | Voice input |
| `@supabase/supabase-js` | Backend / auth |
| `@react-native-async-storage/async-storage` | Local data persistence |
| `react-native-reanimated 4.3.1` | Smooth animations |
| `nativewind ^4.2.4` | Tailwind CSS for React Native |

---

## 🐛 Common Issues & Fixes

### `npm install` fails
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### Expo bundler error
```bash
# Clear Expo cache
npx expo start --clear
```

### Metro bundler stuck
```bash
# Kill and restart
npx expo start -c
```

### Android build fails
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
npm run android
```

### Speech recognition not working on Android
- Make sure the app has **Microphone** permission granted in device Settings.
- Test on a **physical device** (not emulator — speech recognition may not work on emulators).

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run android` | Build & run on Android |
| `npm run ios` | Build & run on iOS |
| `npm run web` | Run in browser |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Reset to blank Expo template |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ using Expo + React Native</p>
