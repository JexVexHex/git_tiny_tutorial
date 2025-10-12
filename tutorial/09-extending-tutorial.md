# Extending the Tutorial - Add Your Own Lessons

## Introduction

Welcome to the meta-lesson! 🎓 This lesson teaches you how to extend the Git Tiny Tutorial™ by adding your own custom lessons, quizzes, and exercises. Perfect for educators, trainers, or anyone who wants to customize this tutorial for their specific needs.

## Understanding the Architecture

The Git Tiny Tutorial™ is built with vanilla JavaScript, HTML, and CSS. It's a static site with no build process, making it easy to modify and extend.

### Core Components

- **`index.html`** - Main application entry point with navigation and theme system
- **`script.js`** - GitTutorial class handling all interactive functionality
- **`styles.css`** - Complete styling with CSS custom properties
- **`tutorial/`** - Directory containing all lesson markdown files

### How Lessons Work

1. Lesson content is written in **Markdown** files (`.md`)
2. Files are numbered sequentially (e.g., `01-git-basics.md`, `02-git-terminology.md`)
3. The `GitTutorial` class loads lessons dynamically via `fetch()`
4. Markdown is parsed to HTML using the **marked.js** library
5. Code blocks are syntax-highlighted with **prism.js**

## Step-by-Step: Adding a New Lesson

Let's walk through adding a complete lesson with quiz questions and exercises.

### Step 1: Create the Markdown File

Create a new numbered markdown file in the `tutorial/` directory:

```bash
# Navigate to the tutorial directory
cd tutorial/

# Create your new lesson file
touch 10-my-custom-lesson.md
```

**Naming Convention**: Use the format `NN-descriptive-name.md` where `NN` is the lesson number.

### Step 2: Write Your Lesson Content

Open your new markdown file and structure it like this:

```markdown
# Your Lesson Title - Subtitle

## Introduction

Start with a brief introduction explaining what this lesson covers.

## Main Concept 1

Explain your first concept with clear examples.

### Subsection

Break down complex topics into digestible subsections.

```bash
# Include code examples
git your-command --with-flags
```

## Main Concept 2

Continue with additional concepts...

### Visual Aids

Use code blocks, lists, and formatting to make content scannable:

- **Bold** for emphasis
- `code` for commands and technical terms
- > Blockquotes for important notes

## Quiz Time! 🎯

**Question 1**: Your first quiz question?

- A) Option 1
- B) Option 2
- C) Option 3
- D) Option 4

## Practice Exercise

Provide hands-on exercises for learners to try.

## Next Steps

Wrap up and preview the next lesson.

---

**Progress**: You've completed X% of the Git Tiny Tutorial™
```

### Step 3: Register the Lesson in script.js

Open `script.js` and locate the `constructor()` method (around line 3-14):

```javascript
class GitTutorial {
    constructor() {
        this.currentLesson = 0;
        this.lessons = [
            '01-git-basics.md',
            '02-git-terminology.md',
            '03-branches-and-merging.md',
            '04-remote-repositories.md',
            '05-advanced-techniques.md',
            '06-git-merge-mastery.md',
            '07-git-worktrees.md',
            '08-git-tags.md',
            // Add your new lesson here:
            '10-my-custom-lesson.md'
        ];
        // ...
    }
}
```

**Important**: Add your lesson filename to the `this.lessons` array in sequential order.

### Step 4: Add Quiz Questions

Find the `initializeQuizData()` method (around line 142):

```javascript
initializeQuizData() {
    return {
        0: [ /* Lesson 1 quizzes */ ],
        1: [ /* Lesson 2 quizzes */ ],
        // ... existing lessons ...
        9: [ // Your new lesson (index 9 for lesson 10)
            {
                question: "What is the main purpose of this feature?",
                options: [
                    "Option A - Incorrect",
                    "Option B - Correct answer",
                    "Option C - Incorrect",
                    "Option D - Incorrect"
                ],
                correct: 1, // Index of correct answer (0-based)
                explanation: "Explain why this is the correct answer."
            },
            {
                question: "Your second question?",
                options: [
                    "First option",
                    "Second option",
                    "Third option",
                    "Fourth option"
                ],
                correct: 2,
                explanation: "Detailed explanation of the answer."
            }
            // Add 2-4 questions per lesson
        ]
    };
}
```

