# Git Worktrees - Parallel Development Made Easy

## Overview

Have you ever been deep in the middle of implementing a feature when an urgent bug needs fixing? Traditionally, you'd need to stash your changes, switch branches, fix the bug, then restore your work. Git worktrees eliminate this friction by allowing you to work on multiple branches simultaneously in separate directories—all within a single repository.

Introduced in Git 2.5 (2015), worktrees let you maintain multiple working directories linked to the same repository, sharing the same history and configuration but with independent working trees and staging areas.

## Why Use Worktrees?

### Traditional Workflow Pain Points

```bash
# Working on a feature...
git stash                    # Save current work
git checkout main            # Switch branches
git checkout -b hotfix       # Create fix branch
# ... fix the bug ...
git checkout feature-branch  # Back to feature
git stash pop               # Restore work (hope no conflicts!)
```

### Worktree Workflow

```bash
# Working on a feature in one directory...
# Need to fix a bug? Create a worktree!
git worktree add ../hotfix main
cd ../hotfix
# ... fix the bug in a separate directory ...
# Your feature work remains untouched!
```

### Key Benefits

- **No context switching** - Keep your work-in-progress intact
- **Parallel development** - Work on multiple branches simultaneously
- **Fast builds** - Run builds/tests in one worktree while developing in another
- **Code review** - Check out PR branches without disrupting your current work
- **CI/CD testing** - Test different branches concurrently
- **Long-running tasks** - Keep servers running in one worktree while coding in another

## Core Concepts

### Main Worktree vs Linked Worktrees

```plaintext
my-project/               ← Main worktree (created with git init/clone)
├── .git/                 ← Full repository data
│   └── worktrees/       ← Metadata for linked worktrees
│       ├── hotfix/
│       └── review/
├── src/
└── README.md

my-project-hotfix/       ← Linked worktree #1
├── .git                 ← File (not directory!) pointing to main .git
├── src/
└── README.md

my-project-review/       ← Linked worktree #2
├── .git                 ← File pointing to main .git
├── src/
└── README.md
```

**Important:** All worktrees share:
- Repository history (commits, branches, tags)
- Configuration (`.git/config`)
- Hooks and refs

But each worktree has its own:
- `HEAD` (current branch/commit)
- Index (staging area)
- Working directory contents

## Essential Commands

### Creating Worktrees

```bash
# Create worktree with new branch
git worktree add <path> -b <new-branch>
git worktree add ../feature-x -b feature/user-auth

# Create worktree from existing branch
git worktree add <path> <existing-branch>
git worktree add ../hotfix main

# Create with automatic branch naming
git worktree add ../hotfix
# Creates branch "hotfix" based on current HEAD

# Create detached HEAD worktree (for temporary work)
git worktree add -d ../temp-test
git worktree add --detach ../experiment HEAD~3

# Create from remote branch
git worktree add ../review feature/login
# If "feature/login" exists in origin, automatically tracks it
```

### Listing Worktrees

```bash
# Simple list
git worktree list
# /home/user/project        abc123 [main]
# /home/user/project-hotfix def456 [hotfix]
# /home/user/project-review 789abc (detached HEAD)

# Verbose output with more details
git worktree list --verbose

# Machine-readable output
git worktree list --porcelain
```

### Removing Worktrees

```bash
# Remove a worktree (must have clean working directory)
git worktree remove <path>
git worktree remove ../hotfix

# Force remove (even with uncommitted changes)
git worktree remove --force ../hotfix

# Clean up stale worktree metadata
git worktree prune
git worktree prune --dry-run  # Preview what would be removed
```

### Moving Worktrees

```bash
# Move a worktree to new location
git worktree move <worktree> <new-path>
git worktree move ../hotfix ../urgent-hotfix

# Manually moved? Repair the connection
git worktree repair
git worktree repair ../moved-worktree
```

### Locking Worktrees

```bash
# Lock a worktree (prevents pruning/removal)
git worktree lock <path> --reason "On external drive"
git worktree lock ../project-backup --reason "Backup copy"

# Unlock a worktree
git worktree unlock <path>

# Useful for worktrees on:
# - Removable drives
# - Network shares
# - Temporary unmounted filesystems
```

## Practical Use Cases

### Use Case 1: Emergency Hotfix

```bash
# You're coding a feature...
cd ~/projects/myapp
git checkout -b feature/new-dashboard

# Urgent bug report comes in!
git worktree add ../myapp-hotfix main
cd ../myapp-hotfix
git checkout -b hotfix/critical-bug

# Fix the bug
echo "fix" > bugfix.txt
git add bugfix.txt
git commit -m "fix: resolve critical bug"
git push origin hotfix/critical-bug

# Back to feature work (unchanged!)
cd ~/projects/myapp
# Continue working...

# Clean up when done
git worktree remove ../myapp-hotfix
```

