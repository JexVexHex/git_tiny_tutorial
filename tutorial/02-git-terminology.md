# Git Terminology - Understanding the Language

## Essential Git Terms

### HEAD
**HEAD** is a pointer that indicates which commit you're currently on. It's like a bookmark in your project's history.

- **Detached HEAD**: When HEAD points to a specific commit instead of a branch
- **HEAD~1**: The commit before the current one
- **HEAD~2**: Two commits before the current one

```bash
# See where HEAD is pointing
git log --oneline -5
```

### MERGE_HEAD
**MERGE_HEAD** is a temporary pointer created during a merge operation. It points to the commit you're merging into your current branch.

- Created automatically during `git merge`
- Removed after merge is complete
- Helps Git track what's being merged

### Fast-Forward Merge
A **fast-forward merge** happens when the target branch hasn't diverged from your current branch. Git simply moves the branch pointer forward.

```
Before:
A---B---C (main)
     \
      D---E (feature)

After (fast-forward):
A---B---C---D---E (main)
```

```bash
# This will be a fast-forward merge if possible
git merge feature-branch
```

### Merge
A **merge** combines changes from different branches into one. There are two types:

#### 1. Fast-Forward Merge
- No new commits on the target branch
- Git moves the pointer forward
- No merge commit created

#### 2. Three-Way Merge
- Both branches have new commits
- Git creates a merge commit
- Combines changes from both branches

```bash
# Merge a branch into current branch
git merge branch-name

# Merge with no fast-forward (always creates merge commit)
git merge --no-ff branch-name
```

### Rebase
**Rebase** rewrites commit history by moving commits from one branch to another. It creates a linear history.

```
Before rebase:
A---B---C (main)
     \
      D---E (feature)

After rebase:
A---B---C---D'---E' (main)
```

```bash
# Rebase current branch onto main
git rebase main

# Interactive rebase (allows editing commits)
git rebase -i HEAD~3
```

### Reset
**Reset** moves the HEAD pointer to a different commit. There are three types:

#### 1. Soft Reset
- Moves HEAD and staging area
- Keeps working directory unchanged
- Changes are staged for commit

```bash
git reset --soft HEAD~1
```

#### 2. Mixed Reset (Default)
- Moves HEAD and staging area
- Resets working directory to match HEAD
- Changes are unstaged

```bash
git reset HEAD~1
# or
git reset --mixed HEAD~1
```

#### 3. Hard Reset
- Moves HEAD, staging area, and working directory
- **WARNING**: Loses all changes permanently

```bash
git reset --hard HEAD~1
```

### Commit
A **commit** is a snapshot of your project at a specific point in time. Each commit has:

- **Hash**: Unique identifier (e.g., `a1b2c3d`)
- **Author**: Who made the commit
- **Date**: When it was made
- **Message**: Description of changes
- **Parent(s)**: Previous commit(s)

```bash
# View commit details
git show commit-hash

# View commit history
git log --oneline --graph
```

## Visual Comparison

### Merge vs Rebase

**Merge** preserves history:
```
A---B---C---F (main)
     \     /
      D---E (feature)
```

**Rebase** creates linear history:
```
A---B---C---D'---E' (main)
```

## Quiz Time! 🎯

**Question 1**: What does HEAD represent?
- A) The top of your file
- B) A pointer to your current commit
- C) The beginning of your project
- D) A Git configuration file

**Question 2**: When does a fast-forward merge occur?
- A) When there are conflicts
- B) When the target branch hasn't diverged
- C) When you use `git rebase`
- D) When you delete a branch

**Question 3**: What's the difference between `git reset --soft` and `git reset --hard`?
- A) No difference
- B) Soft keeps changes staged, hard loses all changes
- C) Soft is faster than hard
- D) Hard is more dangerous than soft

**Question 4**: What does MERGE_HEAD point to during a merge?
- A) The current branch
- B) The commit being merged
- C) The main branch
- D) The staging area

## Practice Exercise

Try these commands to understand the concepts:

1. **Create a branch and make commits**:
   ```bash
   git checkout -b experiment
   echo "New feature" > feature.txt
   git add feature.txt
   git commit -m "Add new feature"
   ```

2. **Switch back to main and merge**:
   ```bash
   git checkout main
   git merge experiment
   ```

3. **Check the merge result**:
   ```bash
   git log --oneline --graph
   ```

## Common Scenarios

### Changing a Commit Message
```bash
# For the last commit
git commit --amend -m "New message"

# For older commits (interactive rebase)
git rebase -i HEAD~3
```

### Rolling Back a Commit
```bash
# Create a new commit that undoes changes
git revert commit-hash

# Reset to a previous commit (destructive)
git reset --hard HEAD~1
```

## Next Steps

Excellent! You now understand Git's core terminology. In the next lesson, we'll learn about branches and how to work with them effectively.

---

**Progress**: You've completed 40% of the Git Tiny Tutorial™
