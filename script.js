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
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.setupTheme();
        this.updateProgressBar();
        this.showWelcome();
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

    async loadLesson(lessonIndex) {
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
            
            // Scroll to top when loading a lesson
            this.scrollToTop(true);
            
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
