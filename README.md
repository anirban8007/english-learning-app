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

## 🛠️ Prerequisites & Full Dependency Setup

> ⚠️ This project uses a **custom dev client** (`npx expo start --dev-client`), **not** Expo Go. You must build the dev client APK and install it on your device first.

---

### 📦 Installing All Dependencies

#### 🪟 Windows

```powershell
# 1. Install Node.js (v18+) — download from https://nodejs.org
#    (npm is included)

# 2. Install Git — download from https://git-scm.com

# 3. Install Android Studio — https://developer.android.com/studio
#    During setup, make sure to install:
#      - Android SDK
#      - Android SDK Platform-Tools (contains adb)
#      - Android Virtual Device (AVD) if using emulator

# 4. Add platform-tools to your PATH (so 'adb' works globally)
#    Default location: C:\Users\<YourName>\AppData\Local\Android\Sdk\platform-tools
#    Go to: System Properties → Environment Variables → Path → New → paste path

# 5. Install EAS CLI (for building dev client)
npm install -g eas-cli

# 6. Verify everything is installed
node --version
npm --version
git --version
adb --version
```

#### 🐧 Linux (Ubuntu/Debian)

```bash
# 1. Install Node.js v18+ via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install Git
sudo apt-get install -y git

# 3. Install Android SDK Platform-Tools (adb)
sudo apt-get install -y android-tools-adb
# OR install Android Studio from https://developer.android.com/studio
# and add to PATH:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
# Add these lines to ~/.bashrc or ~/.zshrc to make them permanent

# 4. Install EAS CLI
npm install -g eas-cli

# 5. Verify installations
node --version
npm --version
git --version
adb --version
```

#### React Native & Expo specific packages (auto-installed via `npm install`)

| Package | Purpose |
|---|---|
| `expo ~56.0.5` | Core Expo SDK |
| `expo-router ~56.2.7` | File-based navigation |
| `react-native` | Core React Native runtime |
| `expo-dev-client` | Custom dev client (required for this project) |
| `expo-speech` | Text-to-speech |
| `expo-speech-recognition` | Voice input |
| `react-native-reanimated` | Smooth animations |
| `nativewind` | Tailwind CSS for React Native |
| `@supabase/supabase-js` | Backend / auth |
| `@react-native-async-storage/async-storage` | Local data persistence |

---

### 📱 Android Device Setup (Required for Dev Client)

#### Step 1 — Enable Developer Options on your Android device

1. Open **Settings** → **About Phone**
2. Tap **Build Number** 7 times rapidly
3. You'll see "You are now a developer!"
4. Go back to **Settings** → **Developer Options**
5. Enable **USB Debugging**

---

#### Step 2a — Connect via USB (Data Cable) 🔌

**Windows & Linux (same steps):**

```bash
# 1. Connect your phone with a USB cable
# 2. On your phone: tap 'Allow' when asked to authorize USB debugging

# 3. Verify device is detected
adb devices
# Expected output:
# List of devices attached
# XXXXXXXXXXXXXXXX    device

# If you see 'unauthorized' → tap 'Allow' on your phone again
# If nothing shows → try a different USB cable (must be a DATA cable, not charge-only)
```

**Linux only — fix USB permission issue:**
```bash
# If adb can't see your device, add udev rules
sudo apt-get install -y android-sdk-platform-tools-common
# Then reconnect the cable and retry:
adb devices

# Alternative manual fix:
lsusb  # note your device's Vendor ID (e.g., 18d1 for Google, 04e8 for Samsung)
sudo nano /etc/udev/rules.d/51-android.rules
# Add: SUBSYSTEM=="usb", ATTR{idVendor}=="XXXX", MODE="0666", GROUP="plugdev"
sudo udevadm control --reload-rules
sudo service udev restart
adb kill-server && adb start-server
adb devices
```

---

#### Step 2b — Connect via WiFi (Wireless ADB) 📶

> Your phone and computer must be on the **same WiFi network**.

##### Method 1: WiFi via USB first (Android 10 and below)

