# Git Tags - Marking Milestones in Your Project

## Overview

Git tags are like bookmarks or milestones in your repository's history. They mark specific points as important—typically releases like v1.0.0, v2.1.0, or significant checkpoints. Unlike branches that move as you commit, tags are permanent references that point to specific commits forever.

Think of tags as **immutable labels** that say "This exact commit is version 1.0" or "This is the state we shipped to production."

## Why Use Tags?

- **Version Releases**: Mark official releases (v1.0.0, v2.3.1)
- **Milestones**: Highlight important project checkpoints
- **Deployment References**: Know exactly what code is in production
- **Historical Context**: Quickly navigate to significant moments in your project
- **Semantic Versioning**: Communicate changes clearly to users

## Two Types of Tags

### Lightweight Tags

A lightweight tag is simply a **pointer to a commit**—nothing more. It's like a sticky note with a name on it.

**Characteristics:**
- Just a name pointing to a commit SHA
- No additional metadata stored
- Quick and simple to create
- Best for **private** or **temporary** markers
- Not stored as full Git objects

**When to use:**
- Quick personal bookmarks
- Temporary markers during development
- Internal team references
- When you don't need extra information

### Annotated Tags

An annotated tag is a **full Git object** with comprehensive metadata. It's like a formal certificate with all the details.

**Characteristics:**
- Stored as complete objects in Git database
- Contains tagger name, email, and date
- Includes a tagging message
- Has its own SHA-1 checksum
- Can be cryptographically signed (GPG)
- Best for **public** releases and **official** versions

**When to use:**
- Official releases (v1.0.0, v2.1.0)
- Public distributions
- Production deployments
- When you need audit trail
- Situations requiring signatures

## Creating Tags

### Creating Lightweight Tags

```bash
# Tag the current commit
git tag v1.0.0

# Tag a specific commit
git tag v0.9.0 abc1234

# Tag with a descriptive name
git tag milestone-beta
```

### Creating Annotated Tags

```bash
# Create annotated tag with editor for message
git tag -a v1.0.0

# Create annotated tag with inline message
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial public release"

# Tag a specific commit with annotation
git tag -a v0.9.0 abc1234 -m "Beta release"

# Create signed tag (requires GPG key)
git tag -s v2.0.0 -m "Signed release 2.0.0"
```

### Best Practices for Tag Messages

```bash
# Good annotated tag message
git tag -a v1.2.0 -m "Release 1.2.0

New Features:
- Added user authentication
- Implemented dark mode
- Added export functionality

Bug Fixes:
- Fixed memory leak in data processor
- Resolved CSS layout issues

Breaking Changes:
- API endpoint /old-path deprecated"

# Use multiline with text editor
git tag -a v1.2.0
# This opens your editor for a detailed message
```

## Listing Tags

```bash
# List all tags
git tag

# List tags with pattern matching
git tag -l "v1.*"
git tag -l "v2.0.*"
git tag --list "beta-*"

# Show annotated tag details
git show v1.0.0

# List tags with commit messages
git tag -n
git tag -n5  # Show first 5 lines of annotation
```

## Tag Naming Conventions

### Semantic Versioning (SemVer)

Most projects follow semantic versioning: **MAJOR.MINOR.PATCH**

```bash
# Format: vMAJOR.MINOR.PATCH
git tag -a v1.0.0 -m "Initial release"
git tag -a v1.0.1 -m "Patch: Bug fixes"
git tag -a v1.1.0 -m "Minor: New features, backward compatible"
git tag -a v2.0.0 -m "Major: Breaking changes"

# With pre-release identifiers
git tag -a v1.0.0-alpha -m "Alpha release"
git tag -a v1.0.0-beta.1 -m "First beta"
git tag -a v1.0.0-rc.1 -m "Release candidate 1"
```

**SemVer Rules:**
- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward-compatible)
- **PATCH**: Bug fixes (backward-compatible)

### Other Common Conventions

```bash
# Date-based versioning
git tag -a release-2024.10.10 -m "October 10, 2024 release"

# Build numbers
git tag -a build-1234 -m "Production build 1234"

# Milestone tags
git tag -a milestone-mvp -m "Minimum Viable Product"

# Environment tags
git tag -a prod-deploy-2024-q4 -m "Q4 2024 production deployment"
```

## Pushing Tags to Remote

**Important:** Tags are **NOT** automatically pushed with `git push`!

```bash
# Push a specific tag
git push origin v1.0.0

# Push all tags at once
git push origin --tags

# Push all annotated tags only (recommended)
git push origin --follow-tags

# Configure Git to always push annotated tags
git config --global push.followTags true
```

### Why Not Push All Tags?

