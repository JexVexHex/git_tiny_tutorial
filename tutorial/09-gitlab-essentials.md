# GitLab Essentials - From Git to DevOps

## What is GitLab?

**GitLab** is a comprehensive DevOps platform that extends Git with integrated tools for the entire software development lifecycle. While GitHub is primarily a Git repository hosting service, GitLab is a complete platform that includes:

- **Repository Hosting**: Git-based version control
- **CI/CD Pipelines**: Automated testing and deployment
- **Issue Tracking**: Project management and bug tracking
- **Merge Requests**: Code review and collaboration
- **Container Registry**: Docker image storage
- **Wiki & Documentation**: Built-in project documentation

### GitLab vs GitHub

| Feature | GitLab | GitHub |
|---------|--------|--------|
| **Built-in CI/CD** | ✅ GitLab CI/CD (native) | ✅ GitHub Actions |
| **Self-hosting** | ✅ Community & EE editions | ❌ Enterprise only |
| **Merge/Pull Requests** | Merge Requests | Pull Requests |
| **Issue Tracking** | Native & Advanced | Basic & Advanced (Apps) |
| **Container Registry** | ✅ Included | ❌ Separate service |
| **DevOps Focus** | ✅ Primary focus | Secondary feature |
| **Learning Curve** | Steeper | Gentler |

## Creating a GitLab Repository

### Step 1: Create a New Project

**Via the GitLab UI:**

