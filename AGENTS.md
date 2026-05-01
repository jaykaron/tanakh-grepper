# AGENTS.md

This file provides guidance to Coding Agents working with code in this repository.

## Project Overview

Tanakh Grepper is a React-based web application for searching biblical text (Hebrew Bible/Tanakh) using regular expressions. The application provides both English and Hebrew language support and allows users to search across different sections, books, and chapters of the Tanakh.

## Development Commands

- `npm start` - Start development server (runs on http://localhost:3000)
- `npm run build` - Build for production
- `npm test` - Run tests in interactive watch mode
- `npm run lint` - Run Prettier for code formatting (note: limited lint functionality)
- `npm run deploy` - Deploy to GitHub Pages (runs build first)

## Architecture

### Core Components Structure

The application follows a standard React component architecture:

- **App.js** - Main application component managing global state (search results, language, welcome dialog)
- **Search.js** - Complex search interface with hierarchical selection (Section → Book → Chapter) and regex input
- **PassukLister.js** - Displays search results with highlighting and navigation
- **Welcome.js** - Welcome dialog component
- **BottomBar.js** - Contains language toggle and info button

### Data Management

The application uses static JSON files for biblical text data:

- **textContent.js** - Core search functionality with regex support for Hebrew text
- **translation.js** - Language translation mappings (English ↔ Hebrew)
- **JSON Data Structure** - Located in `src/jsonText/` organized by sections:
  - `Torah/` - Five books of Moses
  - `Prophets/` - Nevi'im books
  - `Writings/` - Ketuvim books

### Key Features

- **Hierarchical Search** - Users can search across all text, specific sections, books, or chapters
- **Regex Support** - Full regular expression support with Hebrew character class mapping (`\w` → `[א-ת]`)
- **Bilingual Interface** - Dynamic language switching between English and Hebrew
- **URL State Management** - Search parameters are reflected in URL for sharing
- **Results Storage** - Search results are saved to `window.tgResults` for debugging

### Special Handling

- **Hebrew Regex** - The `hebraicizeRegex()` function automatically converts `\w` patterns to Hebrew character ranges
- **RTL Support** - CSS direction switching based on selected language
- **Material-UI Styling** - Uses Material-UI v4 with custom theming and responsive design

## State Management

The application uses React hooks for state management:
- `useSetState` from ahooks for object state updates
- URL synchronization for search parameters
- No external state management library (Redux, Context API, etc.)

## Testing

The project uses Create React App's default testing setup with Jest and React Testing Library. Test files should follow the `*.test.js` pattern.