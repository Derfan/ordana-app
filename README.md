# 💰 Ordana - Personal Finance Manager

<div align="center">

**A modern, cross-platform personal finance management app built with React Native and Expo**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📱 Features

### 💳 **Account Management**
- Create and manage multiple accounts
- Track real-time balances across all accounts
- View total balance at a glance
- Support for different account types

### 📊 **Transaction Tracking**
- Record income and expenses
- Categorize transactions for better insights
- Add notes and descriptions
- Smart date-based filtering

### 🎯 **Category System**
- Flexible category management for income and expenses
- Customizable icons and colors
- Pre-defined system categories
- Create custom categories for your needs

### 📈 **Analytics & Insights**
- Interactive pie charts for spending analysis
- Category-based spending breakdown
- Percentage distribution visualization
- Historical transaction view

---

## 🛠️ Tech Stack

### **Core**
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe development
- **Expo Router** - File-based navigation

### **State Management**
- **Zustand** - Lightweight state management
- **React Hooks** - Local state and effects

### **Database**
- **Expo SQLite** - Local database storage
- **Drizzle ORM** - Type-safe database queries and migrations
- **Repository Pattern** - Clean data access layer

### **UI Components**
- **React Native Gifted Charts** - Beautiful data visualizations
- **Expo Symbols** - Native SF Symbols integration
- **Themed Components** - Dark/light mode support

### **Development**
- **ESLint** - Code linting
- **Babel** - JavaScript compilation
- **Metro** - React Native bundler

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20 or higher)
- **npm** or **yarn**
- **Expo CLI** (optional, but recommended)
- **iOS Simulator** (macOS) or **Android Emulator**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Derfan/ordana-app.git
   cd ordana-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

---

## 📁 Project Structure

```
ordana-app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── explore.tsx          # Analytics screen
│   │   ├── history.tsx          # Transaction history
│   │   └── settings/            # Settings screens
│   ├── _layout.tsx              # Root layout
│   └── modal.tsx                # Modal screens
├── src/
│   ├── components/              # Reusable UI components
│   │   └── ui/                  # Base UI components
│   ├── constants/               # App constants and themes
│   ├── db/                      # Database layer
│   │   ├── client.ts           # Database client
│   │   ├── schema.ts           # Database schema
│   │   └── repositories/       # Data access layer
│   ├── features/                # Feature modules
│   │   ├── accounts/           # Account management
│   │   ├── analytics/          # Analytics and charts
│   │   ├── categories/         # Category management
│   │   ├── transactions/       # Transaction management
│   │   └── import/             # Data import functionality
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # Zustand state stores
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── drizzle/                     # Database migrations
└── scripts/                     # Build and setup scripts
```

---

## 🗄️ Database Schema

### **Accounts**
- Stores user's financial accounts (bank accounts, wallets, etc.)
- Tracks current balance for each account

### **Categories**
- Income and expense categories
- Customizable icons and colors
- System and user-defined categories

### **Transactions**
- Complete transaction records
- Links to accounts and categories
- Timestamps and descriptions

### **Migrations**
Managed by Drizzle Kit:
```bash
npm run db:generate  # Generate migration files
npm run db:studio    # Open Drizzle Studio
```

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate database migrations |
| `npm run db:studio` | Open Drizzle Studio UI |
| `npm run db:check` | Check migration consistency |

---

## 🎨 Key Features Explained

### **Themed Components**
The app supports both light and dark modes with automatic theme switching based on system preferences.

### **Repository Pattern**
Clean separation of data access logic using repository pattern for maintainable and testable code.

### **Feature-Based Architecture**
Code organized by features (accounts, transactions, categories) for better scalability and maintainability.

### **Type Safety**
Full TypeScript implementation with strict type checking for reduced runtime errors.

### **Responsive Design**
Optimized layouts for different screen sizes and orientations.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Charts by [React Native Gifted Charts](https://gifted-charts.web.app/)
- Database by [Drizzle ORM](https://orm.drizzle.team/)
- State management by [Zustand](https://zustand-demo.pmnd.rs/)

---

<div align="center">

**Made with ❤️ and ☕**

[Report Bug](https://github.com/Derfan/ordana-app/issues) · [Request Feature](https://github.com/Derfan/ordana-app/issues)

</div>