**Quiz Best Practices**:
- Include 2-4 questions per lesson
- Make questions test understanding, not just memorization
- Provide clear, educational explanations
- Use the `correct` field as a 0-based index (0 = first option, 1 = second, etc.)

### Step 5: Add Practice Exercise

Find the `initializeExerciseData()` method (around line 502):

```javascript
initializeExerciseData() {
    return {
        0: `# Practice Exercise: Lesson 1...`,
        1: `# Practice Exercise: Lesson 2...`,
        // ... existing lessons ...
        9: `# Practice Exercise: Your Custom Lesson

Provide hands-on practice for learners:

\`\`\`bash
# 1. First step with command
git your-command

# 2. Second step
git another-command --with-flag

# 3. Verify the result
git status
\`\`\`

**Try it yourself!** Run these commands and observe the results.

**Bonus Challenge:**

\`\`\`bash
# Advanced exercise for motivated learners
git advanced-command
\`\`\`

**Goal:** Clearly state what learners should achieve.`
    };
}
```

### Step 6: Add Navigation Link

Open `index.html` and find the navigation menu (around line 46-55):

```html
<div class="nav-menu" id="navMenu">
  <a href="#lesson-1" class="nav-link active" data-lesson="1">Basics</a>
  <a href="#lesson-2" class="nav-link" data-lesson="2">Terminology</a>
  <a href="#lesson-3" class="nav-link" data-lesson="3">Branches</a>
  <a href="#lesson-4" class="nav-link" data-lesson="4">Remote</a>
  <a href="#lesson-5" class="nav-link" data-lesson="5">Advanced</a>
  <a href="#lesson-6" class="nav-link" data-lesson="6">Merge Mastery</a>
  <a href="#lesson-7" class="nav-link" data-lesson="7">Worktrees</a>
  <a href="#lesson-8" class="nav-link" data-lesson="8">Tags</a>
  <!-- Add your new lesson link -->
  <a href="#lesson-10" class="nav-link" data-lesson="10">My Lesson</a>
</div>
```

**Note**: The `data-lesson` attribute should match the lesson's position in the array (1-based).

### Step 7: Update Lesson Title

Find the `getLessonTitle()` method in `script.js` (around line 847):

```javascript
getLessonTitle(lessonIndex) {
    const titles = [
        'Git Basics - Understanding Version Control',
        'Git Terminology - Understanding the Language',
        'Branches and Merging - Working with Multiple Versions',
        'Remote Repositories - Collaboration and Backup',
        'Advanced Git Techniques - Power User Skills',
        'Git Merge Mastery - Orchestrating Histories',
        'Git Worktrees - Parallel Development Made Easy',
        'Git Tags - Marking Important Milestones',
        // Add your lesson title
        'My Custom Lesson - Your Subtitle Here'
    ];
    return titles[lessonIndex] || 'Lesson';
}
```

## Testing Your New Lesson

### 1. Start a Local Server

The tutorial requires a local server due to CORS restrictions:

```bash
# Option 1: Python HTTP server
python3 -m http.server 8000

# Option 2: Node.js live-server (with auto-reload)
npm run dev

# Option 3: Any static file server
npx serve .
```

### 2. Open in Browser

Navigate to `http://localhost:8000` (or your server's URL)

### 3. Test Checklist

- [ ] Lesson appears in navigation menu
- [ ] Clicking the nav link loads your lesson
- [ ] Markdown renders correctly (headings, code blocks, lists)
- [ ] Code syntax highlighting works
- [ ] Quiz questions display properly
- [ ] Quiz answers are validated correctly
- [ ] Practice exercise appears below the quiz
- [ ] Navigation buttons (Previous/Next) work
- [ ] Progress bar updates appropriately

## Advanced Customization

### Custom Markdown Features

The tutorial uses **marked.js v4.3.0** with custom configuration:

