/**
 * MCP Command Module
 *
 * Entry point for all MCP-related CLI commands.
 * Provides global MCP configuration management.
 *
 * @module cli/commands/mcp
 * @version 1.0.0
 * @story 2.11 - MCP System Global
 */

const { Command } = require('commander');
const { createSetupCommand } = require('./setup');
const { createLinkCommand } = require('./link');
const { createStatusCommand } = require('./status');
const { createAddCommand } = require('./add');

/**
 * Create the mcp command with all subcommands
 * @returns {Command} Commander command instance
 */
function createMcpCommand() {
  const mcp = new Command('mcp');

  mcp
    .description('Manage global MCP (Model Context Protocol) configuration')
    .addHelpText('after', `
Commands:
  setup             Create global ~/.sinapse/mcp/ structure
  link              Link project to global MCP config
  status            Show global/project MCP config status
  add <server>      Add server to global config

Global Configuration:
  MCP servers are configured once at ~/.sinapse/mcp/ and shared across
  all projects via symlinks (Unix) or junctions (Windows).

Benefits:
  - Configure MCP servers once, use everywhere
  - No duplicate configurations across projects
  - Easy maintenance and updates
  - Consistent MCP setup across workspaces

Quick Start:
  $ sinapse mcp setup --with-defaults    # Create global config
  $ sinapse mcp link                      # Link this project
  $ sinapse mcp status                    # Check configuration

Examples:
  $ sinapse mcp setup
  $ sinapse mcp setup --with-defaults
  $ sinapse mcp setup --servers context7,exa,github
  $ sinapse mcp link
  $ sinapse mcp link --migrate
  $ sinapse mcp link --merge
  $ sinapse mcp link --unlink
  $ sinapse mcp status
  $ sinapse mcp status --json
  $ sinapse mcp add context7
  $ sinapse mcp add myserver --type sse --url https://example.com/mcp
  $ sinapse mcp add myserver --remove
  $ sinapse mcp add --list-templates
`);

  // Add subcommands
  mcp.addCommand(createSetupCommand());
  mcp.addCommand(createLinkCommand());
  mcp.addCommand(createStatusCommand());
  mcp.addCommand(createAddCommand());

  return mcp;
}

module.exports = {
  createMcpCommand,
};