```bash
# Problem: Accidentally push temporary tags
git tag temp-test      # Lightweight, for local testing
git push origin --tags # Oops! Now everyone has temp-test

# Solution: Use --follow-tags or push explicitly
git push origin v1.0.0  # Deliberate
```

## Deleting Tags

### Local Deletion

```bash
# Delete a local tag
git tag -d v1.0.0
git tag --delete v1.0.0

# Delete multiple tags
git tag -d v1.0.0 v1.0.1 v1.0.2
```

### Remote Deletion

```bash
# Delete remote tag (method 1: push empty ref)
git push origin :refs/tags/v1.0.0

# Delete remote tag (method 2: --delete flag)
git push origin --delete v1.0.0
git push origin -d v1.0.0

# Delete both local and remote
git tag -d v1.0.0
git push origin --delete v1.0.0
```

## Checking Out Tags

Tags point to specific commits, so checking them out creates a **detached HEAD** state.

```bash
# Check out a tag (detached HEAD)
git checkout v1.0.0

# Create a branch from a tag
git checkout -b hotfix-v1.0.0 v1.0.0

# View tag without checking out
git show v1.0.0
```

**Detached HEAD Warning:**
```plaintext
Note: switching to 'v1.0.0'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make without
any branch being affected. If you want to create a new branch to retain
commits you create, you can do so with:

  git switch -c <new-branch-name>
```

## Advanced Tag Operations

### Finding Tags

```bash
# Which tags contain a specific commit?
git tag --contains abc1234

# Which commits are in a tag?
git log v1.0.0

# Difference between two tags
git diff v1.0.0 v1.1.0

# Commits between tags
git log v1.0.0..v1.1.0

# Show tag creation date
git log -1 --format=%ai v1.0.0
```

### Tag Signing and Verification

```bash
# Create signed tag (requires GPG)
git tag -s v1.0.0 -m "Signed release"

# Verify a signed tag
git tag -v v1.0.0

# Show signature information
git show v1.0.0 --show-signature
```

### Replacing/Moving Tags

```bash
# ⚠️ Warning: Generally avoid moving tags!

# Force-update a tag locally
git tag -a v1.0.0 -m "Updated message" -f

# Force-push updated tag to remote
git push origin v1.0.0 --force

# Better approach: Use a new tag version
git tag -a v1.0.1 -m "Corrected release"
```

## Practical Workflows

### Release Workflow

```bash
# 1. Finish your release branch
git checkout main
git merge --no-ff release-v1.0.0

# 2. Create annotated tag
git tag -a v1.0.0 -m "Release 1.0.0

Features:
- User authentication
- Dashboard redesign
- Export functionality

Tested on: Ubuntu 22.04, macOS 14, Windows 11
Released: $(date +'%Y-%m-%d')"

# 3. Push everything
git push origin main
git push origin v1.0.0

# 4. Clean up release branch
git branch -d release-v1.0.0
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch from production tag
git checkout -b hotfix-v1.0.1 v1.0.0

# 2. Make fixes and commit
git commit -am "Fix critical security issue"

# 3. Merge back to main
git checkout main
git merge --no-ff hotfix-v1.0.1

# 4. Create patch tag
git tag -a v1.0.1 -m "Hotfix 1.0.1 - Security patch"

# 5. Push
git push origin main v1.0.1
```

### Deployment Workflow

```bash
# Tag what's currently deployed
git tag -a prod-2024-10-10 -m "Production deployment
Server: prod-server-01
Deployed by: alice@company.com
Deploy time: 2024-10-10 14:30:00 UTC"

# Later, rollback to that exact state
git checkout prod-2024-10-10
# Deploy this version
```

## Common Use Cases

### 1. Finding What Changed Between Releases

```bash
# See all commits between versions
git log --oneline v1.0.0..v1.1.0

# See file changes between versions
git diff --stat v1.0.0 v1.1.0

# Generate release notes
git log v1.0.0..v1.1.0 --pretty=format:"- %s (%an)"
```

### 2. Checking Which Version Has a Specific Fix

```bash
# Find which tags contain a commit
git tag --contains <commit-sha>

# Check if a specific tag has the fix
git log v1.0.0 --oneline | grep "fix: security issue"
```

### 3. Building from Specific Versions

```bash
# Checkout version for building
git checkout v1.0.0

# Build
npm run build

# Return to main branch
git checkout main
```

## Tags vs Branches

