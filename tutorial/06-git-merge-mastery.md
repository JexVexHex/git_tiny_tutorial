# Git Merge Mastery - Orchestrating Histories

## Overview

Merging is the heart of collaborative Git workflows. Whether you're synchronizing with a remote main branch or reconciling divergent feature branches, `git merge` lets you weave independent lines of development into a cohesive history. This lesson builds on everything you've learned to help you perform merges safely, confidently, and with a deep understanding of what happens under the hood.

## Visualizing Merge Scenarios

### Fast-Forward Merge

```
Before:              After fast-forward:
A---B---C (main)     A---B---C---D---E (main)
         \
          D---E (feature)
```

- Branch pointers simply "fast-forward."
- No merge commit created.
- Use `--no-ff` to force a merge commit even when fast-forward is possible.

### True (Three-Way) Merge

```
Before:              After true merge:
A---B---C (main)     A---B---C---F (main)
     \                       /
      D---E---F (feature)   /
```

- Both branches diverged.
- Git creates a merge commit with two parents.
- Working tree reflects combined changes.

### Octopus Merge (Multiple Parents)

```
   feature-a
      \
main---M
      / \
feature-b feature-c
```

- Use when merging more than two branches at once.
- Ideal for non-conflicting topic branches.
- Not suited for complex conflict resolution.

## Preparing for a Merge

1. **Commit or stash** local changes to avoid conflicts with in-progress work.
2. **Synchronize** with remotes: `git fetch --all`.
3. **Inspect** differences: `git log --oneline main..feature` or `git diff`.
4. **Ensure clean index**: Git aborts merges when staged changes diverge from `HEAD`.
5. **Communicate** with teammates about upcoming merges for large features.

## Command Reference

```bash
# Merge another branch into the current branch
git merge feature/login

# Preview without committing (non-fast-forward merges only)
git merge --no-commit feature/login

# Force a merge commit even if fast-forward is possible
git merge --no-ff feature/login

# Squash merge (prepare single commit without recording merge metadata)
git merge --squash feature/login
git commit -m "feat: add login flow"

# Abort an in-progress merge and restore pre-merge state
git merge --abort

# Resume after resolving conflicts
git merge --continue
```

## Strategies and Options

| Strategy | When to Use | Shortcut |
| --- | --- | --- |
| `ort` (default) | Most merges; optimized successor to `recursive`. | `git merge branch` |
| `ours` | Prefer current branch's changes; ignore incoming. | `git merge -s ours branch` |
| `theirs` (strategy option) | Prefer incoming changes in conflicted files. | `git merge -s ort -X theirs branch` |
| `octopus` | Combine multiple topic branches at once (non-conflicting). | `git merge branch1 branch2` |

### Strategy Options (`-X`)

- `patience` improves diff results for complex reordering.
- `ignore-space-change` reduces whitespace conflicts.
- `renormalize` reprocesses files to handle line-ending differences.
- `ours` / `theirs` (with `ort`) auto-resolve conflicts by picking one side.

### Safety Flags

- `--ff-only`: refuse merges requiring a merge commit.
- `--allow-unrelated-histories`: merge repositories with distinct ancestry.
- `--verify-signatures`: ensure merged commits are GPG signed.
- `--autostash`: automatically stash and reapply uncommitted changes.
- `--gpg-sign`: sign the resulting merge commit.

## Working Through Conflicts

When conflicts occur, Git:

1. Leaves `HEAD` at the current commit.
2. Records the incoming commit in `MERGE_HEAD`.
3. Keeps conflict markers in the working tree.
4. Stores three stages per conflicted file:
   - Stage 1: common ancestor
   - Stage 2: current branch version
   - Stage 3: incoming branch version

### Recognizing Conflict Markers

```text
<<<<<<< HEAD
Your branch changes
||||||| base
Common ancestor content (diff3 style)
=======
Incoming branch changes
>>>>>>> feature/login
```

### Conflict Workflow

1. Inspect conflicts: `git status`, `git diff`, `git diff --name-only --diff-filter=U`.
2. Resolve by editing files directly or launching a mergetool: `git mergetool`.
3. Use rerere to auto-apply known resolutions: `git config rerere.enabled true`.
4. Stage resolved files: `git add path/to/file`.
5. Continue merge: `git merge --continue` (runs `git commit` with prepared message).

### Helpful Commands

```bash
# See staged conflict stages
git ls-files -u

# View base/current/incoming versions
git show :1:path/to/file
git show :2:path/to/file
git show :3:path/to/file

# Inspect auto-merge content (with markers)
git show AUTO_MERGE:path/to/file
```

