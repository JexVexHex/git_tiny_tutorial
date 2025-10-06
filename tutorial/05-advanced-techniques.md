# Advanced Git Techniques - Power User Skills

## Undoing Changes

### Changing the Last Commit
```bash
# Modify the last commit message
git commit --amend -m "New commit message"

# Add files to the last commit
git add forgotten-file.txt
git commit --amend --no-edit
```

### Undoing Commits
```bash
# Undo last commit (keeps changes staged)
git reset --soft HEAD~1

# Undo last commit (keeps changes unstaged)
git reset HEAD~1

# Undo last commit (loses all changes)
git reset --hard HEAD~1

# Undo multiple commits
git reset --hard HEAD~3
```

### Reverting Commits
```bash
# Create a new commit that undoes a previous commit
git revert _commit-hash_

# Revert multiple commits
git revert commit1..commit2

# Revert without creating a commit
git revert --no-commit _commit-hash_
```

## Stashing Changes

### Basic Stashing
```bash
# Stash current changes
git stash

# Stash with message
git stash push -m "Work in progress"

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{2}

# Drop a stash
git stash drop stash@{1}

# Clear all stashes
git stash clear
```

### Advanced Stashing
```bash
# Stash only staged changes
git stash --staged

# Stash including untracked files
git stash -u

# Stash specific files
git stash push -m "message" file1.txt file2.txt
```

## Interactive Rebase

### Rewriting History
```bash
# Interactive rebase for last 3 commits
git rebase -i HEAD~3

# Interactive rebase from specific commit
git rebase -i _commit-hash_
```

### Rebase Options
- **pick**: Use the commit as-is
- **reword**: Change the commit message
- **edit**: Stop to amend the commit
- **squash**: Combine with previous commit
- **drop**: Remove the commit entirely

### Example Rebase Session
```plaintext
pick a1b2c3d Add user authentication
reword d4e5f6g Fix login bug
squash g7h8i9j Update tests
```

## Cherry-Picking

### Selecting Specific Commits
```bash
# Cherry-pick a single commit
git cherry-pick _commit-hash_

# Cherry-pick multiple commits
git cherry-pick commit1 commit2 commit3

# Cherry-pick a range of commits
git cherry-pick start-commit..end-commit

# Cherry-pick without committing
git cherry-pick --no-commit _commit-hash_
```

### Resolving Cherry-Pick Conflicts
```bash
# If conflicts occur during cherry-pick
# Resolve conflicts in files
git add .
git cherry-pick --continue

# Or abort the cherry-pick
git cherry-pick --abort
```

## Advanced Branching

### Branching Strategies

#### 1. Git Flow
```plaintext
main:     A---B---C---F---G---H
           \         /     /
develop:   D---E---/     /
             \           /
feature:      I---J---K-/
```

#### 2. GitHub Flow
```plaintext
main:     A---B---C---D---E
           \     /   \   /
feature1:   F---G     H-I
feature2:             J-K
```

#### 3. GitLab Flow
```plaintext
main:     A---B---C---D---E
           \         /
production: F---G---H
```

### Branch Management
```bash
# List merged branches
git branch --merged

# List unmerged branches
git branch --no-merged

# Delete merged branches
git branch --merged | grep -v main | xargs git branch -d

# Prune remote tracking branches
git remote prune origin
```

## Advanced Logging and Searching

### Powerful Log Commands
```bash
# One-line log with graph
git log --oneline --graph --all

# Log with file changes
git log --stat

# Log with patches
git log -p

# Log specific files
git log -- file1.txt file2.txt

# Log by author
git log --author="John Doe"

# Log by date range
git log --since="2024-01-01" --until="2024-12-31"

# Log with custom format
git log --pretty=format:"%h - %an, %ar : %s"
```

### Searching History
```bash
# Search commit messages
git log --grep="bug fix"

# Search code changes
git log -S "function_name"

# Search with regular expressions
git log -G "pattern"
```

## Git Hooks

### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit
echo "Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi
```

### Commit Message Hook
```bash
#!/bin/sh
# .git/hooks/commit-msg
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}'
if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    exit 1
fi
```

## Git Aliases

### Useful Aliases
```bash
# Add aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Complex aliases
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

## Quiz Time! 🎯

**Question 1**: What does `git commit --amend` do?
- A) Creates a new commit
- B) Modifies the last commit
- C) Deletes the last commit
- D) Shows commit history

**Question 2**: What's the difference between `git reset --soft` and `git reset --hard`?
- A) No difference
- B) Soft keeps changes staged, hard loses all changes
- C) Soft is faster than hard
- D) Hard is more dangerous than soft

