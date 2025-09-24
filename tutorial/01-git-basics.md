# Git Basics - Understanding Version Control

## What is Git?

Git is a **distributed version control system** that helps you track changes in your code over time. Think of it as a sophisticated "save" system for your entire project.

### Why Use Git?

- **Track Changes**: See exactly what changed, when, and why
- **Collaborate**: Multiple people can work on the same project
- **Backup**: Your code is safely stored in multiple places
- **Experiment**: Try new features without breaking your working code

## Key Git Concepts

### Repository (Repo)
A repository is like a project folder that Git tracks. It contains all your files and the complete history of changes.

### Commit
A commit is like a snapshot of your project at a specific point in time. It includes:
- What files changed
- What the changes were
- A message describing why you made the changes
- Who made the changes
- When the changes were made

### Working Directory
This is your current project folder where you make changes to files.

### Staging Area (Index)
A temporary area where you prepare changes before committing them.

### HEAD
HEAD is a pointer that shows which commit you're currently on. It's like a bookmark in your project's history.

## The Git Workflow

```
Working Directory → Staging Area → Repository
     (edit)           (add)        (commit)
```

1. **Edit** files in your working directory
2. **Add** changes to the staging area
3. **Commit** changes to the repository

## Your First Git Commands

### Initialize a Repository
```bash
git init
```
Creates a new Git repository in your current folder.

### Check Status
```bash
git status
```
Shows which files have been modified, added, or deleted.

### Add Files to Staging
```bash
git add filename.txt
git add .  # Add all files
```

### Make a Commit
```bash
git commit -m "Your commit message"
```

### View History
```bash
git log
```
Shows all commits in your repository.

## Quiz Time! 🎯

**Question 1**: What does `git init` do?
- A) Creates a new file
- B) Initializes a new Git repository
- C) Installs Git on your computer
- D) Deletes all your files

**Question 2**: What is a commit?
- A) A type of file
- B) A snapshot of your project at a point in time
- C) A Git command
- D) A programming language

**Question 3**: What does HEAD represent?
- A) The top of your file
- B) A pointer to your current commit
- C) The beginning of your project
- D) A Git configuration file

## Practice Exercise

Create a new folder and practice these commands:

1. Create a new directory: `mkdir my-first-repo`
2. Navigate to it: `cd my-first-repo`
3. Initialize Git: `git init`
4. Create a file: `echo "Hello Git!" > hello.txt`
5. Check status: `git status`
6. Add the file: `git add hello.txt`
7. Make your first commit: `git commit -m "Add hello.txt"`

## Next Steps

Great job! You've learned the basics of Git. In the next lesson, we'll explore more advanced concepts like branches, merging, and working with remote repositories.

---

**Progress**: You've completed 20% of the Git Tiny Tutorial™
