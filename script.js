// Git Tiny Tutorial™ - Interactive Learning Application
class GitTutorial {
    constructor() {
        this.currentLesson = 0;
        this.lessons = [
            '01-git-basics.md',
            '02-git-terminology.md',
            '03-branches-and-merging.md',
            '04-remote-repositories.md',
            '05-advanced-techniques.md',
            '06-git-merge-mastery.md'
        ];
        this.quizData = this.initializeQuizData();
        this.exerciseData = this.initializeExerciseData();
        this.userProgress = this.loadProgress();
        this.startTime = Date.now();
        this.scrollTimeout = null; // For throttling scroll events
        this.searchIndex = []; // Cache for search content
        this.searchDebounceTimeout = null;
        this.selectedSearchResult = 0;

        // Guard system references (for cleanup)
        this.searchButtonObserver = null;
        this.searchWindowObserver = null;
        this.searchButtonHealthCheck = null;

        // Configure marked.js renderer to add IDs to headings
        this.configureMarkdownRenderer();

        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.setupTheme();
        this.updateProgressBar();
        this.loadSearchIndex();
        this.showWelcome();

        // Make GitTutorial accessible globally for button click handler
        window.gitTutorial = this;
    }

    configureMarkdownRenderer() {
        // Configure marked.js to automatically add IDs to headings
        const renderer = new marked.Renderer();
        const slugifyFunc = this.slugify.bind(this);

        // Use marked.js v4.3.0 API with (text, level, raw) signature
        renderer.heading = function(text, level, raw) {
            const id = slugifyFunc(raw);
            return `<h${level} id="${id}">${text}</h${level}>\n`;
        };

        marked.setOptions({
            renderer: renderer,
            breaks: true,
            gfm: true
        });
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('startButton').addEventListener('click', () => this.startTutorial());
        document.getElementById('backButton').addEventListener('click', () => this.showWelcome());
        document.getElementById('prevLesson').addEventListener('click', () => this.previousLesson());
        document.getElementById('nextLesson').addEventListener('click', () => this.nextLesson());
        document.getElementById('prevLessonBottom').addEventListener('click', () => this.previousLesson());
        document.getElementById('nextLessonBottom').addEventListener('click', () => this.nextLesson());
        document.getElementById('restartTutorial').addEventListener('click', () => this.restartTutorial());

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lessonIndex = parseInt(link.dataset.lesson) - 1;
                this.loadLesson(lessonIndex);
            });
        });

        // Quiz
        document.getElementById('submitQuiz').addEventListener('click', () => this.submitQuiz());
        
        // Exercise
        document.getElementById('completeExercise').addEventListener('click', () => this.completeExercise());

        // Mobile navigation
        document.getElementById('navToggle').addEventListener('click', () => this.toggleMobileNav());

        // Scroll events for progress bar
        window.addEventListener('scroll', () => this.handleScroll());

        // Search
        document.getElementById('searchClose').addEventListener('click', () => this.closeSearch());
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearchInput(e));

        // Draggable search button and window
        this.initDraggableSearchButton();
        this.initDraggableSearch();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }
    
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'system';
        const select = document.getElementById('themeSelect');

        const apply = (theme) => {
            if (theme === 'system') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', theme);
            }
        };

        apply(savedTheme);

        if (select) {
            select.value = savedTheme;
            select.addEventListener('change', (e) => {
                const value = e.target.value;
                localStorage.setItem('theme', value);
                apply(value);
            });
        }

        const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        if (mql && mql.addEventListener) {
            mql.addEventListener('change', () => {
                const current = localStorage.getItem('theme') || 'system';
                if (current === 'system') {
                    // let CSS media query handle the change by removing explicit attribute
                    document.documentElement.removeAttribute('data-theme');
                }
            });
        }
    }

    initializeQuizData() {
        return {
            0: [ // Git Basics
                {
                    question: "What does `git init` do?",
                    options: [
                        "Creates a new file",
                        "Initializes a new Git repository", 
                        "Installs Git on your computer",
                        "Deletes all your files"
                    ],
                    correct: 1,
                    explanation: "`git init` creates a new Git repository in your current directory."
                },
                {
                    question: "What is a commit?",
                    options: [
                        "A type of file",
                        "A snapshot of your project at a point in time",
                        "A Git command",
                        "A programming language"
                    ],
                    correct: 1,
                    explanation: "A commit is a snapshot of your project that includes all changes, a message, and metadata."
                },
                {
                    question: "What does HEAD represent?",
                    options: [
                        "The top of your file",
                        "A pointer to your current commit",
                        "The beginning of your project", 
                        "A Git configuration file"
                    ],
                    correct: 1,
                    explanation: "HEAD is a pointer that shows which commit you're currently on."
                },
                {
                    question: "What's the correct Git workflow?",
                    options: [
                        "Commit → Add → Edit",
                        "Edit → Add → Commit",
                        "Add → Edit → Commit",
                        "Edit → Commit → Add"
                    ],
                    correct: 1,
                    explanation: "The correct workflow is: Edit files → Add changes to staging → Commit changes."
                }
            ],
            1: [ // Terminology
                {
                    question: "What does HEAD represent?",
                    options: [
                        "The top of your file",
                        "A pointer to your current commit",
                        "The beginning of your project",
                        "A Git configuration file"
                    ],
                    correct: 1,
                    explanation: "HEAD is a pointer that indicates which commit you're currently on."
                },
                {
                    question: "When does a fast-forward merge occur?",
                    options: [
                        "When there are conflicts",
                        "When the target branch hasn't diverged",
                        "When you use `git rebase`",
                        "When you delete a branch"
                    ],
                    correct: 1,
                    explanation: "Fast-forward merge occurs when the target branch hasn't diverged from your current branch."
                },
                {
                    question: "What's the difference between `git reset --soft` and `git reset --hard`?",
                    options: [
                        "No difference",
                        "Soft keeps changes staged, hard loses all changes",
                        "Soft is faster than hard",
                        "Hard is more dangerous than soft"
                    ],
                    correct: 1,
                    explanation: "Soft reset keeps changes staged, while hard reset loses all changes permanently."
                },
                {
                    question: "What does MERGE_HEAD point to during a merge?",
                    options: [
                        "The current branch",
                        "The commit being merged",
                        "The main branch",
                        "The staging area"
                    ],
                    correct: 1,
                    explanation: "MERGE_HEAD points to the commit you're merging into your current branch."
                }
            ],
            2: [ // Branches and Merging
                {
                    question: "What is the main purpose of branches?",
                    options: [
                        "To store different files",
                        "To work on features without affecting main code",
                        "To backup your code",
                        "To organize your files"
                    ],
                    correct: 1,
                    explanation: "Branches allow you to work on features without affecting the main codebase."
                },
                {
                    question: "What command creates and switches to a new branch?",
                    options: [
                        "`git branch new-branch`",
                        "`git checkout -b new-branch`",
                        "`git create new-branch`",
                        "`git switch new-branch`"
                    ],
                    correct: 1,
                    explanation: "`git checkout -b` creates and switches to a new branch in one command."
                },
                {
                    question: "When does a merge conflict occur?",
                    options: [
                        "When branches have different names",
                        "When the same lines are changed differently",
                        "When you delete a branch",
                        "When you create a new branch"
                    ],
                    correct: 1,
                    explanation: "Merge conflicts occur when the same lines are changed in different ways."
                },
                {
                    question: "What does `git branch -d` do?",
                    options: [
                        "Creates a new branch",
                        "Deletes a merged branch",
                        "Switches to a branch",
                        "Shows branch information"
                    ],
                    correct: 1,
                    explanation: "`git branch -d` deletes a branch that has been merged."
                }
            ],
            3: [ // Remote Repositories
                {
                    question: "What is a remote repository?",
                    options: [
                        "A local backup of your code",
                        "A Git repository hosted on a server",
                        "A branch in your local repository",
                        "A commit in your project"
                    ],
                    correct: 1,
                    explanation: "A remote repository is a Git repository hosted on a server for collaboration."
                },
                {
                    question: "What does `git clone` do?",
                    options: [
                        "Creates a new branch",
                        "Downloads a remote repository to your computer",
                        "Uploads your code to a server",
                        "Merges two branches"
                    ],
                    correct: 1,
                    explanation: "`git clone` downloads a remote repository to your local computer."
                },
                {
                    question: "What's the difference between `git fetch` and `git pull`?",
                    options: [
                        "No difference",
                        "Fetch downloads, pull downloads and merges",
                        "Pull is faster than fetch",
                        "Fetch is for public repos only"
                    ],
                    correct: 1,
                    explanation: "Fetch downloads changes, while pull downloads and merges them automatically."
                },
                {
                    question: "What does `git push -u origin branch-name` do?",
                    options: [
                        "Only pushes the branch",
                        "Pushes and sets upstream tracking",
                        "Deletes the branch",
                        "Creates a new remote"
                    ],
                    correct: 1,
                    explanation: "The `-u` flag pushes the branch and sets up upstream tracking."
                }
            ],
            4: [ // Advanced Techniques
                {
                    question: "What does `git commit --amend` do?",
                    options: [
                        "Creates a new commit",
                        "Modifies the last commit",
                        "Deletes the last commit",
                        "Shows commit history"
                    ],
                    correct: 1,
                    explanation: "`git commit --amend` modifies the last commit's message or adds files to it."
                },
                {
                    question: "What's the difference between `git reset --soft` and `git reset --hard`?",
                    options: [
                        "No difference",
                        "Soft keeps changes staged, hard loses all changes",
                        "Soft is faster than hard",
                        "Hard is more dangerous than soft"
                    ],
                    correct: 1,
                    explanation: "Soft reset keeps changes staged, while hard reset loses all changes permanently."
                },
                {
                    question: "What does `git cherry-pick` do?",
                    options: [
                        "Deletes a commit",
                        "Applies a specific commit to current branch",
                        "Merges two branches",
                        "Creates a new branch"
                    ],
                    correct: 1,
                    explanation: "Cherry-pick applies a specific commit from one branch to another."
                },
                {
                    question: "What is the purpose of Git hooks?",
                    options: [
                        "To store Git configuration",
                        "To automate Git operations",
                        "To backup repositories",
                        "To create branches"
                    ],
                    correct: 1,
                    explanation: "Git hooks are scripts that run automatically at certain points in the Git workflow."
                }
            ],
            5: [ // Merge Mastery
                {
                    question: "What does `git merge --abort` do?",
                    options: [
                        "Resets to the merge commit",
                        "Aborts the merge process and attempts to restore the pre-merge state",
                        "Automatically resolves conflicts",
                        "Deletes the merged branch"
                    ],
                    correct: 1,
                    explanation: "`git merge --abort` stops the merge and attempts to restore your branch to the state it was in before the merge started."
                },
                {
                    question: "Which option ensures Git refuses a merge instead of creating a merge commit?",
                    options: [
                        "`--no-ff`",
                        "`--ff-only`",
                        "`--squash`",
                        "`--autostash`"
                    ],
                    correct: 1,
                    explanation: "`--ff-only` allows a merge only if it can fast-forward; otherwise it aborts without making changes."
                },
                {
                    question: "What benefit does enabling rerere provide?",
                    options: [
                        "Automatic fast-forward merges",
                        "Reuses previously recorded conflict resolutions",
                        "Signs merge commits with GPG",
                        "Automatically stashes changes before a merge"
                    ],
                    correct: 1,
                    explanation: "rerere (`reuse recorded resolution`) remembers how you resolved conflicts and re-applies that resolution next time."
                },
                {
                    question: "When is `git merge --squash` most appropriate?",
                    options: [
                        "When you want to preserve every commit from a feature branch",
                        "When merging unrelated repositories",
                        "When you need a single consolidated commit without merge metadata",
                        "When resolving conflicts automatically"
                    ],
                    correct: 1,
                    explanation: "`--squash` lets you combine all changes into a single commit without creating a merge commit."
                }
            ]
        };
    }

    initializeExerciseData() {
        return {
            0: `# Practice Exercise: Your First Git Repository

Create a new folder and practice these commands:

\`\`\`bash
# 1. Create a new directory
mkdir my-first-repo
cd my-first-repo

# 2. Initialize Git
git init

# 3. Create a file
echo "Hello Git!" > hello.txt

# 4. Check status
git status

# 5. Add the file
git add hello.txt

# 6. Make your first commit
git commit -m "Add hello.txt"

# 7. View your commit history
git log
\`\`\`

**Try it yourself!** Run these commands in your terminal and see Git in action.`,

            1: `# Practice Exercise: Understanding Git Concepts

Let's practice with the concepts you've learned:

\`\`\`bash
# 1. Create a branch and make commits
git checkout -b experiment
echo "New feature" > feature.txt
git add feature.txt
git commit -m "Add new feature"

# 2. Switch back to main and merge
git checkout main
git merge experiment

# 3. Check the merge result
git log --oneline --graph

# 4. Practice reset (be careful!)
echo "Test change" > test.txt
git add test.txt
git reset HEAD test.txt  # Unstage the file
git reset --soft HEAD~1  # Undo last commit, keep changes staged
\`\`\`

**Experiment safely!** These commands help you understand Git's internal workings.`,

            2: `# Practice Exercise: Branching and Merging

Master the art of branching:

\`\`\`bash
# 1. Create a feature branch
git checkout -b my-feature

# 2. Make some changes
echo "Feature code" > feature.txt
git add feature.txt
git commit -m "Add feature implementation"

# 3. Switch back to main
git checkout main

# 4. Make changes to main
echo "Main update" > main.txt
git add main.txt
git commit -m "Update main branch"

# 5. Merge the feature branch
git merge my-feature

# 6. Clean up
git branch -d my-feature
\`\`\`

**Branch like a pro!** Practice creating, switching, and merging branches.`,

            3: `# Practice Exercise: Working with Remote Repositories

Get comfortable with remote operations:

\`\`\`bash
# 1. Create a repository on GitHub (or your preferred service)

# 2. Clone the repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# 3. Make some changes
echo "# My Project" > README.md
git add README.md
git commit -m "Add README"

# 4. Push to remote
git push -u origin main

# 5. Create a feature branch
git checkout -b feature/new-feature
echo "New feature" > feature.txt
git add feature.txt
git commit -m "Add new feature"
git push -u origin feature/new-feature
\`\`\`

**Go remote!** Practice cloning, pushing, and pulling from remote repositories.`,

            4: `# Practice Exercise: Advanced Git Techniques

Master advanced Git skills:

\`\`\`bash
# 1. Create a messy commit history
echo "Feature 1" > feature1.txt
git add feature1.txt
git commit -m "Add feature 1"

echo "Feature 2" > feature2.txt
git add feature2.txt
git commit -m "Add feature 2"

# 2. Clean up with interactive rebase
git rebase -i HEAD~2
# In the editor, change 'pick' to 'squash' for commits you want to combine

# 3. Practice stashing
echo "Work in progress" > wip.txt
git stash push -m "Work in progress"
git stash list
git stash pop

# 4. Create useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
\`\`\`

**Level up!** These advanced techniques will make you a Git power user.`,
            5: `# Practice Exercise: Merge Conflict Mastery

Sharpen your merge skills with this deliberate conflict exercise:

\`\`\`bash
# 1. Create a shared base commit
git checkout -b merge-base
echo "Shared intro" > merge.txt
git add merge.txt
git commit -m "chore: add merge baseline"

# 2. Create diverging branches
git checkout -b feature/alpha
echo "Alpha change" >> merge.txt
git add merge.txt
git commit -m "feat: add alpha change"

git checkout merge-base
git checkout -b feature/beta
echo "Beta change" >> merge.txt
git add merge.txt
git commit -m "feat: add beta change"
\`\`\`

3. **Attempt the merge**

\`\`\`bash
git checkout feature/alpha
git merge feature/beta  # expect a conflict in merge.txt
\`\`\`

4. **Resolve with diff3 markers**

\`\`\`bash
git config merge.conflictStyle diff3
\`\`\`

Open \`merge.txt\`, keep the shared intro, and craft a final version that includes both Alpha and Beta changes harmoniously.

5. **Reuse your resolution**

\`\`\`bash
git add merge.txt
git merge --continue

# Enable rerere and recreate the conflict
git config rerere.enabled true
git merge --abort
git merge feature/beta  # rerere should reapply your resolution
\`\`\`

**Goal:** Understand conflict markers, practice deliberate resolution, and experience how rerere accelerates repeated merges.`
        };
    }

    showWelcome() {
        document.getElementById('welcome').style.display = 'block';
        document.getElementById('lesson-content').style.display = 'none';
        document.getElementById('completion').style.display = 'none';
        this.updateNavigation();
    }

    startTutorial() {
        this.currentLesson = 0;
        this.loadLesson(0);
    }

    async loadLesson(lessonIndex, targetHeadingId = null) {
        if (lessonIndex < 0 || lessonIndex >= this.lessons.length) return;

        this.currentLesson = lessonIndex;
        this.updateNavigation();

        try {
            const response = await fetch(`tutorial/${this.lessons[lessonIndex]}`);
            const markdown = await response.text();

            // Convert markdown to HTML
            const html = marked.parse(markdown);

            // Update lesson content
            document.getElementById('lessonTitle').textContent = this.getLessonTitle(lessonIndex);
            document.getElementById('lessonNumber').textContent = `Lesson ${lessonIndex + 1}`;
            document.getElementById('lessonBody').innerHTML = html;

            // Show lesson content
            document.getElementById('welcome').style.display = 'none';
            document.getElementById('lesson-content').style.display = 'block';
            document.getElementById('completion').style.display = 'none';

            // Scroll to target heading if provided, otherwise scroll to top
            if (targetHeadingId) {
                this.scrollToHeading(targetHeadingId);
            } else {
                this.scrollToTop(true);
            }

            // Update progress
            this.updateProgressBar();

            // Initialize quiz and exercise
            this.initializeQuiz();
            this.initializeExercise();

            // Animate content
            this.animateContent();

        } catch (error) {
            console.error('Error loading lesson:', error);
            this.showError('Failed to load lesson. Please try again.');
        }
    }

    getLessonTitle(lessonIndex) {
        const titles = [
            'Git Basics - Understanding Version Control',
            'Git Terminology - Understanding the Language',
            'Branches and Merging - Working with Multiple Versions',
            'Remote Repositories - Collaboration and Backup',
            'Advanced Git Techniques - Power User Skills',
            'Git Merge Mastery - Orchestrating Histories'
        ];
        return titles[lessonIndex] || 'Lesson';
    }

    slugify(text) {
        // Convert heading text to URL-friendly ID
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_]+/g, '-')   // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
    }

    initializeQuiz() {
        const quizSection = document.getElementById('quizSection');
        const quiz = this.quizData[this.currentLesson];
        
        if (!quiz) {
            quizSection.style.display = 'none';
            return;
        }
        
        quizSection.style.display = 'block';
        this.currentQuiz = quiz;
        this.currentQuestion = 0;
        this.quizScore = 0;
        
        this.showQuestion();
    }

    showQuestion() {
        const question = this.currentQuiz[this.currentQuestion];
        if (!question) return;
        
        const quizQuestion = document.getElementById('quizQuestion');
        const quizProgress = document.getElementById('quizProgress');
        
        quizProgress.textContent = `Question ${this.currentQuestion + 1} of ${this.currentQuiz.length}`;
        
        quizQuestion.innerHTML = `
            <div class="question-text">${question.question}</div>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" data-option="${index}">
                        <input type="radio" name="quiz-answer" value="${index}" id="option-${index}">
                        <label for="option-${index}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add event listeners to options
        quizQuestion.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => this.selectAnswer(option));
        });
        
        document.getElementById('submitQuiz').disabled = true;
    }

    selectAnswer(optionElement) {
        // Remove previous selection
        document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        
        // Select current option
        optionElement.classList.add('selected');
        optionElement.querySelector('input').checked = true;
        
        document.getElementById('submitQuiz').disabled = false;
    }

    submitQuiz() {
        const selectedOption = document.querySelector('input[name="quiz-answer"]:checked');
        if (!selectedOption) return;
        
        const selectedIndex = parseInt(selectedOption.value);
        const question = this.currentQuiz[this.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        if (isCorrect) {
            this.quizScore++;
        }
        
        // Show correct/incorrect feedback
        document.querySelectorAll('.quiz-option').forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Show explanation
        setTimeout(() => {
            const explanation = document.createElement('div');
            explanation.className = 'quiz-explanation';
            explanation.innerHTML = `
                <div class="explanation-content">
                    <strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong>
                    ${question.explanation}
                </div>
            `;
            document.getElementById('quizQuestion').appendChild(explanation);
            
            // Move to next question or complete quiz
            setTimeout(() => {
                this.currentQuestion++;
                if (this.currentQuestion < this.currentQuiz.length) {
                    this.showQuestion();
                } else {
                    this.completeQuiz();
                }
            }, 2000);
        }, 1000);
    }

    completeQuiz() {
        const score = Math.round((this.quizScore / this.currentQuiz.length) * 100);
        const quizQuestion = document.getElementById('quizQuestion');
        
        quizQuestion.innerHTML = `
            <div class="quiz-complete">
                <h3>Quiz Complete! 🎉</h3>
                <div class="quiz-score">
                    <div class="score-circle">
                        <span class="score-number">${score}%</span>
                    </div>
                    <p>You got ${this.quizScore} out of ${this.currentQuiz.length} questions correct!</p>
                </div>
            </div>
        `;
        
        // Update user progress
        this.userProgress.quizScores[this.currentLesson] = score;
        this.saveProgress();
    }

    initializeExercise() {
        const exerciseSection = document.getElementById('exerciseSection');
        const exercise = this.exerciseData[this.currentLesson];
        
        if (!exercise) {
            exerciseSection.style.display = 'none';
            return;
        }
        
        exerciseSection.style.display = 'block';
        document.getElementById('exerciseContent').innerHTML = marked.parse(exercise);
    }

    completeExercise() {
        // Mark exercise as complete
        this.userProgress.completedExercises[this.currentLesson] = true;
        this.saveProgress();
        
        // Show completion feedback
        const button = document.getElementById('completeExercise');
        button.textContent = '✓ Completed';
        button.style.background = 'var(--success-color)';
        button.disabled = true;
        
        // Animate completion
        button.style.transform = 'scale(1.05)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }

    previousLesson() {
        if (this.currentLesson > 0) {
            this.loadLesson(this.currentLesson - 1);
        }
    }

    nextLesson() {
        if (this.currentLesson < this.lessons.length - 1) {
            this.loadLesson(this.currentLesson + 1);
        } else {
            this.completeTutorial();
        }
    }

    completeTutorial() {
        const timeSpent = Math.round((Date.now() - this.startTime) / 60000);
        const totalQuizScore = Object.values(this.userProgress.quizScores).reduce((sum, score) => sum + score, 0);
        const averageQuizScore = Math.round(totalQuizScore / Object.keys(this.userProgress.quizScores).length);
        
        document.getElementById('quizScore').textContent = averageQuizScore || 0;
        document.getElementById('timeSpent').textContent = timeSpent;
        
        document.getElementById('welcome').style.display = 'none';
        document.getElementById('lesson-content').style.display = 'none';
        document.getElementById('completion').style.display = 'block';
        
        this.updateProgressBar();
    }

    restartTutorial() {
        this.currentLesson = 0;
        this.userProgress = {
            currentLesson: 0,
            quizScores: {},
            completedExercises: {},
            completedAt: null
        };
        this.saveProgress();
        this.startTutorial();
    }

    updateNavigation() {
        // Update nav links
        document.querySelectorAll('.nav-link').forEach((link, index) => {
            link.classList.toggle('active', index === this.currentLesson);
        });
        
        // Update lesson buttons
        document.getElementById('prevLesson').disabled = this.currentLesson === 0;
        document.getElementById('nextLesson').textContent = 
            this.currentLesson === this.lessons.length - 1 ? 'Complete' : 'Next →';
        document.getElementById('prevLessonBottom').disabled = this.currentLesson === 0;
        document.getElementById('nextLessonBottom').textContent = 
            this.currentLesson === this.lessons.length - 1 ? 'Complete' : 'Next →';
    }

    updateProgressBar() {
        // Initialize progress bar with scroll-based progress
        const scrollProgress = this.calculateScrollProgress();
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressFill.style.width = `${scrollProgress}%`;
        progressText.textContent = `${Math.round(scrollProgress)}% Completed`;
        
        // Show progress bar when scrolling
        if (window.scrollY > 100) {
            document.querySelector('.progress-container').classList.add('visible');
        }
    }

    handleScroll() {
        // Throttle scroll events for better performance
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        this.scrollTimeout = setTimeout(() => {
            const progressContainer = document.querySelector('.progress-container');
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');
            
            // Show/hide progress bar based on scroll position
            if (window.scrollY > 100) {
                progressContainer.classList.add('visible');
            } else {
                progressContainer.classList.remove('visible');
            }
            
            // Calculate scroll progress percentage
            const scrollProgress = this.calculateScrollProgress();
            
            // Update progress bar to reflect scroll position
            progressFill.style.width = `${scrollProgress}%`;
            progressText.textContent = `${Math.round(scrollProgress)}% Scrolled`;
        }, 10); // 10ms throttle for smooth updates
    }
    
    calculateScrollProgress() {
        // Get the total scrollable height
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Handle edge case where document height is 0 or very small
        if (documentHeight <= 0) {
            return 0;
        }
        
        // Get current scroll position
        const scrollTop = window.scrollY;
        
        // Calculate percentage (0-100)
        const scrollPercentage = (scrollTop / documentHeight) * 100;
        
        // Ensure it stays within 0-100 range
        return Math.min(Math.max(scrollPercentage, 0), 100);
    }
    
    scrollToTop(smooth = true) {
        try {
            if (smooth) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.scrollTo(0, 0);
            }
        } catch (e) {
            window.scrollTo(0, 0);
        }
    }

    scrollToHeading(headingId) {
        try {
            // Wait for DOM to be fully updated - use requestAnimationFrame
            setTimeout(() => {
                requestAnimationFrame(() => {
                    const targetElement = document.getElementById(headingId);

                    if (targetElement) {
                        // Calculate offset to account for fixed elements (if any)
                        const offset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;

                        // Scroll to the target position
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Add highlight animation to make the section stand out
                        targetElement.style.transition = 'background-color 0.15s ease-in';
                        targetElement.style.backgroundColor = 'var(--primary-light, rgba(99, 102, 241, 0.15))';

                        // Remove highlight after 1 second with faster fade-out
                        setTimeout(() => {
                            targetElement.style.transition = 'background-color 0.3s ease-out';
                            targetElement.style.backgroundColor = 'transparent';
                        }, 1000);
                    } else {
                        // Fallback to top if heading not found
                        this.scrollToTop(true);
                    }
                });
            }, 200);
        } catch (e) {
            console.warn('Error scrolling to heading:', e);
            this.scrollToTop(true);
        }
    }

    animateContent() {
        const elements = document.querySelectorAll('.lesson-content > *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    toggleMobileNav() {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.toggle('active');
    }

    loadProgress() {
        const saved = localStorage.getItem('gitTutorialProgress');
        return saved ? JSON.parse(saved) : {
            currentLesson: 0,
            quizScores: {},
            completedExercises: {},
            completedAt: null
        };
    }

    saveProgress() {
        this.userProgress.currentLesson = this.currentLesson;
        localStorage.setItem('gitTutorialProgress', JSON.stringify(this.userProgress));
    }

    showError(message) {
        // Simple error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 1rem;
            border-radius: var(--radius-md);
            z-index: 1001;
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Search functionality
    async loadSearchIndex() {
        // Load all lesson content into memory for searching
        try {
            const promises = this.lessons.map(async (lesson, index) => {
                const response = await fetch(`tutorial/${lesson}`);
                const markdown = await response.text();

                // Parse content to extract searchable sections
                const lines = markdown.split('\n');
                const sections = [];
                let currentSection = { heading: '', content: '', level: 0 };
                let inCodeBlock = false;

                lines.forEach(line => {
                    // Track code block boundaries
                    if (line.trim().startsWith('```')) {
                        inCodeBlock = !inCodeBlock;
                        currentSection.content += line + ' ';
                        return;
                    }

                    // Skip heading detection inside code blocks
                    if (inCodeBlock) {
                        currentSection.content += line + ' ';
                        return;
                    }

                    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
                    if (headingMatch) {
                        // Save previous section if it has content
                        if (currentSection.content.trim()) {
                            sections.push({...currentSection});
                        }
                        // Start new section
                        currentSection = {
                            heading: headingMatch[2],
                            content: '',
                            level: headingMatch[1].length
                        };
                    } else {
                        currentSection.content += line + ' ';
                    }
                });

                // Add last section
                if (currentSection.content.trim()) {
                    sections.push(currentSection);
                }

                return {
                    lessonIndex: index,
                    lessonFile: lesson,
                    lessonTitle: this.getLessonTitle(index),
                    fullContent: markdown,
                    sections: sections
                };
            });

            this.searchIndex = await Promise.all(promises);
        } catch (error) {
            console.error('Error loading search index:', error);
        }
    }

    initDraggableSearchButton() {
        const btn = document.getElementById('searchFloatBtn');
        if (!btn) return;

        // Protected state storage - frozen to prevent external modification
        const protectedState = Object.seal({
            isDragging: false,
            hasDragged: false,
            currentX: 0,
            currentY: 0,
            initialX: 0,
            initialY: 0,
            xOffset: 0,
            yOffset: 0,
            lastInteraction: Date.now()
        });

        // Restore saved position from localStorage
        try {
            const savedPosition = localStorage.getItem('searchButtonPosition');
            if (savedPosition) {
                const { x, y } = JSON.parse(savedPosition);
                protectedState.xOffset = x;
                protectedState.yOffset = y;
                btn.style.transform = `translate(${x}px, ${y}px)`;
            }
        } catch (e) {
            console.warn('Could not restore button position:', e);
        }

        // Event handlers with extension interference protection
        const dragStart = (e) => {
            try {
                // Multiple stop mechanisms for robustness
                if (e && e.stopPropagation) e.stopPropagation();
                if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();

                protectedState.hasDragged = false;
                protectedState.isDragging = true;
                protectedState.lastInteraction = Date.now();

                protectedState.initialX = (e.clientX || 0) - protectedState.xOffset;
                protectedState.initialY = (e.clientY || 0) - protectedState.yOffset;
            } catch (err) {
                console.warn('Error in dragStart:', err);
            }
        };

        const drag = (e) => {
            try {
                if (protectedState.isDragging) {
                    if (e && e.preventDefault) e.preventDefault();
                    if (e && e.stopPropagation) e.stopPropagation();
                    if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();

                    protectedState.hasDragged = true;
                    protectedState.currentX = (e.clientX || 0) - protectedState.initialX;
                    protectedState.currentY = (e.clientY || 0) - protectedState.initialY;
                    protectedState.xOffset = protectedState.currentX;
                    protectedState.yOffset = protectedState.currentY;

                    if (btn && btn.style) {
                        btn.style.transform = `translate(${protectedState.currentX}px, ${protectedState.currentY}px)`;
                    }
                }
            } catch (err) {
                console.warn('Error in drag:', err);
            }
        };

        const dragEnd = (e) => {
            try {
                if (e && e.stopPropagation) e.stopPropagation();
                if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();

                if (protectedState.isDragging) {
                    protectedState.isDragging = false;

                    // Save position to localStorage
                    try {
                        localStorage.setItem('searchButtonPosition', JSON.stringify({
                            x: protectedState.xOffset,
                            y: protectedState.yOffset
                        }));
                    } catch (storageErr) {
                        console.warn('Could not save position:', storageErr);
                    }

                    // Only open search if button wasn't dragged
                    if (!protectedState.hasDragged) {
                        this.openSearch();
                    }
                }
            } catch (err) {
                console.warn('Error in dragEnd:', err);
            }
        };

        // Store handlers for health checks
        const handlers = Object.freeze({
            dragStart,
            drag,
            dragEnd
        });

        // Attach event listeners with both capture and bubble phases
        const attachListeners = () => {
            try {
                // Remove old listeners first to prevent duplicates
                btn.removeEventListener('mousedown', handlers.dragStart, true);
                btn.removeEventListener('mousedown', handlers.dragStart, false);
                document.removeEventListener('mousemove', handlers.drag, true);
                document.removeEventListener('mousemove', handlers.drag, false);
                document.removeEventListener('mouseup', handlers.dragEnd, true);
                document.removeEventListener('mouseup', handlers.dragEnd, false);

                // Attach in capture phase (priority)
                btn.addEventListener('mousedown', handlers.dragStart, true);
                document.addEventListener('mousemove', handlers.drag, true);
                document.addEventListener('mouseup', handlers.dragEnd, true);

                // Also attach in bubble phase as fallback
                btn.addEventListener('mousedown', handlers.dragStart, false);
                document.addEventListener('mousemove', handlers.drag, false);
                document.addEventListener('mouseup', handlers.dragEnd, false);

                // Add direct onclick as ultimate fallback (only triggers if not dragged)
                btn.onclick = (e) => {
                    const timeSinceInteraction = Date.now() - protectedState.lastInteraction;
                    // If no drag interaction in last 100ms, treat as click
                    if (timeSinceInteraction < 100 && !protectedState.hasDragged) {
                        this.openSearch();
                    }
                };
            } catch (err) {
                console.warn('Error attaching listeners:', err);
            }
        };

        // Initial attachment
        attachListeners();

        // MutationObserver to detect DOM tampering
        try {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' || mutation.type === 'childList') {
                        // Re-attach listeners if button was modified
                        attachListeners();
                        break;
                    }
                }
            });

            observer.observe(btn, {
                attributes: true,
                childList: true,
                characterData: false
            });

            // Store observer reference for cleanup
            this.searchButtonObserver = observer;
        } catch (err) {
            console.warn('MutationObserver not available:', err);
        }

        // Periodic health check - verify listeners are working
        const healthCheck = setInterval(() => {
            try {
                const currentBtn = document.getElementById('searchFloatBtn');
                if (!currentBtn) {
                    clearInterval(healthCheck);
                    return;
                }

                // Verify button is still responsive by checking if onclick exists
                if (!currentBtn.onclick) {
                    console.warn('Search button listeners may have been removed, re-attaching...');
                    attachListeners();
                }
            } catch (err) {
                console.warn('Health check error:', err);
            }
        }, 2000); // Check every 2 seconds

        // Store health check reference for cleanup
        this.searchButtonHealthCheck = healthCheck;

        // Add touchscreen support with same protection
        const touchStart = (e) => {
            if (e.touches && e.touches[0]) {
                const touch = e.touches[0];
                dragStart({
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    stopPropagation: () => e.stopPropagation?.(),
                    stopImmediatePropagation: () => e.stopImmediatePropagation?.(),
                    preventDefault: () => e.preventDefault?.()
                });
            }
        };

        const touchMove = (e) => {
            if (e.touches && e.touches[0]) {
                const touch = e.touches[0];
                drag({
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    stopPropagation: () => e.stopPropagation?.(),
                    stopImmediatePropagation: () => e.stopImmediatePropagation?.(),
                    preventDefault: () => e.preventDefault?.()
                });
            }
        };

        const touchEnd = (e) => {
            dragEnd({
                stopPropagation: () => e.stopPropagation?.(),
                stopImmediatePropagation: () => e.stopImmediatePropagation?.()
            });
        };

        // Attach touch listeners
        try {
            btn.addEventListener('touchstart', touchStart, { passive: false, capture: true });
            document.addEventListener('touchmove', touchMove, { passive: false, capture: true });
            document.addEventListener('touchend', touchEnd, { passive: false, capture: true });
        } catch (err) {
            console.warn('Could not attach touch listeners:', err);
        }
    }

    initDraggableSearch() {
        const floatWindow = document.getElementById('searchFloat');
        const header = document.getElementById('searchFloatHeader');

        if (!floatWindow || !header) return;

        // Protected state storage
        const protectedState = Object.seal({
            isDragging: false,
            currentX: 0,
            currentY: 0,
            initialX: 0,
            initialY: 0,
            xOffset: 0,
            yOffset: 0
        });

        // Event handlers with extension interference protection
        const dragStart = (e) => {
            try {
                protectedState.initialX = (e.clientX || 0) - protectedState.xOffset;
                protectedState.initialY = (e.clientY || 0) - protectedState.yOffset;

                if (e.target === header || header.contains(e.target)) {
                    protectedState.isDragging = true;
                    if (floatWindow && floatWindow.style) {
                        floatWindow.style.transition = 'none';
                    }
                }
            } catch (err) {
                console.warn('Error in search window dragStart:', err);
            }
        };

        const drag = (e) => {
            try {
                if (protectedState.isDragging) {
                    if (e && e.preventDefault) e.preventDefault();

                    protectedState.currentX = (e.clientX || 0) - protectedState.initialX;
                    protectedState.currentY = (e.clientY || 0) - protectedState.initialY;
                    protectedState.xOffset = protectedState.currentX;
                    protectedState.yOffset = protectedState.currentY;

                    if (floatWindow && floatWindow.style) {
                        floatWindow.style.transform = `translate(${protectedState.currentX}px, ${protectedState.currentY}px)`;
                    }
                }
            } catch (err) {
                console.warn('Error in search window drag:', err);
            }
        };

        const dragEnd = (e) => {
            try {
                if (protectedState.isDragging) {
                    protectedState.initialX = protectedState.currentX;
                    protectedState.initialY = protectedState.currentY;
                    protectedState.isDragging = false;
                    if (floatWindow && floatWindow.style) {
                        floatWindow.style.transition = '';
                    }
                }
            } catch (err) {
                console.warn('Error in search window dragEnd:', err);
            }
        };

        // Store handlers for re-attachment
        const handlers = Object.freeze({
            dragStart,
            drag,
            dragEnd
        });

        // Attach event listeners with protection
        const attachListeners = () => {
            try {
                // Remove old listeners first
                header.removeEventListener('mousedown', handlers.dragStart, true);
                header.removeEventListener('mousedown', handlers.dragStart, false);
                document.removeEventListener('mousemove', handlers.drag, true);
                document.removeEventListener('mousemove', handlers.drag, false);
                document.removeEventListener('mouseup', handlers.dragEnd, true);
                document.removeEventListener('mouseup', handlers.dragEnd, false);

                // Attach in both capture and bubble phases
                header.addEventListener('mousedown', handlers.dragStart, true);
                document.addEventListener('mousemove', handlers.drag, true);
                document.addEventListener('mouseup', handlers.dragEnd, true);

                header.addEventListener('mousedown', handlers.dragStart, false);
                document.addEventListener('mousemove', handlers.drag, false);
                document.addEventListener('mouseup', handlers.dragEnd, false);
            } catch (err) {
                console.warn('Error attaching search window listeners:', err);
            }
        };

        // Initial attachment
        attachListeners();

        // MutationObserver for DOM tampering detection
        try {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' || mutation.type === 'childList') {
                        attachListeners();
                        break;
                    }
                }
            });

            observer.observe(header, {
                attributes: true,
                childList: true,
                characterData: false
            });

            this.searchWindowObserver = observer;
        } catch (err) {
            console.warn('MutationObserver not available for search window:', err);
        }

        // Add touchscreen support
        const touchStart = (e) => {
            if (e.touches && e.touches[0]) {
                const touch = e.touches[0];
                dragStart({
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    target: e.target,
                    preventDefault: () => e.preventDefault?.()
                });
            }
        };

        const touchMove = (e) => {
            if (e.touches && e.touches[0]) {
                const touch = e.touches[0];
                drag({
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    preventDefault: () => e.preventDefault?.()
                });
            }
        };

        const touchEnd = (e) => {
            dragEnd({});
        };

        try {
            header.addEventListener('touchstart', touchStart, { passive: false, capture: true });
            document.addEventListener('touchmove', touchMove, { passive: false, capture: true });
            document.addEventListener('touchend', touchEnd, { passive: false, capture: true });
        } catch (err) {
            console.warn('Could not attach touch listeners to search window:', err);
        }
    }

    openSearch() {
        try {
            const floatWindow = document.getElementById('searchFloat');
            const input = document.getElementById('searchInput');
            const btn = document.getElementById('searchFloatBtn');

            if (!floatWindow || !input || !btn) {
                console.warn('Search elements not found');
                return;
            }

            // Use multiple methods to ensure visibility
            if (floatWindow.classList) {
                floatWindow.classList.add('active');
            } else {
                floatWindow.className += ' active';
            }

            if (btn.classList) {
                btn.classList.add('hidden');
            } else {
                btn.className += ' hidden';
            }

            // Try to focus with error handling
            try {
                if (input.focus) input.focus();
            } catch (focusErr) {
                // Focus might be blocked by browser, that's okay
                console.warn('Could not focus search input:', focusErr);
            }

            // Ensure search window is visible (fallback)
            setTimeout(() => {
                if (floatWindow && !floatWindow.classList.contains('active')) {
                    floatWindow.classList.add('active');
                }
            }, 100);
        } catch (err) {
            console.warn('Error opening search:', err);
        }
    }

    closeSearch() {
        try {
            const floatWindow = document.getElementById('searchFloat');
            const input = document.getElementById('searchInput');
            const btn = document.getElementById('searchFloatBtn');

            if (!floatWindow || !input || !btn) {
                console.warn('Search elements not found');
                return;
            }

            // Use multiple methods to ensure proper state
            if (floatWindow.classList) {
                floatWindow.classList.remove('active');
            } else {
                floatWindow.className = floatWindow.className.replace(/\bactive\b/g, '');
            }

            if (btn.classList) {
                btn.classList.remove('hidden');
            } else {
                btn.className = btn.className.replace(/\bhidden\b/g, '');
            }

            if (input.value !== undefined) {
                input.value = '';
            }

            this.showSearchEmpty();

            // Ensure button is visible (fallback)
            setTimeout(() => {
                if (btn && btn.classList.contains('hidden')) {
                    btn.classList.remove('hidden');
                }
            }, 100);
        } catch (err) {
            console.warn('Error closing search:', err);
        }
    }

    handleSearchInput(e) {
        const query = e.target.value.trim();

        // Debounce search
        if (this.searchDebounceTimeout) {
            clearTimeout(this.searchDebounceTimeout);
        }

        if (!query) {
            this.showSearchEmpty();
            return;
        }

        this.searchDebounceTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    performSearch(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        const queryRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

        this.searchIndex.forEach(lesson => {
            // Check lesson title
            if (lesson.lessonTitle.toLowerCase().includes(queryLower)) {
                results.push({
                    lessonIndex: lesson.lessonIndex,
                    lessonTitle: lesson.lessonTitle,
                    matchType: 'title',
                    heading: '',
                    headingId: '',
                    snippet: lesson.lessonTitle,
                    score: 100
                });
            }

            // Check sections
            lesson.sections.forEach(section => {
                const headingMatch = section.heading.toLowerCase().includes(queryLower);
                const contentMatch = section.content.toLowerCase().includes(queryLower);

                if (headingMatch || contentMatch) {
                    // Create snippet with highlighted match
                    let snippet = '';
                    let score = 0;

                    if (headingMatch) {
                        snippet = section.heading;
                        score = 80 - (section.level * 5); // Higher level headings score higher
                    } else if (contentMatch) {
                        // Extract snippet around match
                        const matchIndex = section.content.toLowerCase().indexOf(queryLower);
                        const start = Math.max(0, matchIndex - 50);
                        const end = Math.min(section.content.length, matchIndex + query.length + 100);
                        snippet = (start > 0 ? '...' : '') +
                                  section.content.substring(start, end).trim() +
                                  (end < section.content.length ? '...' : '');
                        score = 50;
                    }

                    results.push({
                        lessonIndex: lesson.lessonIndex,
                        lessonTitle: lesson.lessonTitle,
                        matchType: headingMatch ? 'heading' : 'content',
                        heading: section.heading,
                        headingId: section.heading ? this.slugify(section.heading) : '',
                        snippet: snippet,
                        score: score
                    });
                }
            });
        });

        // Sort by score and limit results
        results.sort((a, b) => b.score - a.score);
        const topResults = results.slice(0, 10);

        this.showSearchResults(topResults, queryRegex);
    }

    showSearchResults(results, queryRegex) {
        const resultsContainer = document.getElementById('searchResults');
        this.selectedSearchResult = 0;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M44 44L33.65 33.65" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>No results found</p>
                    <span>Try different keywords</span>
                </div>
            `;
            return;
        }

        const highlightText = (text) => {
            return text.replace(queryRegex, match => `<mark>${match}</mark>`);
        };

        resultsContainer.innerHTML = results.map((result, index) => `
            <div class="search-result ${index === 0 ? 'selected' : ''}" data-lesson="${result.lessonIndex}" data-heading-id="${result.headingId || ''}" data-index="${index}">
                <div class="search-result-lesson">Lesson ${result.lessonIndex + 1}: ${result.lessonTitle}</div>
                ${result.heading ? `<div class="search-result-heading">${highlightText(result.heading)}</div>` : ''}
                <div class="search-result-snippet">${highlightText(result.snippet)}</div>
            </div>
        `).join('');

        // Add click handlers
        resultsContainer.querySelectorAll('.search-result').forEach(el => {
            el.addEventListener('click', () => {
                const lessonIndex = parseInt(el.dataset.lesson);
                const headingId = el.dataset.headingId;
                this.closeSearch();
                this.loadLesson(lessonIndex, headingId);
            });
        });
    }

    showSearchEmpty() {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M44 44L33.65 33.65" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>Start typing to search lessons</p>
            </div>
        `;
    }

    handleKeyboardShortcuts(e) {
        // Ctrl+K or Cmd+K to open search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.openSearch();
            return;
        }

        // Only handle other shortcuts when search is open
        const searchFloat = document.getElementById('searchFloat');
        if (!searchFloat.classList.contains('active')) {
            return;
        }

        // Escape to close search
        if (e.key === 'Escape') {
            e.preventDefault();
            this.closeSearch();
            return;
        }

        // Arrow key navigation
        const results = document.querySelectorAll('.search-result');
        if (results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedSearchResult = Math.min(this.selectedSearchResult + 1, results.length - 1);
            this.updateSearchSelection(results);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedSearchResult = Math.max(this.selectedSearchResult - 1, 0);
            this.updateSearchSelection(results);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selected = results[this.selectedSearchResult];
            if (selected) {
                selected.click();
            }
        }
    }

    updateSearchSelection(results) {
        results.forEach((result, index) => {
            if (index === this.selectedSearchResult) {
                result.classList.add('selected');
                result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                result.classList.remove('selected');
            }
        });
    }

    // Cleanup method to properly dispose of observers and intervals
    cleanup() {
        try {
            // Clear health check interval
            if (this.searchButtonHealthCheck) {
                clearInterval(this.searchButtonHealthCheck);
                this.searchButtonHealthCheck = null;
            }

            // Disconnect MutationObservers
            if (this.searchButtonObserver) {
                this.searchButtonObserver.disconnect();
                this.searchButtonObserver = null;
            }

            if (this.searchWindowObserver) {
                this.searchWindowObserver.disconnect();
                this.searchWindowObserver = null;
            }

            // Clear any pending timeouts
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = null;
            }

            if (this.searchDebounceTimeout) {
                clearTimeout(this.searchDebounceTimeout);
                this.searchDebounceTimeout = null;
            }

            console.log('GitTutorial cleanup completed');
        } catch (err) {
            console.warn('Error during cleanup:', err);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitTutorial();
});

// Add some CSS for quiz explanations
const style = document.createElement('style');
style.textContent = `
    .quiz-explanation {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--surface-color);
        border-radius: var(--radius-md);
        border-left: 4px solid var(--primary-color);
    }
    
    .explanation-content {
        color: var(--text-primary);
    }
    
    .quiz-complete {
        text-align: center;
        padding: 2rem;
    }
    
    .quiz-score {
        margin-top: 1rem;
    }
    
    .score-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--success-color));
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
    }
    
    .score-number {
        font-size: 2rem;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--background-color);
            border-top: 1px solid var(--border-color);
            padding: 1rem;
            box-shadow: var(--shadow-md);
        }
    }
`;
document.head.appendChild(style);
