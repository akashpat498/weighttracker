# WeightTracker 🏋️

A workout-tracking app built with Expo + React Native. This repo was scaffolded with the same
stack as Tab Splitter: expo-router, NativeWind, TypeScript, AsyncStorage, an optional server with
LLM + rate-limiting, and PostHog analytics.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy the example env file and fill in any keys you need (all optional for local dev)

   ```bash
   cp .env.example .env
   ```

3. Start the app

   ```bash
   npx expo start
   ```

Open the project in a [development build](https://docs.expo.dev/develop/development-builds/introduction/),
[Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/),
[iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), or
[Expo Go](https://expo.dev/go).

## Project structure

See [CLAUDE.md](CLAUDE.md) for the full directory layout, architecture, and environment variables.

App screens live in `app/` (file-based routing). The main tabs are **History**, **Log** (center
button), and **Settings**. Most feature screens are placeholders pending the MVP scope.

## Scripts

```bash
npm run lint        # lint
npm run ios         # start + open iOS simulator
npm run android     # start + open Android emulator
npm run web         # start web
```
