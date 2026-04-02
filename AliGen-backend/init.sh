#!/bin/bash
set -e

# Install Rhubarb (lip-sync) into ./bin.
# FFmpeg should be installed by the platform (e.g. Railway Nixpacks package `ffmpeg`),
# so this script only handles Rhubarb.
INSTALL_DIR="./bin"
mkdir -p "$INSTALL_DIR"

# Install Rhubarb v1.13.0
echo "Installing Rhubarb v1.13.0..."

RHUBARB_URL="https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.13.0/Rhubarb-Lip-Sync-1.13.0-Linux.zip"
RHUBARB_ZIP="Rhubarb-Lip-Sync-1.13.0-Linux.zip"

# Download Rhubarb .zip file
curl -L $RHUBARB_URL -o $RHUBARB_ZIP

# Unzip and install Rhubarb
if [ -f $RHUBARB_ZIP ]; then
  unzip -o $RHUBARB_ZIP -d $INSTALL_DIR
  rm $RHUBARB_ZIP
else
  echo "Error: Failed to download Rhubarb ZIP file."
  exit 1
fi

chmod +x "$INSTALL_DIR/Rhubarb-Lip-Sync-1.13.0-Linux/rhubarb" || true
echo "Rhubarb v1.13.0 installed successfully at $INSTALL_DIR/Rhubarb-Lip-Sync-1.13.0-Linux/rhubarb"