```javascript
// Headings automatically get IDs for deep linking
renderer.heading = function(text, level, raw) {
    const id = slugifyFunc(raw);
    return `<h${level} id="${id}">${text}</h${level}>\n`;
};
```

This means you can link directly to sections:
```markdown
See the [Installation Guide](#installation-guide) for details.
```

### Styling Your Content

The tutorial uses CSS custom properties for theming. You can add custom styles in `styles.css`:

```css
/* Add custom styles for specific lesson elements */
.lesson-content .custom-callout {
    background: var(--accent-color);
    padding: 1rem;
    border-radius: 8px;
}
```

Then use it in your markdown with HTML:

```html
<div class="custom-callout">
  <strong>Pro Tip:</strong> This is a custom styled callout!
</div>
```

### Adding Images

Place images in a new `images/` directory and reference them:

```markdown
![Git Workflow Diagram](../images/workflow-diagram.png)
```

### Interactive Elements

You can embed interactive elements using HTML in markdown:

```html
<details>
  <summary>Click to reveal answer</summary>
  <p>This is the hidden content that appears when clicked.</p>
</details>
```

## File Structure Reference

```
git_tiny_tutorial/
├── index.html              # Main HTML file
├── script.js               # Application logic
├── styles.css              # Styling
├── tutorial/               # Lesson files
│   ├── 01-git-basics.md
│   ├── 02-git-terminology.md
│   ├── ...
│   └── 10-my-custom-lesson.md  # Your new lesson
├── images/                 # Optional: for lesson images
└── README.md              # Project documentation
```

## Common Pitfalls & Solutions

### Issue: Lesson Not Loading

**Symptoms**: Clicking the nav link does nothing or shows an error.

**Solutions**:
1. Check that the filename in `this.lessons` array matches exactly
2. Verify the file exists in the `tutorial/` directory
3. Check browser console for fetch errors
4. Ensure you're using a local server (not `file://` protocol)

### Issue: Quiz Not Appearing

**Symptoms**: Quiz section doesn't show up.

**Solutions**:
1. Verify you added quiz data with the correct lesson index
2. Check that the index matches the lesson's position in the array
3. Ensure quiz data structure matches the expected format
4. Look for JavaScript errors in the browser console

### Issue: Code Blocks Not Highlighted

**Symptoms**: Code appears as plain text without syntax highlighting.

**Solutions**:
1. Specify the language in code fences: ` ```bash ` not just ` ``` `
2. Check that prism.js is loading (view page source)
3. Verify the language is supported by prism.js

### Issue: Markdown Not Rendering

**Symptoms**: Raw markdown text appears instead of formatted HTML.

**Solutions**:
1. Check that marked.js is loading from CDN
2. Verify markdown syntax is correct
3. Look for JavaScript errors preventing parsing
4. Test markdown in an online parser first

## Best Practices for Lesson Content

### 1. Structure & Flow

- **Start broad, then narrow**: Begin with overview, then dive into details
- **Use progressive disclosure**: Introduce concepts incrementally
- **Include examples**: Every concept should have a practical example
- **End with practice**: Always provide hands-on exercises

### 2. Writing Style

- **Be conversational**: Write like you're teaching a friend
- **Use analogies**: Compare technical concepts to familiar ideas
- **Keep it concise**: Respect learners' time and attention
- **Highlight key terms**: Use **bold** for important concepts

### 3. Code Examples

- **Make them runnable**: Learners should be able to copy-paste and run
- **Add comments**: Explain what each command does
- **Show output**: Include expected results when helpful
- **Use realistic scenarios**: Avoid contrived examples

### 4. Quiz Design

- **Test understanding**: Not just memorization
- **Provide context**: Questions should relate to real scenarios
- **Explain thoroughly**: Use explanations to reinforce learning
- **Vary difficulty**: Mix easy recall with deeper comprehension

### 5. Exercises

- **Build progressively**: Start simple, increase complexity
- **Include solutions**: Or at least expected outcomes
- **Encourage experimentation**: Suggest variations to try
- **Make it safe**: Warn about destructive commands