| Feature | Tags | Branches |
|---------|------|----------|
| **Purpose** | Mark specific points | Ongoing development |
| **Changes** | Immutable (shouldn't move) | Move with new commits |
| **Usage** | Releases, milestones | Feature work, fixes |
| **Lifecycle** | Permanent | Created and deleted |
| **Metadata** | Can be annotated | No built-in metadata |

## Best Practices Checklist

✅ **DO:**
- Use annotated tags for releases (`-a` flag)
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Write meaningful tag messages with release notes
- Push tags explicitly (`git push origin v1.0.0`)
- Sign important releases (`-s` flag)
- Use lightweight tags for personal bookmarks only

❌ **DON'T:**
- Use lightweight tags for public releases
- Assume tags are pushed automatically
- Move or change tags after pushing
- Delete tags that others depend on
- Use inconsistent naming conventions

## Troubleshooting

### Problem: Tag Already Exists

```bash
# Error: tag 'v1.0.0' already exists
# Solution: Either delete old tag or use new version
git tag -d v1.0.0
git tag -a v1.0.0 -m "New message"

# Or better: use next version
git tag -a v1.0.1 -m "Corrected release"
```

### Problem: Pushed Wrong Tag

```bash
# Delete locally
git tag -d v1.0.0

# Delete from remote
git push origin --delete v1.0.0

# Create correct tag
git tag -a v1.0.0 -m "Correct message"
git push origin v1.0.0
```

### Problem: Tags Not Showing Up Remotely

```bash
# Verify local tags
git tag

# Verify remote tags
git ls-remote --tags origin

# Push missing tags
git push origin v1.0.0
# Or push all
git push origin --tags
```

## Quick Reference

```bash
# CREATE
git tag v1.0.0                              # Lightweight tag
git tag -a v1.0.0 -m "message"             # Annotated tag
git tag -s v1.0.0 -m "message"             # Signed tag

# LIST
git tag                                     # List all tags
git tag -l "v1.*"                          # Pattern match
git show v1.0.0                            # Show tag details
git tag -n                                  # List with messages

# PUSH
git push origin v1.0.0                     # Push specific tag
git push origin --tags                     # Push all tags
git push origin --follow-tags              # Push annotated tags

# DELETE
git tag -d v1.0.0                          # Delete local
git push origin --delete v1.0.0            # Delete remote

# CHECKOUT
git checkout v1.0.0                        # Detached HEAD
git checkout -b branch-name v1.0.0         # Branch from tag

# FIND
git tag --contains <commit>                # Tags with commit
git log v1.0.0..v1.1.0                    # Commits between tags
git diff v1.0.0 v1.1.0                    # Changes between tags
```

## Practice Exercise

Let's practice using tags with a real scenario:

```bash
# 1. Create a new test repository
mkdir tag-practice && cd tag-practice
git init

# 2. Create some commits
echo "Initial version" > README.md
git add README.md
git commit -m "Initial commit"

echo "Added feature A" >> README.md
git commit -am "feat: Add feature A"

echo "Added feature B" >> README.md
git commit -am "feat: Add feature B"

# 3. Tag the initial release
git tag -a v1.0.0 HEAD~2 -m "Initial release v1.0.0"

# 4. Tag the current state
git tag -a v1.1.0 -m "Release v1.1.0

New Features:
- Feature A implementation
- Feature B implementation

Contributors: $(git config user.name)"

# 5. List your tags
git tag -n

# 6. View tag details
git show v1.0.0

# 7. See what changed between versions
git log --oneline v1.0.0..v1.1.0

# 8. Create a lightweight tag for testing
git tag current-dev

# 9. Practice checking out a tag
git checkout v1.0.0
cat README.md  # See the old version
git checkout main

# 10. Practice deleting a tag
git tag -d current-dev
```

## Key Takeaways

1. **Tags are permanent markers** in your Git history
2. **Annotated tags** are for releases; **lightweight tags** are for personal use
3. **Tags don't push automatically**—you must push them explicitly
4. **Follow semantic versioning** for clarity and consistency
5. **Never modify public tags**—create new versions instead
6. **Use meaningful messages** in annotated tags
7. **Tags enable easy rollback** to known-good states

## What's Next?

Now that you understand Git tags, you can:
- Mark important milestones in your projects
- Implement proper versioning workflows
- Easily navigate to release points
- Communicate changes clearly to users
- Maintain deployment history

In the next lesson, we'll explore **Git Hooks**—automated scripts that run at key points in your Git workflow!

---

**Pro Tip:** Set up a Git alias for common tagging operations:

```bash
# Add to ~/.gitconfig
[alias]
    tag-release = "!f() { git tag -a \"$1\" -m \"Release $1\"; git push origin \"$1\"; }; f"
    tags = tag -n --sort=-version:refname

# Usage:
git tag-release v1.2.0  # Creates and pushes in one command
git tags                # Lists tags, newest first
```
