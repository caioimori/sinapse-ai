/**
 * @fileoverview Merge strategy for Markdown files with SINAPSE-MANAGED sections
 * @module merger/strategies/markdown-merger
 */

const { BaseMerger } = require('./base-merger.js');
const { createMergeResult, createEmptyStats } = require('../types.js');
const { parseMarkdownSections, hasSinapseMarkers } = require('../parsers/markdown-section-parser.js');

/**
 * Merge strategy for Markdown files (CLAUDE.md, rules.md).
 * Uses SINAPSE-MANAGED markers to identify sections that can be updated.
 * Preserves user sections that don't have markers.
 * @extends BaseMerger
 */
class MarkdownMerger extends BaseMerger {
  name = 'markdown';

  /**
   * Can merge if existing content has SINAPSE markers
   * @param {string} existingContent - Existing markdown content
   * @returns {boolean} True if merge is possible
   */
  canMerge(existingContent) {
    return hasSinapseMarkers(existingContent);
  }

  /**
   * Merge existing markdown with template
   * - Updates SINAPSE-MANAGED sections with new content
   * - Preserves user sections (without markers)
   * - Adds new SINAPSE sections at the end
   * @param {string} existingContent - Existing markdown content
   * @param {string} newContent - Template markdown content
   * @param {import('../types.js').MergeOptions} [options] - Merge options
   * @returns {Promise<import('../types.js').MergeResult>} Merge result
   */
  async merge(existingContent, newContent, options = {}) {
    const existing = parseMarkdownSections(existingContent);
    const template = parseMarkdownSections(newContent);

    // If existing file has no SINAPSE markers, do legacy migration
    if (!existing.hasSinapseMarkers) {
      return this.migrateLegacy(existingContent, template, options);
    }

    const stats = createEmptyStats();
    const changes = [];
    const processedSinapseSections = new Set();

    // Start building merged content
    let merged = '';

    // Add preamble if exists
    if (existing.preamble.length > 0) {
      merged += existing.preamble.join('\n');
      if (!merged.endsWith('\n')) {
        merged += '\n';
      }
    }

    // Process each section from existing file
    for (const section of existing.sections) {
      if (section.managed) {
        // SINAPSE-managed section - update with template content if available
        const templateSection = template.sections.find(
          s => s.managed && s.id === section.id,
        );

        if (templateSection) {
          // Update with new content from template
          merged += `<!-- SINAPSE-MANAGED-START: ${section.id} -->\n`;
          merged += templateSection.lines.join('\n');
          if (!merged.endsWith('\n')) {
            merged += '\n';
          }
          merged += `<!-- SINAPSE-MANAGED-END: ${section.id} -->\n\n`;
          processedSinapseSections.add(section.id);
          changes.push({
            type: 'updated',
            identifier: section.id,
          });
          stats.updated++;
        } else {
          // Section not in template anymore - keep existing
          merged += `<!-- SINAPSE-MANAGED-START: ${section.id} -->\n`;
          merged += section.lines.join('\n');
          if (!merged.endsWith('\n')) {
            merged += '\n';
          }
          merged += `<!-- SINAPSE-MANAGED-END: ${section.id} -->\n\n`;
          changes.push({
            type: 'preserved',
            identifier: section.id,
            reason: 'section not in template (possibly deprecated)',
          });
          stats.preserved++;
        }
      } else {
        // User section - preserve as-is
        merged += section.lines.join('\n');
        if (!merged.endsWith('\n')) {
          merged += '\n';
        }
        merged += '\n';
        changes.push({
          type: 'preserved',
          identifier: section.id || section.title || 'unnamed-section',
        });
        stats.preserved++;
      }
    }

    // Add new SINAPSE sections that don't exist in current file
    const newSections = template.sections.filter(
      s => s.managed && !processedSinapseSections.has(s.id),
    );

    if (newSections.length > 0) {
      merged += '---\n\n';
      merged += '<!-- New SINAPSE sections added -->\n\n';

      for (const section of newSections) {
        merged += `<!-- SINAPSE-MANAGED-START: ${section.id} -->\n`;
        merged += section.lines.join('\n');
        if (!merged.endsWith('\n')) {
          merged += '\n';
        }
        merged += `<!-- SINAPSE-MANAGED-END: ${section.id} -->\n\n`;
        changes.push({
          type: 'added',
          identifier: section.id,
        });
        stats.added++;
      }
    }

    // Clean up excessive newlines
    merged = merged.replace(/\n{4,}/g, '\n\n\n').trim() + '\n';

    return createMergeResult(merged, stats, changes);
  }

  /**
   * Migrate a legacy file (without SINAPSE markers) by appending SINAPSE sections
   * @param {string} existingContent - Existing content without markers
   * @param {import('../parsers/markdown-section-parser.js').ParsedMarkdownFile} template - Parsed template
   * @param {import('../types.js').MergeOptions} [options] - Merge options
   * @returns {Promise<import('../types.js').MergeResult>} Merge result with legacy flag
   */
  async migrateLegacy(existingContent, template, _options = {}) {
    const stats = createEmptyStats();
    const changes = [];

    // Get all SINAPSE-managed sections from template
    const sinapseSections = template.sections.filter(s => s.managed);

    // Start with existing content
    let merged = existingContent;
    if (!merged.endsWith('\n')) {
      merged += '\n';
    }

    // Mark existing content as preserved
    changes.push({
      type: 'preserved',
      identifier: 'existing-content',
      reason: 'legacy file - all content preserved',
    });
    stats.preserved = 1;

    // Add separator and SINAPSE sections
    if (sinapseSections.length > 0) {
      merged += '\n---\n\n';
      merged += '<!-- SINAPSE-MANAGED SECTIONS -->\n';
      merged += '<!-- These sections are managed by SINAPSE. Edit content between markers carefully. -->\n';
      merged += '<!-- Your custom content above will be preserved during updates. -->\n\n';

      for (const section of sinapseSections) {
        merged += `<!-- SINAPSE-MANAGED-START: ${section.id} -->\n`;
        merged += section.lines.join('\n');
        if (!merged.endsWith('\n')) {
          merged += '\n';
        }
        merged += `<!-- SINAPSE-MANAGED-END: ${section.id} -->\n\n`;
        changes.push({
          type: 'added',
          identifier: section.id,
        });
        stats.added++;
      }
    }

    const result = createMergeResult(merged.trim() + '\n', stats, changes);
    result.isLegacyMigration = true;
    return result;
  }

  /**
   * @returns {string} Description of this strategy
   */
  getDescription() {
    return 'Merges Markdown files using SINAPSE-MANAGED section markers';
  }
}

module.exports = { MarkdownMerger };
