/**
 * @fileoverview Parser for Markdown files with SINAPSE-MANAGED sections
 * @module merger/parsers/markdown-section-parser
 */

// Regex patterns for SINAPSE markers
const SINAPSE_START_MARKER = /^<!--\s*SINAPSE-MANAGED-START:\s*([a-zA-Z0-9_-]+)\s*-->$/;
const SINAPSE_END_MARKER = /^<!--\s*SINAPSE-MANAGED-END:\s*([a-zA-Z0-9_-]+)\s*-->$/;
const HEADER_PATTERN = /^(#{1,6})\s+(.+)$/;

/**
 * Parsed section from markdown
 * @typedef {Object} ParsedSection
 * @property {string} id - Section identifier (slug or marker id)
 * @property {string} [title] - Section title (from header)
 * @property {number} [level] - Header level (1-6)
 * @property {number} startLine - Start line number (0-indexed)
 * @property {number} [endLine] - End line number (0-indexed)
 * @property {boolean} managed - True if SINAPSE-MANAGED section
 * @property {string[]} lines - Lines in this section (excluding markers)
 */

/**
 * Result of parsing a markdown file
 * @typedef {Object} ParsedMarkdownFile
 * @property {ParsedSection[]} sections - All sections found
 * @property {boolean} hasSinapseMarkers - True if file has SINAPSE-MANAGED markers
 * @property {string[]} preamble - Lines before first section
 * @property {string[]} rawLines - Original lines
 */

/**
 * Convert a string to a URL-friendly slug
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Parse a markdown file, identifying sections and SINAPSE-MANAGED areas
 * @param {string} content - Markdown content
 * @returns {ParsedMarkdownFile} Parsed result
 */
function parseMarkdownSections(content) {
  if (!content || content.trim() === '') {
    return {
      sections: [],
      hasSinapseMarkers: false,
      preamble: [],
      rawLines: [],
    };
  }

  const lines = content.split('\n');
  const result = {
    sections: [],
    hasSinapseMarkers: false,
    preamble: [],
    rawLines: lines,
  };

  let currentSection = null;
  let sinapseSection = null;
  let inPreamble = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for SINAPSE start marker
    const startMatch = trimmed.match(SINAPSE_START_MARKER);
    if (startMatch) {
      // Close any current non-managed section
      if (currentSection && !currentSection.managed) {
        currentSection.endLine = i - 1;
        result.sections.push(currentSection);
        currentSection = null;
      }

      // Start new SINAPSE-managed section
      sinapseSection = {
        id: startMatch[1],
        startLine: i,
        managed: true,
        lines: [],
      };
      result.hasSinapseMarkers = true;
      inPreamble = false;
      continue;
    }

    // Check for SINAPSE end marker
    const endMatch = trimmed.match(SINAPSE_END_MARKER);
    if (endMatch && sinapseSection) {
      if (endMatch[1] === sinapseSection.id) {
        sinapseSection.endLine = i;
        result.sections.push(sinapseSection);
        sinapseSection = null;
      }
      continue;
    }

    // If we're in an SINAPSE section, collect lines
    if (sinapseSection) {
      sinapseSection.lines.push(line);
      continue;
    }

    // Check for regular header
    const headerMatch = line.match(HEADER_PATTERN);
    if (headerMatch) {
      // Close any current section
      if (currentSection) {
        currentSection.endLine = i - 1;
        result.sections.push(currentSection);
      }

      // Start new section
      currentSection = {
        id: slugify(headerMatch[2]),
        title: headerMatch[2],
        level: headerMatch[1].length,
        startLine: i,
        managed: false,
        lines: [line],
      };
      inPreamble = false;
      continue;
    }

    // Regular content line
    if (inPreamble) {
      result.preamble.push(line);
    } else if (currentSection) {
      currentSection.lines.push(line);
    } else if (!sinapseSection) {
      // Content after an SINAPSE section but before next section
      // This shouldn't happen in well-formed files, but handle it
      result.preamble.push(line);
    }
  }

  // Close final section if open
  if (currentSection) {
    currentSection.endLine = lines.length - 1;
    result.sections.push(currentSection);
  }

  // Handle unclosed SINAPSE section (malformed)
  if (sinapseSection) {
    sinapseSection.endLine = lines.length - 1;
    sinapseSection.lines.push('<!-- WARNING: Unclosed SINAPSE-MANAGED section -->');
    result.sections.push(sinapseSection);
  }

  return result;
}

/**
 * Check if content has SINAPSE-MANAGED markers
 * @param {string} content - Markdown content
 * @returns {boolean} True if markers found
 */
function hasSinapseMarkers(content) {
  if (!content) return false;
  // Check for both START and END markers
  const hasStart = /<!--\s*SINAPSE-MANAGED-START:\s*[a-zA-Z0-9_-]+\s*-->/.test(content);
  const hasEnd = /<!--\s*SINAPSE-MANAGED-END:\s*[a-zA-Z0-9_-]+\s*-->/.test(content);
  return hasStart && hasEnd;
}

/**
 * Get all SINAPSE section IDs from content
 * @param {string} content - Markdown content
 * @returns {string[]} Array of section IDs
 */
function getSinapseSectionIds(content) {
  const ids = [];
  const matches = content.matchAll(/<!--\s*SINAPSE-MANAGED-START:\s*([a-zA-Z0-9_-]+)\s*-->/g);
  for (const match of matches) {
    ids.push(match[1]);
  }
  return ids;
}

module.exports = {
  slugify,
  parseMarkdownSections,
  hasSinapseMarkers,
  getSinapseSectionIds,
};

