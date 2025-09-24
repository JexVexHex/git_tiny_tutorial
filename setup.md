# Git Tiny Tutorial™ - Setup Guide

## Quick Start

### Option 1: Direct Browser Access
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start learning!

### Option 2: Local Server (Recommended)
For the best experience, serve the files through a local web server:

#### Using Python (Built-in)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Using Node.js
```bash
# Install live-server globally
npm install -g live-server

# Start the server
live-server --port=8000 --open=index.html
```

#### Using PHP
```bash
php -S localhost:8000
```

### Option 3: Using npm scripts
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use Python server
npm start
```

## File Structure
```
git-tiny-tutorial/
├── index.html              # Main application
├── demo.html               # Demo page
├── styles.css              # Styling and animations
├── script.js               # Interactive functionality
├── package.json            # npm configuration
├── setup.md                # This file
├── README.md               # Main documentation
├── tutorial/               # Lesson content
│   ├── 01-git-basics.md
│   ├── 02-git-terminology.md
│   ├── 03-branches-and-merging.md
│   ├── 04-remote-repositories.md
│   └── 05-advanced-techniques.md
└── .git/                   # Git repository (if cloned)
```

## Browser Requirements
- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- JavaScript enabled
- Local storage support (for progress tracking)

## Troubleshooting

### CORS Issues
If you encounter CORS (Cross-Origin Resource Sharing) issues when opening `index.html` directly:
- Use a local web server instead of opening the file directly
- The tutorial files need to be served over HTTP/HTTPS, not the `file://` protocol

### Markdown Not Loading
If lesson content doesn't appear:
- Check that the `tutorial/` folder exists and contains the `.md` files
- Ensure you're using a local web server
- Check the browser console for any error messages

### Progress Not Saving
If your progress isn't being saved:
- Check that your browser supports local storage
- Ensure JavaScript is enabled
- Try clearing your browser's local storage and starting fresh

## Development

### Adding New Lessons
1. Create a new markdown file in the `tutorial/` folder
2. Follow the naming convention: `XX-lesson-name.md`
3. Update the `lessons` array in `script.js`
4. Add corresponding quiz data in the `quizData` object
5. Add exercise content in the `exerciseData` object

### Customizing Styling
- Modify `styles.css` for visual changes
- The CSS uses CSS custom properties (variables) for easy theming
- All animations and transitions are defined in the CSS file

### Adding Features
- The main application logic is in `script.js`
- The `GitTutorial` class handles all interactive functionality
- Quiz data and exercises are defined in the constructor

## Support

If you encounter any issues:
1. Check this setup guide
2. Review the browser console for error messages
3. Ensure all files are present and properly named
4. Try using a different browser or local server

## License

This project is open source and available under the MIT License.
