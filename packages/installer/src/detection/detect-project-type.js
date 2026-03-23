const fs = require('fs');
const path = require('path');

/**
 * Detects the type of project in the current directory
 * 
 * Detection Priority Order:
 * 1. EXISTING_SINAPSE - .sinapse-ai/ directory exists
 * 2. GREENFIELD - directory is empty
 * 3. BROWNFIELD - package.json OR .git exists
 * 4. UNKNOWN - directory has files but no recognized markers
 * 
 * @param {string} targetDir - Directory to analyze (defaults to process.cwd())
 * @returns {string} 'GREENFIELD' | 'BROWNFIELD' | 'EXISTING_SINAPSE' | 'UNKNOWN'
 * @throws {Error} If directory cannot be accessed
 * 
 * @example
 * // Detect current directory
 * const type = detectProjectType();
 * console.log(type); // 'GREENFIELD'
 * 
 * @example
 * // Detect specific directory
 * const type = detectProjectType('/path/to/project');
 * console.log(type); // 'BROWNFIELD'
 */
function detectProjectType(targetDir = process.cwd()) {
  try {
    // Validate targetDir parameter
    if (!targetDir || typeof targetDir !== 'string') {
      throw new Error('Invalid targetDir parameter: must be a non-empty string');
    }

    // Normalize path for cross-platform compatibility
    const normalizedDir = path.resolve(targetDir);

    // Check if directory exists before attempting to read
    if (!fs.existsSync(normalizedDir)) {
      throw new Error(`Directory does not exist: ${normalizedDir}`);
    }

    // Check for SINAPSE installation markers (use path.join for security)
    const hasSinapseCore = fs.existsSync(path.join(normalizedDir, '.sinapse-ai'));
    
    // If SINAPSE already installed, return immediately (highest priority)
    if (hasSinapseCore) {
      return 'EXISTING_SINAPSE';
    }

    // Check directory contents
    const dirContents = fs.readdirSync(normalizedDir);
    const isEmpty = dirContents.length === 0;
    
    // Empty directory = greenfield (second priority)
    if (isEmpty) {
      return 'GREENFIELD';
    }

    // Check for project markers (third priority)
    const hasPackageJson = fs.existsSync(path.join(normalizedDir, 'package.json'));
    const hasGit = fs.existsSync(path.join(normalizedDir, '.git'));
    
    // Existing project markers = brownfield
    if (hasPackageJson || hasGit) {
      return 'BROWNFIELD';
    }

    // Directory has files but no recognized markers = unknown
    return 'UNKNOWN';

  } catch (error) {
    // Log error with context for debugging
    console.error(`[detect-project-type] Error detecting project type in '${targetDir}': ${error.message}`);
    
    // Re-throw with more context for caller to handle
    throw new Error(`Failed to detect project type: ${error.message}`);
  }
}

module.exports = { detectProjectType };

