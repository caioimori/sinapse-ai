// File: common/utils/status-mapper.js

/**
 * Status Mapper - Bidirectional status mapping between SINAPSE and ClickUp
 *
 * This module provides utilities for:
 * - Mapping SINAPSE story statuses to ClickUp custom field values
 * - Mapping ClickUp story-status values back to SINAPSE statuses
 * - Handling ClickUp-specific statuses (e.g., "Ready for Dev")
 *
 * CRITICAL: Stories use ClickUp custom field "story-status", NOT native status.
 * Epics use the native ClickUp status field (Planning, In Progress, Done).
 */

const STATUS_MAPPING = {
  SINAPSE_TO_CLICKUP: {
    'Draft': 'Draft',
    'Ready for Review': 'Ready for Review',
    'Review': 'Review',
    'In Progress': 'In Progress',
    'Done': 'Done',
    'Blocked': 'Blocked',
  },
  CLICKUP_TO_SINAPSE: {
    'Draft': 'Draft',
    'Ready for Dev': 'Ready for Review',  // ClickUp-specific status
    'Ready for Review': 'Ready for Review',
    'Review': 'Review',
    'In Progress': 'In Progress',
    'Done': 'Done',
    'Blocked': 'Blocked',
  },
};

/**
 * Maps an SINAPSE story status to ClickUp story-status custom field value
 *
 * @param {string} sinapseStatus - Local .md file status
 * @returns {string} ClickUp story-status value
 */
function mapStatusToClickUp(sinapseStatus) {
  const mapped = STATUS_MAPPING.SINAPSE_TO_CLICKUP[sinapseStatus];

  if (!mapped) {
    console.warn(`Unknown SINAPSE status: ${sinapseStatus}, using as-is`);
    return sinapseStatus;
  }

  return mapped;
}

/**
 * Maps a ClickUp story-status custom field value to SINAPSE story status
 *
 * @param {string} clickupStatus - ClickUp story-status value
 * @returns {string} Local .md file status
 */
function mapStatusFromClickUp(clickupStatus) {
  const mapped = STATUS_MAPPING.CLICKUP_TO_SINAPSE[clickupStatus];

  if (!mapped) {
    console.warn(`Unknown ClickUp status: ${clickupStatus}, using as-is`);
    return clickupStatus;
  }

  return mapped;
}

/**
 * Validates if a status is a valid SINAPSE story status
 *
 * @param {string} status - Status to validate
 * @returns {boolean} True if valid
 */
function isValidSINAPSEStatus(status) {
  return Object.keys(STATUS_MAPPING.SINAPSE_TO_CLICKUP).includes(status);
}

/**
 * Validates if a status is a valid ClickUp story-status value
 *
 * @param {string} status - Status to validate
 * @returns {boolean} True if valid
 */
function isValidClickUpStatus(status) {
  return Object.keys(STATUS_MAPPING.CLICKUP_TO_SINAPSE).includes(status);
}

/**
 * Gets all valid SINAPSE story statuses
 *
 * @returns {string[]} Array of valid statuses
 */
function getValidSINAPSEStatuses() {
  return Object.keys(STATUS_MAPPING.SINAPSE_TO_CLICKUP);
}

/**
 * Gets all valid ClickUp story-status values
 *
 * @returns {string[]} Array of valid statuses
 */
function getValidClickUpStatuses() {
  return Object.keys(STATUS_MAPPING.CLICKUP_TO_SINAPSE);
}

module.exports = {
  mapStatusToClickUp,
  mapStatusFromClickUp,
  isValidSINAPSEStatus,
  isValidClickUpStatus,
  getValidSINAPSEStatuses,
  getValidClickUpStatuses,
  STATUS_MAPPING, // Export for testing
};
