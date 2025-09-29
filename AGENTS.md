# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive Git tutorial application built with vanilla JavaScript, HTML, and CSS. It provides 6 comprehensive lessons teaching Git concepts through hands-on exercises, quizzes, and interactive learning.

## Development Commands

### Starting the Application
- `npm run dev` - Start live-server development server (requires live-server installed)
- `npm start` or `npm run serve` - Start Python HTTP server on port 8000
- Direct: `python3 -m http.server 8000` then open `http://localhost:8000`

### Build & Test
- `npm run build` - No build process (static files only)
- `npm test` - No tests specified

## Architecture

### Core Files
- `index.html` - Main application entry point with navigation and theme system
- `script.js` - GitTutorial class handling all interactive functionality
- `styles.css` - Complete styling with CSS custom properties and animations
- `tutorial/` - Markdown lesson files (01-06)

### Key Components

#### GitTutorial Class (script.js)
- Main application controller
- Handles lesson navigation, quiz system, and progress tracking
- Uses localStorage for progress persistence
- Lesson files hardcoded in `this.lessons` array (lines 5-12)
- Quiz and exercise data initialized in constructor

#### Lesson System
- 6 lessons in numbered markdown files (01-06)
- Loaded dynamically via fetch() and parsed with marked.js
- Content includes interactive quizzes and practice exercises
- Navigation supports both sequential and direct lesson access

#### Theme System
- System/light/dark theme selection
- Theme persistence in localStorage
- CSS custom properties for theming
- Inline script in HTML prevents theme flash

#### Progress Tracking
- User progress stored in localStorage
- Visual progress bar updates during lesson navigation
- Scroll progress tracking within lessons

### External Dependencies
- marked.js (CDN) - Markdown parsing
- prism.js (CDN) - Syntax highlighting
- Google Fonts - Inter font family
- live-server (dev dependency) - Development server

## Adding New Lessons

1. Create numbered markdown file in `tutorial/` (e.g., `07-new-lesson.md`)
2. Add filename to `this.lessons` array in script.js constructor
3. Add corresponding quiz data to `initializeQuizData()` method
4. Add exercise data to `initializeExerciseData()` method
5. Update navigation links in index.html if needed

## File Structure Notes

- Static site - no build process required
- All assets served directly from filesystem
- CORS restrictions apply when opening index.html directly (use local server)
- Tutorial content stored as separate markdown files for easy editing