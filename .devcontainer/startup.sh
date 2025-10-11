#!/bin/bash

# Ensure the config file exists by running a quick command
claude --version > /dev/null 2>&1

# Path to the internal config file
CONFIG_FILE="$HOME/.claude/claude.json"

# Use jq to set the flags to true if the file exists
if [ -f "$CONFIG_FILE" ]; then
  echo "Pre-accepting Claude Code dialogs..."
  jq '
    .hasTrustDialogHooksAccepted = true |
    .hasCompletedOnboarding = true
  ' "$CONFIG_FILE" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
  echo "Claude Code configuration updated successfully."
else
  echo "Claude Code config file not found at $CONFIG_FILE, skipping pre-acceptance."
fi