1. **Log in** to your GitLab account at [gitlab.com](https://gitlab.com)
2. Click the **"+"** icon in the top navigation or click **"New project"**
3. Choose **"Create blank project"**
4. Fill in the project details:
   - **Project name**: A descriptive name (e.g., "my-awesome-app")
   - **Project slug**: URL-friendly version (auto-generated)
   - **Visibility**: Choose **Private**, **Internal**, or **Public**
   - **README**: Optionally initialize with README
   - **Gitignore**: Select a template for your project type
5. Click **"Create project"**

**Key Visibility Levels:**
- **Private**: Only you and invited members can access
- **Internal**: All GitLab users can access (good for enterprise)
- **Public**: Anyone on the internet can see and clone

### Step 2: Obtain Your Repository URL

After creating your project, you'll see the project page with two URL options:

```bash
# HTTPS URL (works everywhere, may need personal access token)
https://gitlab.com/username/project-name.git

# SSH URL (requires SSH key setup)
git@gitlab.com:username/project-name.git
```

**Recommendation**: Use SSH for less typing, or HTTPS if SSH isn't configured yet.

## Pushing an Existing Git Repository to GitLab

### Scenario: You Already Have a Local Git Repository

You have a project on your computer with Git history, and you want to upload it to a new GitLab repository.

### Method 1: Using git remote

```bash
# Navigate to your existing repository
cd /path/to/my-project

# Check current remotes
git remote -v

# Add GitLab as the new remote origin
git remote add origin https://gitlab.com/yourusername/my-project.git

# Push all branches to GitLab
git push -u origin main

# Or, if your default branch is not 'main'
git push -u origin master  # for older repositories
```

### Method 2: Mirror an Existing Repository (Preserve All History)

If you have multiple branches or tags you want to preserve:

```bash
# Create a bare clone (includes all branches and tags)
git clone --mirror /path/to/local/repo/.git

# Push to GitLab
cd repo.git
git push --mirror https://gitlab.com/yourusername/my-project.git
```

### Method 3: Replace Remote (Already Has Remote)

If your project already has a remote (like GitHub):

```bash
# Replace the existing remote
git remote remove origin
git remote add origin https://gitlab.com/yourusername/my-project.git
git push -u origin main

# Or rename and add both
git remote rename origin github
git remote add origin https://gitlab.com/yourusername/my-project.git
git push -u origin main
```

### Complete Example

```bash
# 1. Create new project on GitLab (no initialization)

# 2. On your local machine
cd ~/my-existing-project
git remote -v
# origin  https://github.com/user/my-project.git

# 3. Change the remote URL to GitLab
git remote set-url origin https://gitlab.com/yourusername/my-project.git

# 4. Verify the change
git remote -v
# origin  https://gitlab.com/yourusername/my-project.git

# 5. Push to GitLab
git push -u origin main

# 6. Push all branches
git push -u origin --all

# 7. Push all tags
git push -u origin --tags
```

**⚠️ Important**: Create the project on GitLab WITHOUT initializing it with README, .gitignore, or LICENSE. If you initialize it, you'll get a conflict when pushing.

## GitLab CI/CD Pipelines

### What is CI/CD?

**CI (Continuous Integration)**:
- Automatically test code when you push changes
- Catch bugs early
- Ensure code quality before merging

**CD (Continuous Deployment)**:
- Automatically deploy code to servers
- From testing → staging → production
- Reduce manual deployment work

### Setting Up a Basic Pipeline

Create a file named `.gitlab-ci.yml` in your repository root:

```yaml
# Define stages that run in sequence
stages:
  - build
  - test
  - deploy

# Build stage job
build_job:
  stage: build
  script:
    - echo "Building application..."
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

# Test stage job
test_job:
  stage: test
  script:
    - echo "Running tests..."
    - npm test
  coverage: '/Coverage: \d+\.\d+%/'

# Deploy stage job (only on main branch)
deploy_job:
  stage: deploy
  script:
    - echo "Deploying to production..."
    - ./deploy.sh
  only:
    - main
```

### GitLab CI/CD vs GitHub Actions

| Aspect | GitLab CI/CD | GitHub Actions |
|--------|------------|-----------------|
| **Configuration** | `.gitlab-ci.yml` | `.github/workflows/*.yml` |
| **Runners** | GitLab.com runners included | GitHub runners or self-hosted |
| **Setup** | Works out-of-the-box | Requires setup |
| **Variables** | `$CI_*` environment variables | `${{ github.* }}` context |
| **Artifacts** | Built-in artifact storage | Limited storage |
| **Cost Model** | Generous free tier | Minutes-based billing |

### Key GitLab CI/CD Features

```yaml
# Run job only on merge requests
test_mr:
  stage: test
  script:
    - npm test
  only:
    - merge_requests

# Run job only on specific branches
deploy_production:
  stage: deploy
  script:
    - ./deploy.sh
  only:
    - main
  when: manual  # Require manual approval

# Run job for all branches except main
test_branches:
  stage: test
  script:
    - npm test
  except:
    - main

# Use variables
test_with_env:
  stage: test
  script:
    - echo "Testing in $ENVIRONMENT"
  variables:
    ENVIRONMENT: "staging"
```

## Issues - Project Management in GitLab

### Creating an Issue

Issues are used to track bugs, features, tasks, and discussions:

```plaintext
Steps:
1. Navigate to your project
2. Click "Issues" in the left sidebar
3. Click "New issue" button
4. Fill in:
   - Title: Concise description of the issue
   - Description: Detailed explanation (supports Markdown)
   - Assignees: Who will work on it
   - Labels: Categorize (bug, feature, enhancement, etc.)
   - Milestone: Link to project release
   - Due Date: Target completion date
5. Click "Create issue"
```

### Issue Features

**Linking Issues**:
```markdown
# In issue description or comments:
Fixes #123          # Automatically closes issue #123 when merged
Closes #456         # Same as "Fixes"
Related to #789     # Link without auto-closing
Blocks #101         # This issue blocks another
```

**Issue Templates**:
Create `.gitlab/issue_templates/Bug_Report.md`:
```markdown
## Description
What is the bug?

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Environment
- OS: 
- Browser:
- Version:
```

### Issue Workflow

```plaintext
New Issue
    ↓
Assigned to Team Member
    ↓
In Progress (label: in-progress)
    ↓
Code Review (linked merge request)
    ↓
Resolved (issue closes via MR)
    ↓
Closed
```

## Merge Requests - Code Review & Collaboration

### Creating a Merge Request

A merge request (MR) is GitLab's equivalent to a GitHub pull request:

```bash
# 1. Create a feature branch
git checkout -b feature/user-authentication

# 2. Make your changes and commit
git add .
git commit -m "Add user authentication"

# 3. Push to GitLab
git push -u origin feature/user-authentication

# 4. GitLab will show a prompt to create an MR
# Or navigate to Merge Requests → New Merge Request

# 5. Fill in MR details:
#    - Title: Clear description of changes
#    - Description: Why, what, how
#    - Link issues: "Closes #123"
#    - Assignees: Reviewer
#    - Labels: type of change
#    - Milestone: Which release
```

### Merge Request Template

Create `.gitlab/merge_request_templates/Default.md`:
```markdown
## Description
What does this MR do?

## Related Issue
Closes #(issue number)

## Changes
- Change 1
- Change 2

## Testing
How to test these changes?

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

### MR Review & Approval

```plaintext
Feature Branch Created
    ↓
Push Changes
    ↓
Create Merge Request
    ↓
Automated Tests Run (CI/CD pipeline)
    ↓
Code Review (comments, suggestions)
    ↓
Discussions & Changes
    ↓
Approval (if required)
    ↓
Merge into Main
    ↓
Delete Feature Branch
    ↓
CI/CD Deploys (if configured)
```

### Advanced MR Features

**Require Approvals**:
Navigate to Settings → Merge Requests → Require approval

**Auto-merge on Pipeline Success**:
```plaintext
In MR: Click "Merge when pipeline succeeds"
```

**Squash and Merge**:
```plaintext
Keep feature branch commits separate or combine them:
- Merge commit: Preserves all commits
- Squash commits: Combines all into one
- Fast-forward merge: Linear history
```

## Complete GitLab Workflow Example

Here's a realistic workflow from start to finish:

```bash
# 1. Create project on GitLab

# 2. Clone to local machine
git clone https://gitlab.com/yourusername/my-app.git
cd my-app

# 3. Create feature branch
git checkout -b feature/dark-mode

# 4. Make changes
echo "// Dark mode styles" > dark.css
git add dark.css
git commit -m "Add dark mode support"

# 5. Push branch
git push -u origin feature/dark-mode

# 6. GitLab creates merge request (or create manually)
# - Add description: "Implements dark mode toggle"
# - Link issue: "Closes #42"
# - Assign reviewers

# 7. CI/CD pipeline runs automatically
# - Tests execute
# - Linting checks
# - Build verification

# 8. Team reviews the MR
# - Comments on code
# - Requests changes
# - Approves changes

# 9. After approval, merge
# - Click "Merge" button
# - Choose merge strategy
# - Delete feature branch

# 10. CI/CD deploys automatically (if configured)
```

## Advantages of Using GitLab

✅ **Built-in DevOps**: Everything in one platform  
✅ **Self-hosting**: Run on your own infrastructure  
✅ **Better GitOps**: Native Kubernetes support  
✅ **Value for Money**: More features than competitors  
✅ **Community-focused**: Active open-source community  

## Common GitLab Workflows

### Workflow 1: Solo Development
```
Feature Branch → Push → MR → Review Own Code → Merge → Auto Deploy
```

### Workflow 2: Team Development
```
Feature Branch → Push → MR → Assign Reviewers → Discussions → 
Approve → Merge → Automated Deploy
```

### Workflow 3: Release Management
```
Develop Branch → Feature PRs → Release Branch → Tag Version → 
Build Release → Deploy to Production
```

## Quiz Time! 🎯

**Question 1**: What is the main difference between GitLab and GitHub?
- A) GitLab has better Git support
- B) GitLab includes built-in CI/CD, while GitHub uses Actions
- C) GitLab only works with Linux
- D) GitHub has more features than GitLab

**Question 2**: What file configures GitLab CI/CD pipelines?
- A) `.github-ci.yml`
- B) `gitlab-pipeline.yml`
- C) `.gitlab-ci.yml`
- D) `ci-config.yaml`

**Question 3**: When pushing an existing repository to GitLab, what should you avoid?
- A) Using HTTPS instead of SSH
- B) Initializing the GitLab project with README
- C) Using git push --all
- D) Adding tags to commits

**Question 4**: What is a Merge Request in GitLab?
- A) A request to merge two repositories
- B) A request for code review before merging branches
- C) A way to request features from GitLab
- D) An automated merge operation

**Question 5**: How can you link an issue to close it automatically via a Merge Request?
- A) Use "Closes #123" in the MR description
- B) Manually close the issue after merging
- C) Add an issue link in the commit message
- D) Both A and C are correct

## Practice Exercise

Let's practice with GitLab:

1. **Create a GitLab account** at [gitlab.com](https://gitlab.com)

2. **Create a new project**:
   - Project name: "my-gitlab-project"
   - Visibility: Private
   - Don't initialize with README

3. **Create a local repository**:
   ```bash
   mkdir ~/my-gitlab-project
   cd ~/my-gitlab-project
   git init
   echo "# My GitLab Project" > README.md
   git add README.md
   git commit -m "Initial commit"
   ```

4. **Add GitLab as remote and push**:
   ```bash
   git remote add origin https://gitlab.com/yourusername/my-gitlab-project.git
   git branch -M main
   git push -u origin main
   ```

5. **Create a feature branch**:
   ```bash
   git checkout -b feature/add-content
   echo "## Features" >> README.md
   git add README.md
   git commit -m "Add features section"
   git push -u origin feature/add-content
   ```

6. **Create a Merge Request**:
   - Go to your GitLab project
   - Click "Merge requests" → "New merge request"
   - Select feature/add-content → main
   - Add title: "Add content to README"
   - Click "Create merge request"

7. **Review and Merge**:
   - Check CI/CD pipeline status
   - Review the changes
   - Click "Merge" button
   - Delete the feature branch

8. **Create an Issue**:
   - Click "Issues" → "New issue"
   - Title: "Add code examples"
   - Description: "Add example code snippets to README"
   - Click "Create issue"

## Next Steps

Excellent! You've learned GitLab essentials. You now understand:
- How to create and manage repositories on GitLab
- Pushing existing repositories to GitLab
- Setting up CI/CD pipelines
- Using Issues for project management
- Creating and reviewing Merge Requests

Practice these skills regularly, and you'll become proficient with GitLab's powerful DevOps platform!

---

**Progress**: You've completed 90% of the Git Tiny Tutorial™