## Crafting Merge Commit Messages

- Default message includes branch names and a shortlog if `--log` is specified.
- Provide context: motivations, major changes, and follow-up tasks.
- Append metadata (`Co-authored-by`, `Signed-off-by`) as required.
- Use `--edit` to refine the auto-generated message; set `GIT_MERGE_AUTOEDIT=no` to disable.

## Squash vs Merge Commit

| Feature | `git merge` | `git merge --squash` |
| --- | --- | --- |
| Preserves branch history | ✅ | ❌ |
| Creates merge commit | ✅ (unless fast-forward) | ❌ |
| Ideal for | Maintaining provenance | Condensing experiments |
| Follow-up commit required | No (auto) | Yes (`git commit`) |
| Records parents | Yes | No |

Use squash merges for feature branches that don't benefit from detailed history, but avoid them when tracing individual commits matters (e.g., bug tracking, code archaeology).

## Advanced Tools

- **rerere** (`reuse recorded resolution`): accelerates repetitive conflict resolutions.
- **Autostash**: temporarily saves dirty worktrees before merges.
- **`git merge --into-name`**: forge commit messages referencing a target branch alias.
- **Merge hooks**: enforce policies or run automated validation before finalizing.

## Merge Safety Checklist

1. ✅ Local changes committed, stashed, or discarded.
2. ✅ Latest upstream fetched (`git fetch origin`).
3. ✅ Understand divergence (`git log --oneline main..feature`).
4. ✅ Tests pass on both branches.
5. ✅ Ready to handle conflicts (editor or merge tool configured).
6. ✅ Post-merge plan for pruning stale branches.

## Real-World Scenarios

### Synchronizing a Feature Branch

```bash
git checkout feature/payment
git fetch origin
git merge origin/main          # integrate latest upstream
# Resolve conflicts if any
git merge --continue
git push origin feature/payment
```

### Enforcing Non Fast-Forward Policy

```bash
git checkout main
git merge --no-ff feature/audit-logging
```

### Restarting a Failed Merge

```bash
# Abort and return to pre-merge state
git merge --abort
# Re-run after fixing blockers
git merge feature/audit-logging
```

## Quiz Time! 🎯

**Question 1**: What does `git merge --abort` do?  
- A) Resets to the merge commit  
- B) Aborts the merge process and tries to restore the pre-merge state  
- C) Automatically resolves conflicts  
- D) Deletes the merged branch

**Question 2**: Which option ensures a merge fails instead of creating a merge commit?  
- A) `--no-ff`  
- B) `--ff-only`  
- C) `--squash`  
- D) `--autostash`

**Question 3**: What does the `rerere` mechanism provide?  
- A) Automatic fast-forward merges  
- B) Reuse of previously recorded conflict resolutions  
- C) Signing merge commits with GPG  
- D) Automatic stashing of changes

**Question 4**: When should you use `git merge --squash`?  
- A) When you want to keep a detailed branch history  
- B) When merging unrelated repositories  
- C) When you need a single, consolidated commit without merge metadata  
- D) When resolving conflicts automatically

## Practice Exercise: Conflict Resolution Drill

1. **Create two branches and diverge intentionally**

```bash
git checkout -b feature/a
echo "Feature A line" >> merge.txt
git add merge.txt
git commit -m "Add Feature A line"

git checkout -b feature/b HEAD~1
echo "Feature B line" >> merge.txt
git add merge.txt
git commit -m "Add Feature B line"
```

2. **Merge and resolve**

```bash
git checkout feature/a
git merge feature/b   # produces conflict
```

3. **Resolve conflict**

- Edit `merge.txt` to reconcile both lines.
- Stage the file: `git add merge.txt`.
- Complete the merge: `git merge --continue`.

4. **Experiment with styles**

```bash
git config merge.conflictStyle diff3
git merge --abort
git merge feature/b
```

Observe new markers, resolve again, and commit.

## Troubleshooting

- **"Already up to date"**: current branch contains target commits; nothing to merge.
- **Unrelated histories**: use `--allow-unrelated-histories` carefully.
- **Dirty worktree**: stash or commit before retrying; consider `--autostash`.
- **Merge fails on CI**: replicate locally with `git merge --no-commit` and run the same validation steps.

## Next Steps

You're now equipped to merge with confidence. Practice merging under different scenarios, explore advanced options like `--verify-signatures`, and integrate merge automation into your team's workflow.

---

**Progress**: You've completed 100% of the Git Tiny Tutorial™!