### Use Case 2: Code Review Without Context Switching

```bash
# Need to review a PR while working on your feature
git worktree add ../review-pr-123 feature/new-login
cd ../review-pr-123

# Review code, test locally
npm test
npm run build

# Done reviewing - remove it
cd ~/projects/myapp
git worktree remove ../review-pr-123
```

### Use Case 3: Parallel Builds

```bash
# Long build times? Build in separate worktree
git worktree add ../build-main main
cd ../build-main
npm run build  # Long-running build

# Meanwhile, continue developing
cd ~/projects/myapp
# Keep coding while build runs...
```

### Use Case 4: Testing Multiple Branches

```bash
# Compare behavior across branches
git worktree add ../test-v1 release/v1.0
git worktree add ../test-v2 release/v2.0
git worktree add ../test-dev develop

# Run each version simultaneously
cd ../test-v1 && npm start &
cd ../test-v2 && npm start &
cd ../test-dev && npm start &
# Compare behavior at different ports
```

### Use Case 5: Bisect Without Disruption

```bash
# Need to find a bug but don't want to disrupt current work
git worktree add ../bisect-work main
cd ../bisect-work
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# ... bisect process ...
git bisect reset

cd ~/projects/myapp
git worktree remove ../bisect-work
```

## Best Practices

### Directory Organization

```bash
# Option 1: Sibling directories (recommended)
~/projects/
├── myapp/           # Main worktree
├── myapp-hotfix/    # Linked worktree
└── myapp-review/    # Linked worktree

# Option 2: Parent directory with worktrees
~/projects/myapp/
├── main/            # Main worktree (renamed)
├── feature-x/       # Linked worktree
└── hotfix/          # Linked worktree

# Option 3: Temporary worktrees
~/projects/myapp/     # Main worktree
/tmp/myapp-review/    # Temporary worktree
```

### Naming Conventions

```bash
# Descriptive names
git worktree add ../myapp-hotfix-auth main
git worktree add ../myapp-review-pr-456 pr/456
git worktree add ../myapp-experiment-new-api develop

# Short-lived worktrees
git worktree add /tmp/myapp-quick-test main
git worktree add /tmp/myapp-bisect develop
```

### Workflow Tips

1. **Always use `git worktree remove`** instead of deleting directories
2. **List worktrees regularly** to track what's active: `git worktree list`
3. **Prune stale metadata** if you manually delete worktrees: `git worktree prune`
4. **Lock worktrees on removable media** to prevent auto-pruning
5. **Use descriptive worktree paths** for clarity
6. **Clean up** completed worktrees promptly to avoid confusion

### Configuration

```bash
# Enable automatic remote tracking
git config worktree.guessRemote true

# Use relative paths (useful for portable repositories)
git config worktree.useRelativePaths true

# Worktree-specific configuration
git config extensions.worktreeConfig true
git config --worktree user.email "specific@email.com"
```

## Common Pitfalls and Solutions

### Pitfall 1: Branch Already Checked Out

```bash
# ERROR: branch 'main' is already checked out
git worktree add ../test main

# Solution: Force it (rare cases only)
git worktree add --force ../test main

# Better: Check out different branch or use detached HEAD
git worktree add -d ../test main
```

### Pitfall 2: Forgetting to Remove Worktrees

```bash
# List all worktrees
git worktree list

# Remove unused ones
git worktree remove ../old-worktree

# Prune stale entries
git worktree prune
```

### Pitfall 3: Worktree on Unmounted Drive

```bash
# Lock it before unmounting
git worktree lock ../external-drive-worktree \
  --reason "On external USB drive"

# Unlock when drive is back
git worktree unlock ../external-drive-worktree
```

### Pitfall 4: Submodule Issues

```bash
# Worktrees and submodules don't always play well
# After creating worktree, update submodules
cd ../new-worktree
git submodule update --init --recursive
```

### Pitfall 5: Confusion Between Worktrees

```bash
# Always check where you are!
git worktree list
pwd
git branch --show-current

# Use descriptive terminal prompts
# Add to ~/.zshrc or ~/.bashrc:
parse_git_branch() {
  git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}
PS1='[\w] $(parse_git_branch) $ '
```

## Advanced Techniques

### Scripting Worktree Creation

```bash
# Create worktree script
#!/bin/bash
# worktree-create.sh

BRANCH_NAME=$1
WORKTREE_PATH="../myapp-${BRANCH_NAME}"

git worktree add "$WORKTREE_PATH" -b "$BRANCH_NAME"
cd "$WORKTREE_PATH"
code .  # Open in VS Code
```

