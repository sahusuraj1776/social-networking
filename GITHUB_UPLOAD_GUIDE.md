# GitHub Upload Guide

This guide will help you upload your Social Networking project to GitHub.

## Prerequisites

1. **GitHub Account** - Create one at [github.com](https://github.com)
2. **Git Installed** - Download from [git-scm.com](https://git-scm.com/)
3. **Git Configured**:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

---

## Step-by-Step Instructions

### Step 1: Create a Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click the **+** icon in the top right corner
3. Select **New repository**
4. Fill in:
   - **Repository name**: `social-networking` (or your preferred name)
   - **Description**: `A full-stack social networking platform`
   - **Visibility**: Choose **Public** or **Private**
   - **Do NOT initialize** with README, .gitignore, or license (we already have these)
5. Click **Create repository**

You'll see a page with commands to push your code.

---

### Step 2: Initialize Git (First Time Only)

Open PowerShell in your project root directory and run:

```powershell
cd "Social Networking"
git init
git add .
git commit -m "Initial commit: Social networking platform with NestJS backend and Angular frontend"
```

---

### Step 3: Add Remote and Push to GitHub

Replace `YOUR_USERNAME` and `REPOSITORY_NAME` with your GitHub username and repository name:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
git branch -M main
git push -u origin main
```

Or if you prefer SSH (requires SSH key setup):

```powershell
git remote add origin git@github.com:YOUR_USERNAME/REPOSITORY_NAME.git
git branch -M main
git push -u origin main
```

---

### Step 4: Verify Upload

1. Go to your GitHub repository URL: `https://github.com/YOUR_USERNAME/REPOSITORY_NAME`
2. You should see:
   - README.md
   - .gitignore
   - backend/ folder
   - frontend-angular/ folder
   - **NO node_modules** folder ✓

---

## Updating Your Repository

After making changes locally:

```powershell
git add .
git commit -m "Your commit message"
git push
```

---

## Checking What Will Be Pushed

Before pushing, you can see what will be uploaded:

```powershell
# See status
git status

# See what's staged
git diff --cached

# See what will be ignored
git check-ignore -v *
```

---

## Helpful Git Commands

```powershell
# View git configuration
git config --list

# See commit history
git log

# Undo changes in a file
git checkout -- filename

# Remove a file from staging
git reset HEAD filename

# View remote URL
git remote -v

# Change remote URL if needed
git remote set-url origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
```

---

## GitHub Collaboration (Optional)

### Add Collaborators

1. Go to your repository
2. Click **Settings** → **Collaborators**
3. Click **Add people**
4. Search for and add collaborators

### Clone Repository

Once uploaded, anyone can clone with:

```bash
git clone https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
cd REPOSITORY_NAME
npm install  # in both backend and frontend-angular
```

---

## Important Notes

✓ **What's Included:**
- Source code (TypeScript, HTML, CSS)
- Configuration files
- package.json (but NOT node_modules)
- Documentation (README.md)

✗ **What's Excluded:**
- node_modules/ (too large, ~500MB+)
- .env files (contains sensitive credentials)
- Build artifacts (dist/, build/)
- IDE settings (.vscode, .idea)
- OS files (.DS_Store, Thumbs.db)
- Uploaded user files (uploads/*)

---

## Troubleshooting

### Error: "fatal: not a git repository"

**Solution**: Make sure you're in the project root directory:
```powershell
cd "C:\Users\Sahu Suraj\Videos\Projects\Social Networking"
git init
```

### Error: "permission denied (publickey)"

**Solution**: Use HTTPS instead of SSH:
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
```

### Error: "Changes not staged for commit"

**Solution**: Stage and commit your changes:
```powershell
git add .
git commit -m "Your message"
git push
```

### node_modules was accidentally pushed

**Solution**:
```powershell
git rm -r --cached node_modules
git commit -m "Remove node_modules from repository"
git push
```

---

## Setting Up From Cloned Repository

When someone (or you) clones this repository later:

```bash
git clone https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
cd REPOSITORY_NAME

# Backend setup
cd backend
npm install

# In another terminal - Frontend setup
cd frontend-angular
npm install

# Then follow README.md for running the project
```

---

## Protect Your Repository (Recommended)

1. Go to **Settings** → **Branches**
2. Add a branch protection rule for `main`:
   - Require pull request reviews
   - Require status checks to pass
   - Include administrators

---

## GitHub Actions (Optional CI/CD)

You can add automated testing/linting. Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install && npm run lint
      - run: cd frontend-angular && npm install && npm run test
```

---

Good luck with your GitHub upload! 🚀