**Question 3**: What does `git cherry-pick` do?
- A) Deletes a commit
- B) Applies a specific commit to current branch
- C) Merges two branches
- D) Creates a new branch

**Question 4**: What is the purpose of Git hooks?
- A) To store Git configuration
- B) To automate Git operations
- C) To backup repositories
- D) To create branches

**Question 5**: What does `git rebase --skip` do?
- A) Skips the current commit and continues rebasing
- B) Aborts the entire rebase operation
- C) Resolves merge conflicts automatically
- D) Creates a new branch from the current commit

## Practice Exercise

Let's practice advanced techniques:

1. **Create a messy commit history**:
   ```bash
   echo "Feature 1" > feature1.txt
   git add feature1.txt
   git commit -m "Add feature 1"
   
   echo "Feature 2" > feature2.txt
   git add feature2.txt
   git commit -m "Add feature 2"
   
   echo "Bug fix" > bugfix.txt
   git add bugfix.txt
   git commit -m "Fix bug"
   ```

2. **Clean up with interactive rebase**:
   ```bash
   git rebase -i HEAD~3
   # In the editor, change 'pick' to 'squash' for commits you want to combine
   ```

3. **Practice stashing**:
   ```bash
   echo "Work in progress" > wip.txt
   git stash push -m "Work in progress"
   git stash list
   git stash pop
   ```

4. **Create useful aliases**:
   ```bash
   git config --global alias.st status
   git config --global alias.co checkout
   git config --global alias.br branch
   ```

5. **Practice rebase conflict handling** (including --skip):
   ```bash
   # Create a branch with some commits
   git checkout -b test-rebase
   echo "Line 1" > test.txt
   git add test.txt
   git commit -m "Add line 1"

   echo "Line 2" >> test.txt
   git add test.txt
   git commit -m "Add line 2"

   # Switch to main and create conflicting commit
   git checkout main
   echo "Conflicting line 1" > test.txt
   git add test.txt
   git commit -m "Add conflicting line 1"

   # Try to rebase - this will cause conflicts
   git checkout test-rebase
   git rebase main

   # If you want to skip the conflicting commit instead of resolving:
   git rebase --skip

   # Check the result
   git log --oneline
   cat test.txt
   ```

## Real-World Scenarios

### Scenario 1: Accidentally Committed to Main
```bash
# Move commits to feature branch
git branch feature-branch
git reset --hard HEAD~2
git checkout feature-branch
```

### Scenario 2: Need to Undo a Public Commit
```bash
# Use revert instead of reset
git revert _commit-hash_
git push origin main
```

### Scenario 3: Merge Conflicts in Rebase
```bash
# Option 1: Resolve conflicts and continue
git add .
git rebase --continue

# Option 2: Skip the problematic commit
git rebase --skip

# Option 3: Abort the rebase
git rebase --abort
```

#### When to Use `git rebase --skip`

Use `--skip` when:
- A commit has conflicts that you don't want to resolve
- The commit is no longer needed or relevant
- The commit has already been applied upstream
- You want to completely drop a commit from the rebase operation

**Note**: `--skip` permanently removes the commit from your branch history, so use it carefully!

## Best Practices

1. **Never rewrite public history**: Use revert instead of reset
2. **Use meaningful commit messages**: Follow conventional commits
3. **Keep commits atomic**: One logical change per commit
4. **Test before committing**: Use pre-commit hooks
5. **Regular backups**: Push to remote frequently
6. **Document your workflow**: Share knowledge with team

## Git Workflow Summary

### Daily Workflow
```bash
# Start of day
git pull origin main
git checkout -b feature/new-feature

# During development
git add .
git commit -m "feat: add new feature"
git push -u origin feature/new-feature

# End of day
git stash  # if needed
git checkout main
git pull origin main
```

### Code Review Workflow
```bash
# After review feedback
git checkout feature/new-feature
# Make changes
git add .
git commit -m "fix: address review feedback"
git push origin feature/new-feature
```

## Congratulations! 🎉

You've completed the Git Tiny Tutorial™! You now have a solid understanding of:

- ✅ Git basics and terminology
- ✅ Branching and merging strategies
- ✅ Working with remote repositories
- ✅ Advanced Git techniques
- ✅ Real-world best practices

## Next Steps

1. **Practice regularly**: Use Git in your daily development
2. **Explore more**: Learn about Git LFS, submodules, and other advanced features
3. **Contribute to open source**: Apply your skills to real projects
4. **Share knowledge**: Help others learn Git

## Resources

- [Official Git Documentation](https://git-scm.com/doc)
- [GitHub Learning Lab](https://lab.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Pro Git Book](https://git-scm.com/book)

---

**Progress**: You've completed 100% of the Git Tiny Tutorial™! 🎯
