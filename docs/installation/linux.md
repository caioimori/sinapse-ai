# Linux Installation Guide for SINAPSE

> 🌐 [EN](linux.md) | [PT](../pt/installation/linux.md)

---

## Supported Distributions

| Distribution | Version        | Status              |
| ------------ | -------------- | ------------------- |
| Ubuntu       | 20.04+ (LTS)   | ✅ Fully Supported  |
| Debian       | 11+ (Bullseye) | ✅ Fully Supported  |
| Fedora       | 37+            | ✅ Fully Supported  |
| Arch Linux   | Latest         | ✅ Fully Supported  |
| Linux Mint   | 21+            | ✅ Fully Supported  |
| Pop!\_OS     | 22.04+         | ✅ Fully Supported  |
| openSUSE     | Leap 15.4+     | ⚠️ Community Tested |
| CentOS/RHEL  | 9+             | ⚠️ Community Tested |

---

## Prerequisites

### 1. Node.js (v20 or higher)

Choose your installation method based on your distribution:

#### Ubuntu/Debian

```bash
# Update package list
sudo apt update

# Install Node.js using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

**Alternative: Using nvm (Recommended for development)**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Install and use Node.js 20
nvm install 20
nvm use 20
nvm alias default 20
```

#### Fedora

```bash
# Install Node.js from Fedora repos
sudo dnf install nodejs npm

# Or using NodeSource for latest version
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

#### Arch Linux

```bash
# Install from official repos
sudo pacman -S nodejs npm

# Or using nvm (recommended)
yay -S nvm  # If using AUR helper
nvm install 20
```

#### openSUSE

```bash
# Install Node.js
sudo zypper install nodejs20 npm20
```

### 2. Git

```bash
# Ubuntu/Debian
sudo apt install git

# Fedora
sudo dnf install git

# Arch
sudo pacman -S git

# Verify
git --version
```

### 3. GitHub CLI

```bash
# Ubuntu/Debian
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
&& sudo mkdir -p -m 755 /etc/apt/keyrings \
&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh -y

# Fedora
sudo dnf install gh

# Arch
sudo pacman -S github-cli

# Authenticate
gh auth login
```

### 4. Build Essentials (Optional but Recommended)

Some npm packages require compilation:

```bash
# Ubuntu/Debian
sudo apt install build-essential

# Fedora
sudo dnf groupinstall "Development Tools"

# Arch
sudo pacman -S base-devel
```

---

## Installation

### Quick Install

1. Open your terminal
2. Navigate to your project directory:

   ```bash
   cd ~/projects/my-project
   ```

3. Run the installer:

   ```bash
   npx github:caioimori/sinapse-ai install
   ```

### Manual Installation

If the quick install fails, try manual installation:

```bash
# Clone the repository
git clone https://github.com/caioimori/sinapse-ai.git ~/.sinapse-ai-source

# Navigate to the source
cd ~/.sinapse-ai-source

# Install dependencies
npm install

# Run installer for your project
node bin/sinapse-init.js ~/projects/my-project
```

### What the Installer Does

The installer automatically:

- ✅ Detects your Linux distribution and applies optimizations
- ✅ Creates necessary directories with proper Unix permissions (755/644)
- ✅ Configures provider adapters in the project:
  - Claude Code agents: `.claude/agents/`
  - Codex agents and skills: `.codex/agents/` and `.agents/skills/`
- ✅ Sets up shell scripts with Unix line endings (LF)
- ✅ Respects XDG Base Directory specification
- ✅ Handles symbolic links properly

---

## IDE-Specific Setup

### Claude Code

1. Agent adapters are installed in `.claude/agents/`.
2. Use `@developer` or another canonical agent ID to activate an agent.

### Codex

1. Agent descriptors are installed in `.codex/agents/`, with skills in `.agents/skills/`.
2. Use `$snps` for routing or `$sinapse-agent developer` for direct activation.

---

## Troubleshooting

### Permission Errors

```bash
# Fix npm global permissions (recommended method)
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Alternative: Fix ownership (if using sudo for npm)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### EACCES Errors

If you see `EACCES: permission denied`:

