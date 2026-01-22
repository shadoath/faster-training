# Playback Rate Unlocker

Chrome extension that bypasses playback speed limits on e-learning platforms (EasyLlama, Go1, etc.).

## Installation

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder

## Usage

1. Navigate to your e-learning course
2. Click the extension icon
3. Select your desired speed (2x, 2.5x, 3x, or 4x)

The speed persists across page loads.

## How It Works

The extension spoofs the `playbackRate` getter so platform checks always see ≤2x, while the actual playback runs at your selected speed. See [CLAUDE.md](CLAUDE.md) for technical details.
