# Branches and Merging - Working with Multiple Versions

## What are Branches?

A **branch** is a movable pointer to a specific commit. Think of branches as parallel universes where you can develop features without affecting the main codebase.

### Why Use Branches?

- **Feature Development**: Work on new features without breaking main code
- **Experimentation**: Try different approaches safely
- **Collaboration**: Multiple developers can work simultaneously
- **Bug Fixes**: Fix issues without disrupting ongoing development

## Branch Basics

### Creating Branches

```bash
# Create a new branch
git branch feature-branch

# Create and switch to a new branch
git checkout -b feature-branch

# Modern way (Git 2.23+)
git switch -c feature-branch
```

### Switching Branches

```bash
# Switch to an existing branch
git checkout branch-name

# Modern way
git switch branch-name

# Switch to previous branch
git switch -
```

### Listing Branches

```bash
# List local branches
git branch

# List all branches (local and remote)
git branch -a

# List remote branches
git branch -r
```

### Deleting Branches

```bash
# Delete a merged branch
git branch -d branch-name

# Force delete a branch
git branch -D branch-name

# Delete remote branch
git push origin --delete branch-name
```

## Branch Workflow

### 1. Feature Branch Workflow

```plaintext
main:     A---B---C---F---G
           \         /
feature:    D---E---/
```

1. Create feature branch from main
2. Develop feature on branch
3. Merge back to main when complete

### 2. Git Flow Workflow

```plaintext
main:     A---B---C---F---G
           \         /
develop:   D---E---/
```

- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: Feature development
- **release/***: Release preparation
- **hotfix/***: Emergency fixes

## Merging Strategies

### 1. Fast-Forward Merge

When the target branch hasn't diverged:

```bash
git checkout main
git merge feature-branch
```

### 2. Three-Way Merge

When both branches have new commits:

```bash
git checkout main
git merge feature-branch
# Creates a merge commit
```

### 3. Squash Merge

Combines all commits into one:

```bash
git checkout main
git merge --squash feature-branch
git commit -m "Add feature: description"
```

## Handling Merge Conflicts

### What Causes Conflicts?

- Same lines changed in different ways
- One branch deletes a file, another modifies it
- Different content in the same location

### Resolving Conflicts

1. **Identify conflicted files**:

   ```bash
   git status
   ```

2. **Open conflicted files** and look for markers:

   ```diff
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> branch-name
   ```

3. **Edit the file** to resolve conflicts:

   ```plaintext
   Resolved content
   ```

4. **Stage the resolved file**:

   ```bash
   git add filename.txt
   ```

5. **Complete the merge**:

   ```bash
   git commit
   ```

### Merge Tools

```bash
# Use a visual merge tool
git mergetool

# Configure merge tool
git config --global merge.tool vimdiff
```

## Advanced Branching

### Branch Protection

```bash
# Push and set upstream
git push -u origin feature-branch

# Track remote branch
git branch --set-upstream-to=origin/feature-branch
```

### Branch Renaming

```bash
# Rename current branch
git branch -m new-name

# Rename other branch
git branch -m old-name new-name
```

### Branch Comparison

```bash
# Compare branches
git diff branch1..branch2

# Show commits in branch1 not in branch2
git log branch1..branch2

# Show commits in both branches
git log branch1...branch2
```

## Quiz Time! 🎯

**Question 1**: What is the main purpose of branches?

- A) To store different files
- B) To work on features without affecting main code
- C) To backup your code
- D) To organize your files

**Question 2**: What command creates and switches to a new branch?

- A) `git branch new-branch`
- B) `git checkout -b new-branch`
- C) `git create new-branch`
- D) `git switch new-branch`

**Question 3**: When does a merge conflict occur?

- A) When branches have different names
- B) When the same lines are changed differently
- C) When you delete a branch
- D) When you create a new branch

**Question 4**: What does `git branch -d` do?

- A) Creates a new branch
- B) Deletes a merged branch
- C) Switches to a branch
- D) Shows branch information

## Practice Exercise

Let's practice branching:

1. **Create a feature branch**:

   ```bash
   git checkout -b my-feature
   ```

2. **Make some changes**:

   ```bash
   echo "Feature code" > feature.txt
   git add feature.txt
   git commit -m "Add feature implementation"
   ```

3. **Switch back to main**:

   ```bash
   git checkout main
   ```

4. **Make changes to main**:

   ```bash
   echo "Main update" > main.txt
   git add main.txt
   git commit -m "Update main branch"
   ```

5. **Merge the feature branch**:

   ```bash
   git merge my-feature
   ```

6. **Clean up**:

   ```bash
   git branch -d my-feature
   ```

## Common Branch Patterns

### Feature Branch Pattern

```bash
# Start new feature
git checkout -b feature/user-authentication
# ... develop feature ...
git push -u origin feature/user-authentication
# ... create pull request ...
# ... merge via GitHub/GitLab ...
git checkout main
git pull origin main
git branch -d feature/user-authentication
```

### Hotfix Pattern

```bash
# Create hotfix from main
git checkout -b hotfix/critical-bug-fix
# ... fix bug ...
git commit -m "Fix critical bug"
git push -u origin hotfix/critical-bug-fix
# ... merge to main and develop ...
```

## Best Practices

1. **Use descriptive branch names**: `feature/user-login`, `bugfix/payment-error`
2. **Keep branches short-lived**: Merge frequently
3. **Delete merged branches**: Keep repository clean
4. **Use pull requests**: Review code before merging
5. **Protect main branch**: Require reviews for main branch

## Next Steps

Great work! You've mastered branches and merging. In the next lesson, we'll explore working with remote repositories and collaboration.

---

**Progress**: You've completed 60% of the Git Tiny Tutorial™