```bash
# 1. First connect via USB cable
adb devices   # confirm device appears

# 2. Switch to TCP/IP mode on port 5555
adb tcpip 5555

# 3. Find your phone's WiFi IP address:
#    Phone → Settings → About Phone → Status → IP address
#    OR run:
adb shell ip route | awk '{print $9}'  # Linux
# On Windows PowerShell:
adb shell ip route   # look for 'src X.X.X.X'

# 4. Disconnect the USB cable

# 5. Connect wirelessly (replace with your phone's actual IP)
adb connect 192.168.1.XXX:5555
# Expected: connected to 192.168.1.XXX:5555

# 6. Verify
adb devices
```

##### Method 2: Wireless Debugging (Android 11+, no USB cable needed after first time)

```bash
# 1. On your phone:
#    Settings → Developer Options → Wireless Debugging → Enable
#    Tap 'Pair device with pairing code'
#    Note the IP:Port shown for pairing (e.g., 192.168.1.5:37000)
#    Note the 6-digit pairing code

# 2. On your computer:
adb pair 192.168.1.5:37000
# Enter the 6-digit code when prompted
# Expected: Successfully paired to ...

# 3. Now connect (use the 'IP & port' shown in Wireless Debugging screen, NOT the pairing port)
adb connect 192.168.1.5:5555

# 4. Verify
adb devices
# Expected: 192.168.1.5:5555   device
```

**Reconnecting on WiFi after restart (Windows & Linux):**
```bash
# Just run this again (phone IP may change if DHCP)
adb connect 192.168.1.XXX:5555
adb devices
```

---

#### Useful ADB Commands (Windows & Linux)

```bash
adb devices                      # List connected devices
adb kill-server                  # Kill ADB server
adb start-server                 # Start ADB server
adb reboot                       # Reboot device
adb install path/to/app.apk      # Install APK
adb logcat                       # View device logs
adb shell                        # Open device shell
adb tcpip 5555                   # Switch to WiFi mode
adb connect <IP>:5555            # Connect via WiFi
adb disconnect                   # Disconnect all WiFi devices
```

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

> ⚠️ This project uses **`expo-dev-client`** — you cannot use Expo Go. You need to build and install the **custom dev client APK** once, then use `npx expo start --dev-client` every time.

---

### Step 1 — Build & Install the Dev Client APK (One-time Setup)

```bash
# Option A: Build locally (requires Android Studio + Android SDK)
npx expo run:android
# This compiles the native APK and installs it on your connected device automatically.

# Option B: Build via EAS (cloud build — no Android Studio needed)
npx eas build --profile development --platform android
# Download the .apk from the link provided and install it on your device manually.
```

> 📱 Make sure your device is connected via USB or WiFi (see ADB setup above) **before** running `npx expo run:android`.

---

### Step 2 — Start the Dev Server (Every Time)

```bash
npx expo start --dev-client
```

This launches the **Expo dev server** in dev-client mode. Your terminal will show:
- A QR code
- Options: press `a` to open on Android, `i` for iOS, `w` for web

Open the **custom dev client app** on your phone (installed in Step 1), and it will connect automatically — or scan the QR code from inside the app.

---

### Other Useful Start Variants

```bash
# Clear cache and start fresh (use when you see bundler errors)
npx expo start --dev-client --clear

# Force LAN mode (use when device can't find server on WiFi)
npx expo start --dev-client --lan

# Force localhost/tunnel mode (use when on different networks)
npx expo start --dev-client --tunnel

# Start on a specific port
npx expo start --dev-client --port 8081
```

---

### Run on Android Emulator

```bash
# Make sure Android Studio is installed, an AVD is created and running
npx expo start --dev-client
# Then press 'a' in the terminal to open on the emulator

# Or directly:
npx expo run:android
```

### Run on iOS (macOS only)

```bash
npx expo run:ios
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
| `npx expo start --dev-client` | ⭐ Start dev server (dev-client mode) |
| `npx expo start --dev-client --clear` | Start with cleared cache |
| `npx expo start --dev-client --tunnel` | Start with tunnel (different networks) |
| `npx expo run:android` | Build & install APK on connected Android device |
| `npx expo run:ios` | Build & run on iOS (macOS only) |
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
