# Chrome Web Store Listing — PlayFaster

_Version-controlled copy. Plain text only — paste each field directly into the Developer Dashboard._

---

## Extension Details

**Name:** PlayFaster

**Short Description** (132 characters max):

```
Control video & audio speed from 0.1x to 64x — with keyboard shortcuts, scroll wheel, and an on-page speed overlay.
```

**Category:** Productivity

**Language:** English (United States)

---

## Detailed Description

_(Plain text — paste directly into the Description field)_

```
PlayFaster gives you complete control over media playback speed on any website — no arbitrary 2x limits.

WHAT'S NEW IN v2.0
• On-page speed overlay — activate with a keyboard shortcut and control speed without opening the popup
• Customizable keyboard shortcut to toggle the overlay
• Configurable small step (scroll) and large step (Shift+scroll)
• Configurable min and max speed limits
• Fully redesigned popup with cleaner, bolder controls

FEATURES
• Speed range: 0.1x to 64x playback
• Click the buttons to step speed up or down by your configured increment
• Scroll the mouse wheel over the popup to nudge speed
• Type any value directly into the speed display
• Keyboard overlay: activate with your shortcut, then scroll or use arrow keys to adjust
• Speed persists across tabs, pages, and browser restarts
• Works inside cross-origin iframes and embedded players (e-learning platforms, SCORM content)

PERFECT FOR
• Professionals grinding through mandatory training videos
• Students skimming familiar lecture material
• Podcast listeners pushing past the 2x cap
• Content creators reviewing their own footage
• Anyone who processes information better at a different speed

HOW TO USE

1. Click the extension icon on any video or audio page
2. Adjust speed using the buttons or scroll the mouse wheel
3. Or type any value directly (0.1 to 64)
4. Use the gear icon to set a keyboard shortcut for the on-page overlay
5. Your preference automatically saves across sessions

PRIVACY
• No data collection or tracking
• Settings stored locally only
• Open source and transparent
• No external servers or analytics

Take back control of your time. Never be limited by arbitrary speed restrictions again.

Works on any website with HTML5 video or audio.
```

---

## Privacy Policy

**URL:** https://playfaster.app/privacy.html

This extension does NOT:
• Collect any personal information
• Track your browsing activity
• Send data to external servers
• Access your browsing history
• Use analytics or telemetry

This extension DOES:
• Store your playback speed preference locally using Chrome's storage API
• Modify video and audio playback speed on pages you visit
• Access media elements (video/audio tags) on web pages

All data stays on your device. No information ever leaves your computer.

_Last updated: March 2026_

---

## Permissions Justification

| Permission | Reason |
|---|---|
| `storage` | Saves your playback speed preference and settings so they persist across browser sessions and page reloads |
| `scripting` | Injects the playback speed control into web pages and modifies video/audio elements |
| `webNavigation` | Detects when pages with video/audio content load so the speed preference is applied automatically |
| `host_permissions: <all_urls>` | activeTab cannot be used because the extension applies the saved speed at document_start, before any user gesture. Cross-origin iframes on training platforms require host permissions for every frame origin, which are unknown in advance |

---

## Single Purpose Description

This extension's single purpose is to provide enhanced playback speed control for video and audio elements on web pages, allowing users to watch and listen to content at their preferred speed.

---

## Tags / Keywords

video speed control
playback speed
video accelerator
fast forward
speed up videos
audio speed
youtube speed
video speed controller
playback rate
speed control
video player
faster playback
slow motion
training videos
educational videos

---

## Store Assets

### Screenshots (1280x800 or 640x400)

1. **Popup Interface** — Simple, intuitive speed controls — adjust by typing or using increment buttons
2. **YouTube Example** — Works seamlessly on YouTube and all major video platforms
3. **Speed Range** — Full range from 0.1x (slow motion) to 64x (ultra fast) playback
4. **Training Platform** — Perfect for e-learning and training videos
5. **Fine Control** — Mouse wheel support and precision increments for perfect speed tuning

### Promotional Tile — Small (440x280)

Headline: Control Your Speed
Subtext: 0.1x to 64x

### Promotional Tile — Marquee (1400x560)

Headline: Watch Smarter, Not Slower
Subtext: PlayFaster gives you complete control over video and audio speed on any website.

---

## Support Information

**Support Email:** info@playfaster.app
**Support URL:** https://github.com/whiteboard-works/play-faster/issues
**Homepage URL:** https://playfaster.app/

---

## Pre-Release Checklist

- [ ] Test on multiple platforms (YouTube, Vimeo, training sites)
- [ ] Prepare 3–5 high-quality screenshots showing the extension in action
- [ ] Verify icon quality at 16px, 48px, and 128px
- [ ] Be ready to respond to reviewer questions about permissions
- [ ] Consider creating a short demo video (optional)

---

## Version History

**Version 2.0.0**
• On-page speed overlay with keyboard shortcut activation
• Overlay buttons for step-back and step-forward speed control
• Fully redesigned popup — dark theme, bold speed circle, new icon
• Configurable keyboard shortcut, small/large step, min/max speed
• Scroll throttle for smoother trackpad experience
• New PlayFaster icon and branding

**Version 1.0.2**
• Build script and documentation updates
• Renamed package to playfaster.zip

**Version 1.0 — Initial Release**
• Playback speed control from 0.1x to 64x
• Fine-grained increment/decrement buttons (0.1x and 0.5x)
• Direct speed input with number field
• Mouse wheel support for quick adjustments
• Persistent speed preference across sessions
• Works on all video and audio platforms