```bash
# Option 1: Use npm prefix (recommended)
npm config set prefix '~/.local'
export PATH="$HOME/.local/bin:$PATH"

# Option 2: Fix project permissions
chmod -R u+rwX .sinapse-ai
chmod -R u+rwX .claude
```

### npm WARN deprecated Warnings

These are usually harmless. To suppress:

```bash
npm install --no-warnings
```

### GitHub CLI Authentication Issues

```bash
# Check current auth status
gh auth status

# Re-authenticate if needed
gh auth login --web

# For SSH-based authentication
gh auth login -p ssh
```

### Slow Installation

If npm install is slow:

```bash
# Use a faster registry mirror
npm config set registry https://registry.npmmirror.com

# Or increase timeout
npm config set fetch-timeout 60000
```

### Missing libsecret (for credential storage)

```bash
# Ubuntu/Debian
sudo apt install libsecret-1-dev

# Fedora
sudo dnf install libsecret-devel

# Arch
sudo pacman -S libsecret
```

### WSL-Specific Issues

If running in Windows Subsystem for Linux:

```bash
# Ensure Windows paths don't interfere
echo 'export PATH=$(echo "$PATH" | tr ":" "\n" | grep -v "^/mnt/c" | tr "\n" ":")' >> ~/.bashrc

# Fix line ending issues
git config --global core.autocrlf input

# Performance: Move project to Linux filesystem
# Use ~/projects instead of /mnt/c/projects
```

---

## Environment Configuration

### Recommended .bashrc/.zshrc additions

```bash
# Node.js configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# npm global packages
export PATH="$HOME/.npm-global/bin:$PATH"

# SINAPSE configuration
export SINAPSE_HOME="$HOME/.sinapse-ai"
export PATH="$SINAPSE_HOME/bin:$PATH"

# Editor preference (for git commits, etc.)
export EDITOR=vim  # or code, nano, etc.
```

### XDG Base Directory Compliance

SINAPSE respects XDG directories:

```bash
# Data files: ~/.local/share/sinapse/
# Config files: ~/.config/sinapse/
# Cache: ~/.cache/sinapse/
# State: ~/.local/state/sinapse/
```

---

## Updating

To update an existing installation:

```bash
# Using npx (recommended)
npx github:caioimori/sinapse-ai install

# Manual update
cd ~/.sinapse-ai-source
git pull
npm install
node bin/sinapse-init.js ~/projects/my-project --update
```

The updater will:

- Detect your existing installation
- Back up any customizations to `.sinapse-backup/`
- Update only changed files
- Preserve your configurations

---

## Uninstallation

See the complete [Uninstallation Guide](./uninstallation.md) for detailed steps.

Quick uninstall:

```bash
# Remove SINAPSE through the package-managed uninstaller
npx sinapse-ai uninstall
```

---

## System Requirements

| Requirement | Minimum | Recommended |
| ----------- | ------- | ----------- |
| Kernel      | 4.15+   | 5.10+       |
| RAM         | 2GB     | 8GB         |
| Disk Space  | 500MB   | 2GB         |
| Node.js     | 18.x    | 20.x LTS    |
| npm         | 9.x     | 10.x        |

---

## Distribution-Specific Notes

### Ubuntu/Debian

- Pre-installed Python may conflict with some npm packages
- Use `deadsnakes` PPA for newer Python if needed

### Fedora

- SELinux may require additional configuration for some operations
- Use `sudo setenforce 0` temporarily if blocked

### Arch Linux

- Packages are always cutting-edge; test thoroughly
- AUR packages may be needed for some IDEs

### WSL (Windows Subsystem for Linux)

- Use WSL2 for better performance
- Store projects in `/home/user/` not `/mnt/c/`
- Configure `.wslconfig` for memory limits

---

## Next Steps

1. Configure your IDE (see IDE-specific setup above)
2. Run `*help` in your AI agent to see available commands
3. Start with the [User Guide](../guides/user-guide.md)
4. Join our [Discord Community](https://discord.gg/gk8jAdXWmj) for help

---

## Additional Resources

- [Main README](../../README.md)
- [User Guide](../guides/user-guide.md)
- [Troubleshooting Guide](troubleshooting.md)
- [FAQ](faq.md)
- [Discord Community](https://discord.gg/gk8jAdXWmj)
- [GitHub Issues](https://github.com/caioimori/sinapse-ai/issues)