## Accessibility Considerations

Make your lessons accessible to all learners:

- Use **semantic HTML** in custom elements
- Provide **alt text** for images
- Ensure **sufficient color contrast**
- Use **descriptive link text** (not "click here")
- Structure content with **proper heading hierarchy**

## Version Control for Your Lessons

Track your custom lessons with Git (meta!):

```bash
# Initialize git in the tutorial directory (if not already done)
git init

# Create a branch for your custom lessons
git checkout -b custom-lessons

# Add your new lesson
git add tutorial/10-my-custom-lesson.md
git add script.js
git add index.html

# Commit your changes
git commit -m "feat: add custom lesson on advanced topic"

# Push to your fork/repository
git push origin custom-lessons
```

## Sharing Your Lessons

### Option 1: GitHub Pages

Host your customized tutorial for free:

```bash
# Push to GitHub
git push origin main

# Enable GitHub Pages in repository settings
# Your tutorial will be live at: https://username.github.io/repo-name
```

### Option 2: Export as Standalone

The tutorial is fully self-contained:

1. Copy the entire directory
2. Share as a ZIP file
3. Recipients can run locally with any HTTP server

### Option 3: Contribute Back

If your lesson would benefit others:

1. Fork the original repository
2. Add your lesson
3. Submit a pull request
4. Help the community learn!

## Quiz Time! 🎯

**Question 1**: Where do you add the filename of a new lesson?

- A) In `index.html` only
- B) In the `this.lessons` array in `script.js`
- C) In `styles.css`
- D) In the `tutorial/` directory only

**Question 2**: What is the correct format for quiz question indices?

- A) 1-based (first option = 1)
- B) 0-based (first option = 0)
- C) Alphabetical (A, B, C, D)
- D) Random numbers

**Question 3**: Why must you use a local server instead of opening `index.html` directly?

- A) For better performance
- B) To avoid CORS restrictions when fetching markdown files
- C) To enable syntax highlighting
- D) To save progress

**Question 4**: In which method do you add practice exercises?

- A) `initializeQuizData()`
- B) `initializeExerciseData()`
- C) `getLessonTitle()`
- D) `loadLesson()`

## Practice Exercise

Let's create a mini-lesson together! Follow these steps:

```bash
# 1. Navigate to the tutorial directory
cd tutorial/

# 2. Create a new lesson file
cat > 99-test-lesson.md << 'EOF'
# Test Lesson - My First Custom Lesson

## Introduction

This is my test lesson to practice extending the tutorial.

## Key Concept

Here's an important concept with a code example:

```bash
echo "Hello, Custom Lesson!"
```

## Quiz Time! 🎯

**Question 1**: What did you learn?

- A) Nothing
- B) How to add lessons
- C) How to delete lessons
- D) How to break the tutorial

## Practice Exercise

Try creating your own lesson!

---

**Progress**: You're learning to extend the tutorial!
EOF

# 3. Open script.js and add the lesson
# (You'll need to do this manually in your editor)

# 4. Test your changes
cd ..
python3 -m http.server 8000

# 5. Open http://localhost:8000 in your browser
```

**Your Task**:
1. Create the markdown file above
2. Add it to `script.js` in the `this.lessons` array
3. Add at least 2 quiz questions in `initializeQuizData()`
4. Add a practice exercise in `initializeExerciseData()`
5. Add a navigation link in `index.html`
6. Test that everything works!

## Next Steps

Congratulations! You now know how to extend the Git Tiny Tutorial™ with your own custom content. Here are some ideas for what to create:

- **Git workflows**: Teach GitFlow, GitHub Flow, or trunk-based development
- **Advanced topics**: Submodules, subtrees, or git internals
- **Tool integration**: Git with VS Code, IntelliJ, or other IDEs
- **Team practices**: Code review, commit conventions, or branching strategies
- **Troubleshooting**: Common problems and how to fix them

The tutorial is now yours to customize and extend. Happy teaching! 🎓

---

**Progress**: You've completed the meta-lesson on extending the tutorial!
