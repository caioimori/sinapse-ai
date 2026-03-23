# Uninstallation Guide

> 🌐 **EN** | [PT](./pt/uninstallation.md) | [ES](./es/uninstallation.md)

---

This guide provides comprehensive instructions for uninstalling SINAPSE from your system.

## Table of Contents

1. [Before You Uninstall](#before-you-uninstall)
2. [Quick Uninstall](#quick-uninstall)
3. [Complete Uninstall](#complete-uninstall)
4. [Selective Uninstall](#selective-uninstall)
5. [Data Preservation](#data-preservation)
6. [Clean System Removal](#clean-system-removal)
7. [Troubleshooting Uninstall](#troubleshooting-uninstall)
8. [Post-Uninstall Cleanup](#post-uninstall-cleanup)
9. [Reinstallation](#reinstallation)

## Before You Uninstall

### Important Considerations

⚠️ **Warning**: Uninstalling SINAPSE will:

- Remove all framework files
- Delete agent configurations (unless preserved)
- Clear memory layer data (unless backed up)
- Remove all custom workflows
- Delete logs and temporary files

### Pre-Uninstall Checklist

- [ ] Backup important data
- [ ] Export custom agents and workflows
- [ ] Save API keys and configurations
- [ ] Document custom modifications
- [ ] Stop all running processes
- [ ] Inform team members

### Backup Your Data

```bash
# Create complete backup
npx sinapse-ai backup --complete

# Or manually backup important directories
tar -czf sinapse-backup-$(date +%Y%m%d).tar.gz \
  .sinapse/ \
  agents/ \
  workflows/ \
  tasks/ \
  --exclude=.sinapse/logs \
  --exclude=.sinapse/cache
```

## Quick Uninstall

### Using Built-in Uninstaller

The fastest way to uninstall SINAPSE:

```bash
# Basic uninstall (preserves user data)
npx sinapse-ai uninstall

# Complete uninstall (removes everything)
npx sinapse-ai uninstall --complete

# Uninstall with data preservation
npx sinapse-ai uninstall --keep-data
```

### Interactive Uninstall

For guided uninstallation:

```bash
npx sinapse-ai uninstall --interactive
```

This will prompt you for:

- What to keep/remove
- Backup options
- Confirmation for each step

## Complete Uninstall

### Step 1: Stop All Services

```bash
# Stop all running agents
*deactivate --all

# Stop all workflows
*stop-workflow --all

# Shutdown meta-agent
*shutdown
```

### Step 2: Export Important Data

```bash
# Export configurations
*export config --destination backup/config.json

# Export agents
*export agents --destination backup/agents/

# Export workflows
*export workflows --destination backup/workflows/

# Export memory data
*export memory --destination backup/memory.zip
```

### Step 3: Run Uninstaller

```bash
# Complete removal
npx sinapse-ai uninstall --complete --no-backup
```

### Step 4: Remove Global Installation

```bash
# Remove global npm package
npm uninstall -g sinapse-ai

# Remove npx cache
npm cache clean --force
```

### Step 5: Clean System Files

#### Windows

```powershell
# Remove AppData files
Remove-Item -Recurse -Force "$env:APPDATA\sinapse-ai"

# Remove temp files
Remove-Item -Recurse -Force "$env:TEMP\sinapse-*"

# Remove registry entries (if any)
Remove-Item -Path "HKCU:\Software\SINAPSE" -Recurse
```

#### macOS/Linux

```bash
# Remove config files
rm -rf ~/.sinapse
rm -rf ~/.config/sinapse-ai

# Remove cache
rm -rf ~/.cache/sinapse-ai

# Remove temp files
rm -rf /tmp/sinapse-*
```

## Selective Uninstall

### Remove Specific Components

```bash
# Remove only agents
npx sinapse-ai uninstall agents

# Remove only workflows
npx sinapse-ai uninstall workflows

# Remove memory layer
npx sinapse-ai uninstall memory-layer

# Remove specific agent
*uninstall agent-name
```

### Keep Core, Remove Extensions

```bash
# Remove all plugins
*plugin remove --all

# Remove Squads
rm -rf Squads/

# Remove custom templates
rm -rf templates/custom/
```

## Data Preservation

### What to Keep

Before uninstalling, identify what you want to preserve:

1. **Custom Agents**

   ```bash
   # Copy custom agents
   cp -r agents/custom/ ~/sinapse-backup/agents/
   ```

2. **Workflows and Tasks**

   ```bash
   # Copy workflows
   cp -r workflows/ ~/sinapse-backup/workflows/
   cp -r tasks/ ~/sinapse-backup/tasks/
   ```

3. **Memory Data**

   ```bash
   # Export memory database
   *memory export --format sqlite \
     --destination ~/sinapse-backup/memory.db
   ```

4. **Configurations**

   ```bash
   # Copy all config files
   cp .sinapse/config.json ~/sinapse-backup/
   cp .env ~/sinapse-backup/
   ```

5. **Custom Code**
   ```bash
   # Find and backup custom files
   find . -name "*.custom.*" -exec cp {} ~/sinapse-backup/custom/ \;
   ```

### Preservation Script

Create `preserve-data.sh`:

```bash
#!/bin/bash
BACKUP_DIR="$HOME/sinapse-backup-$(date +%Y%m%d-%H%M%S)"

echo "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Backup function
backup_if_exists() {
    if [ -e "$1" ]; then
        echo "Backing up $1..."
        cp -r "$1" "$BACKUP_DIR/"
    fi
}

# Backup all important data
backup_if_exists ".sinapse"
backup_if_exists "agents"
backup_if_exists "workflows"
backup_if_exists "tasks"
backup_if_exists "templates"
backup_if_exists ".env"
backup_if_exists "package.json"

echo "Backup completed at: $BACKUP_DIR"
```

## Clean System Removal

### Complete Cleanup Script

Create `clean-uninstall.sh`:

```bash
#!/bin/bash
echo "SINAPSE Complete Uninstall"
echo "================================="

# Confirmation
read -p "This will remove ALL SINAPSE data. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Stop all processes
echo "Stopping all processes..."
pkill -f "sinapse-ai" || true
pkill -f "sinapse-developer" || true

# Remove project files
echo "Removing project files..."
rm -rf .sinapse/
rm -rf agents/
rm -rf workflows/
rm -rf tasks/
rm -rf templates/
rm -rf Squads/
rm -rf node_modules/sinapse-ai/

# Remove global files
echo "Removing global files..."
npm uninstall -g sinapse-ai

# Remove user data
echo "Removing user data..."
rm -rf ~/.sinapse
rm -rf ~/.config/sinapse-ai
rm -rf ~/.cache/sinapse-ai

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Remove from package.json
echo "Updating package.json..."
npm uninstall sinapse-ai/core
npm uninstall sinapse-ai/memory
npm uninstall sinapse-ai/meta-agent

echo "Uninstall complete!"
```

### Registry Cleanup (Windows)

```powershell
# PowerShell script for Windows cleanup
Write-Host "Cleaning SINAPSE from Windows Registry..."

# Remove from PATH
$path = [Environment]::GetEnvironmentVariable("PATH", "User")
$newPath = ($path.Split(';') | Where-Object { $_ -notmatch 'sinapse-ai' }) -join ';'
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")

# Remove registry keys
Remove-ItemProperty -Path "HKCU:\Environment" -Name "SINAPSE_*" -ErrorAction SilentlyContinue

# Remove file associations
Remove-Item -Path "HKCU:\Software\Classes\.sinapse" -Recurse -ErrorAction SilentlyContinue

Write-Host "Registry cleanup complete!"
```

## Troubleshooting Uninstall

### Common Issues

#### 1. Permission Denied

```bash
# Linux/macOS
sudo npx sinapse-ai uninstall --complete

# Windows (Run as Administrator)
npx sinapse-ai uninstall --complete
```

#### 2. Process Still Running

```bash
# Force stop all processes
# Linux/macOS
killall -9 node
killall -9 sinapse-ai

# Windows
taskkill /F /IM node.exe
taskkill /F /IM sinapse-ai.exe
```

#### 3. Files Locked

```bash
# Find processes using files
# Linux/macOS
lsof | grep sinapse

# Windows (PowerShell)
Get-Process | Where-Object {$_.Path -like "*sinapse*"}
```

#### 4. Incomplete Removal

```bash
# Manual cleanup
find . -name "*sinapse*" -type d -exec rm -rf {} +
find . -name "*.sinapse*" -type f -delete
```

### Force Uninstall

If normal uninstall fails:

```bash
#!/bin/bash
# force-uninstall.sh
echo "Force uninstalling SINAPSE..."

# Kill all related processes
pkill -9 -f sinapse || true

# Remove all files
rm -rf .sinapse* sinapse* *sinapse*
rm -rf agents workflows tasks templates
rm -rf node_modules/sinapse-ai
rm -rf ~/.sinapse* ~/.config/sinapse* ~/.cache/sinapse*

# Clean npm
npm cache clean --force
npm uninstall -g sinapse-ai

echo "Force uninstall complete!"
```

## Post-Uninstall Cleanup

### 1. Verify Removal

```bash
# Check for remaining files
find . -name "*sinapse*" 2>/dev/null
find ~ -name "*sinapse*" 2>/dev/null

# Check npm packages
npm list -g | grep sinapse
npm list | grep sinapse

# Check running processes
ps aux | grep sinapse
```

### 2. Clean Environment Variables

```bash
# Remove from .bashrc/.zshrc
sed -i '/SINAPSE_/d' ~/.bashrc
sed -i '/sinapse-ai/d' ~/.bashrc

# Remove from .env files
find . -name ".env*" -exec sed -i '/SINAPSE_/d' {} \;
```

### 3. Update Project Files

```javascript
// Remove from package.json scripts
{
  "scripts": {
    // Remove these entries
    "sinapse": "sinapse-ai",
    "meta-agent": "sinapse-ai meta-agent"
  }
}
```

### 4. Clean Git Repository

```bash
# Remove SINAPSE-specific git hooks
rm -f .git/hooks/*sinapse*

# Update .gitignore
sed -i '/.sinapse/d' .gitignore
sed -i '/sinapse-/d' .gitignore

# Commit removal
git add -A
git commit -m "Remove SINAPSE"
```

## Reinstallation

### After Complete Uninstall

If you want to reinstall SINAPSE:

1. **Wait for cleanup**

   ```bash
   # Ensure all processes stopped
   sleep 5
   ```

2. **Clear npm cache**

   ```bash
   npm cache clean --force
   ```

3. **Fresh installation**
   ```bash
   npx sinapse-ai@latest init my-project
   ```

### Restoring from Backup

```bash
# Restore saved data
cd my-project

# Restore configurations
cp ~/sinapse-backup/config.json .sinapse/

# Restore agents
cp -r ~/sinapse-backup/agents/* ./agents/

# Import memory
*memory import ~/sinapse-backup/memory.zip

# Verify restoration
*doctor --verify-restore
```

## Uninstall Verification Checklist

- [ ] All SINAPSE processes stopped
- [ ] Project files removed
- [ ] Global npm package uninstalled
- [ ] User configuration files deleted
- [ ] Cache directories cleaned
- [ ] Environment variables removed
- [ ] Registry entries cleaned (Windows)
- [ ] Git repository updated
- [ ] No remaining SINAPSE files found
- [ ] System PATH updated

## Getting Help

If you encounter issues during uninstallation:

1. **Check Documentation**
   - [FAQ](https://github.com/SinapseAI/sinapse-ai/wiki/faq#uninstall)
   - [Troubleshooting](https://github.com/SinapseAI/sinapse-ai/wiki/troubleshooting)

2. **Community Support**
   - Discord: #uninstall-help
   - GitHub Issues: Label with "uninstall"

3. **Emergency Support**
   ```bash
   # Generate uninstall report
   npx sinapse-ai diagnose --uninstall > uninstall-report.log
   ```

---

**Remember**: Always backup your data before uninstalling. The uninstall process is irreversible, and data recovery may not be possible without proper backups.
