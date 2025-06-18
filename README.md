# Hydrated - React Native Expo

A neubrutalism-style hydration tracking app built with React Native and Expo, based on the original Flutter design.

## Features

- 🎨 **Neubrutalism Design**: Bold colors, thick borders, and geometric shapes
- 💧 **Hydration Tracking**: Log different types of beverages
- 📊 **Progress Visualization**: Circular progress indicator matching Figma design
- 📅 **Weekly Calendar**: Interactive day selection
- 📈 **History & Stats**: Detailed tracking and analytics
- ⚙️ **Customizable Settings**: Daily goals and notification preferences
- 🎯 **Anti-Anxiety Features**: Mindfulness exercises integration

## Design Implementation

This React Native version faithfully recreates the Figma design featuring:
- Weekly calendar with Thursday (13th) selected
- Circular progress showing 1500 mL with blue indicator
- Progress cards displaying "82%" and "2500 mL Daily Target"
- Anti-anxiety section with navigation arrows and interactive elements
- Settings icon in top-right corner with proper neubrutalism styling

## Getting Started

### Prerequisites

- Node.js (14 or newer)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device

### Installation

1. Navigate to the project directory:
   ```bash
   cd hydrated-rn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   expo start
   ```

4. Scan the QR code with Expo Go to run on your device

### Running on Different Platforms

- **iOS**: `expo start --ios` (requires iOS Simulator)
- **Android**: `expo start --android` (requires Android Emulator)
- **Web**: `expo start --web`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── NeubrutCard.tsx     # Card component with neubrutalism styling
│   ├── NeubrutButton.tsx   # Button with thick borders and shadows
│   ├── CircularProgress.tsx # Progress indicator from Figma
│   ├── WeeklyCalendar.tsx  # Interactive calendar component
│   ├── ProgressCard.tsx    # Progress display cards
│   └── AntiAnxietySection.tsx # Anxiety exercises section
├── screens/             # App screens
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx      # Main dashboard (Figma design)
│   ├── AddBeverageScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SettingsScreen.tsx
├── services/            # Data management
│   └── HydrationService.ts # AsyncStorage service
├── constants/           # Design system
│   ├── Colors.ts           # Neubrutalism color palette
│   └── Typography.ts       # Text styles
├── types/               # TypeScript definitions
│   └── index.ts
└── navigation/          # Navigation setup
    └── AppNavigator.tsx
```

## Key Components

### NeubrutCard
- Thick black borders (3px)
- Drop shadows with 6px offset
- Bold, geometric styling

### CircularProgress
- SVG-based progress indicator
- Matches Figma design exactly
- Shows current intake (1500 mL)

### WeeklyCalendar
- Interactive day selection
- Thursday (13th) selected by default
- Neubrutalism button styling

### Progress Cards
- "82%" progress display
- "2500 mL" daily target
- Clean, bold typography

## Data Persistence

Uses AsyncStorage for:
- Hydration entries
- User settings
- Daily goals
- Notification preferences

## Expo Compatibility

Fully compatible with Expo Go for easy testing:
- No native modules requiring ejection
- Uses only Expo SDK components
- Cross-platform (iOS, Android, Web)

## Design System

### Colors
- Electric Blue: #00D4FF
- Hot Pink: #FF006E  
- Lime Green: #8AC926
- Black: #000000
- White: #FFFFFF
- Background: #F8F9FA

### Typography
- Bold, heavy fonts (700-900 weight)
- Uppercase titles
- Clear hierarchy

### Shadows & Borders
- 3px black borders on all elements
- 6px drop shadows
- No border radius (geometric shapes)

## Contributing

1. Follow the established neubrutalism design patterns
2. Maintain thick borders and bold colors
3. Use the existing component library
4. Test on both iOS and Android via Expo Go

## License

MIT License - See LICENSE file for details