### Batch Cleanup

```bash
# Remove all worktrees except main
git worktree list --porcelain | \
  grep "worktree" | \
  grep -v "$(git rev-parse --show-toplevel)" | \
  cut -d' ' -f2 | \
  xargs -I {} git worktree remove {}
```

### Integration with Tools

```bash
# VS Code: Open worktree in new window
git worktree add ../review-pr && code ../review-pr

# tmux: Create pane for worktree
git worktree add ../test-branch && tmux split-window -h "cd ../test-branch; bash"

# Make aliases
git config alias.wt worktree
git config alias.wtl 'worktree list'
git config alias.wta 'worktree add'
git config alias.wtr 'worktree remove'
```

## Worktrees vs Alternatives

### Worktrees vs Stashing

| Worktrees | Stashing |
|-----------|----------|
| ✅ Multiple branches simultaneously | ❌ One branch at a time |
| ✅ Independent staging areas | ❌ Shared staging |
| ✅ No merge conflicts when switching | ⚠️ Potential stash conflicts |
| ✅ Long-running processes stay active | ❌ Must stop processes |
| ❌ Takes disk space | ✅ Minimal overhead |

### Worktrees vs Cloning

| Worktrees | Multiple Clones |
|-----------|-----------------|
| ✅ Shared repository (one `.git`) | ❌ Duplicate repositories |
| ✅ Less disk space | ❌ More disk space |
| ✅ Branches automatically synced | ❌ Must push/pull between clones |
| ✅ Single remote configuration | ⚠️ Multiple remote configs |
| ⚠️ Learning curve | ✅ Familiar workflow |

### Worktrees vs Bare Repositories

| Worktrees | Bare Repos |
|-----------|------------|
| ✅ Full working directory | ❌ No working directory |
| ✅ Easy to use | ⚠️ More complex workflow |
| ✅ Direct file editing | ❌ Must clone to edit |
| ⚠️ Main worktree required | ✅ True central repository |

## Quick Reference

### Command Cheat Sheet

```bash
# CREATE
git worktree add <path> <branch>      # New worktree from branch
git worktree add <path> -b <new>      # New worktree with new branch
git worktree add -d <path>            # Detached HEAD worktree

# MANAGE
git worktree list                     # List all worktrees
git worktree list -v                  # Verbose list
git worktree remove <path>            # Remove worktree
git worktree prune                    # Clean stale metadata

# MAINTAIN
git worktree move <old> <new>         # Move worktree
git worktree lock <path>              # Lock worktree
git worktree unlock <path>            # Unlock worktree
git worktree repair                   # Fix broken connections
```

### Common Workflows

```bash
# Quick hotfix workflow
git worktree add ../hotfix main
cd ../hotfix && git checkout -b fix/urgent
# ... fix bug ...
git push && cd - && git worktree remove ../hotfix

# PR review workflow  
git worktree add ../review pr/123
cd ../review && npm test && cd -
git worktree remove ../review

# Parallel development
git worktree add ../feature-a main -b feature/a
git worktree add ../feature-b main -b feature/b
# Work on both simultaneously
```

## Troubleshooting

### Problem: "fatal: invalid reference"

```bash
# Branch doesn't exist - create it first
git worktree add ../test -b new-branch main
```

### Problem: "fatal: already exists"

```bash
# Path already exists - remove or use different path
rm -rf ../test
# or
git worktree add ../test-2 branch
```

### Problem: Worktree not showing in list

```bash
# Repair broken worktree connections
git worktree repair
git worktree repair <path>
```

### Problem: Can't remove worktree

```bash
# Check for uncommitted changes
cd <worktree-path>
git status

# Force remove if needed
git worktree remove --force <path>
```

### Problem: Git commands slow in worktrees

```bash
# Too many stale worktrees - prune them
git worktree prune
git worktree prune --verbose
```

## Conclusion

Git worktrees are a powerful feature for managing multiple branches simultaneously. They shine in scenarios involving:
- Emergency bug fixes during feature development
- Code reviews without context switching
- Parallel testing of different branches
- Long-running builds or processes
- Working with multiple versions concurrently

While they have a learning curve, the productivity gains from eliminating constant branch switching make them invaluable for modern development workflows.

**Remember:** Worktrees are just another tool in your Git toolkit. Use them when they make sense, and stick with traditional branching when they don't. The best workflow is the one that helps you ship quality code efficiently!

## Additional Resources

- [Git Official Documentation](https://git-scm.com/docs/git-worktree)
- [Pro Git Book - Git Worktree](https://git-scm.com/book/en/v2)
- Git version requirement: Git 2.5+ (2015)
- Latest features in Git 2.35+ (improved performance and repair commands)

Happy parallel developing! 🚀
