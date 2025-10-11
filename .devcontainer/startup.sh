#!/bin/bash

# Ensure the config file exists by running a quick command
claude --version > /dev/null 2>&1

# Path to the internal config file
CONFIG_FILE="$HOME/.claude.json"

# Use jq to set the flags to true if the file exists
if [ -f "$CONFIG_FILE" ]; then
  echo "Pre-accepting Claude Code dialogs..."
  
  # Start with setting the onboarding flag
  jq '.hasCompletedOnboarding = true' "$CONFIG_FILE" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
  
  # Extract and approve custom API key if present
  if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "Processing custom API key approval..."
    
    # Extract the suffix (last 20 characters which includes the last 2 dash-separated segments)
    API_KEY_SUFFIX="${ANTHROPIC_API_KEY: -20}"
    
    if [ -n "$API_KEY_SUFFIX" ]; then
      echo "Adding API key suffix to approved list"
      
      # Initialize customApiKeyResponses structure if it doesn't exist, then add suffix to approved array
      jq --arg suffix "$API_KEY_SUFFIX" '
        .customApiKeyResponses = (.customApiKeyResponses // {}) |
        .customApiKeyResponses.approved = (.customApiKeyResponses.approved // []) |
        .customApiKeyResponses.rejected = (.customApiKeyResponses.rejected // []) |
        if (.customApiKeyResponses.approved | index($suffix)) == null then
          .customApiKeyResponses.approved += [$suffix]
        else
          .
        end
      ' "$CONFIG_FILE" > "${CONFIG_FILE}.tmp" && mv "${CONFIG_FILE}.tmp" "$CONFIG_FILE"
      
      echo "API key suffix approved successfully."
    else
      echo "Warning: Could not extract API key suffix."
    fi
  else
    echo "ANTHROPIC_API_KEY not set, skipping custom API key approval."
  fi
  
  echo "Claude Code configuration updated successfully."
else
  echo "Claude Code config file not found at $CONFIG_FILE, skipping pre-acceptance."
fi