# Specification

## Summary
**Goal:** Build a mobile-first, cyberpunk/futuristic military-themed discipline tracker that logs dev and non-dev time, computes daily/weekly analytics, and persists all data locally.

**Planned changes:**
- Apply the specified global UI theme (exact color palette, fonts Orbitron/Rajdhani/Exo 2, ALL CAPS headings with expanded letter spacing, sharp console-like styling).
- Add an Initialize screen to capture Developer Path and Start Date (default today), persist initialization, and route into the app.
- Build a Main Dashboard showing day count (from start date), today’s date, a deterministic discipline status message, today’s dev progress indicator, daily-stable rotating quote, and navigation to all sections.
- Implement four Daily Dev Log screens (Morning/Afternoon/Evening/Night) with the specified fields, per-date/section persistence, and auto-save with saving/saved indicator.
- Show a Daily Summary after completing the Night log with computed totals/averages and the specified performance message.
- Implement a Reality Check page with dev vs non-dev totals, comparison bar, pie chart distribution, message logic, and a Non-Dev Activity logging form (multiple entries per day).
- Add Reality Analytics (last 7 days distraction hours, most common distraction, discipline score % with tier label, and the >4h warning message).
- Create a History screen to select a date and view that date’s dev/non-dev logs plus day number and dev hours.
- Create a Stats & Growth screen with totals, averages, streaks, weekly/monthly visualizations, and badge unlocks as specified.
- Persist locally: start date, developer path, all logs, streak/badge state, and computed aggregates as needed.
- Add in-app reminder UI that shows the correct daily reminder text based on local time (no external push services).
- Provide cohesive navigation across all screens suitable for mobile-first use.

**User-visible outcome:** Users can initialize DEV REBIRTH, log dev work across four daily sections, log non-dev distractions, see daily summaries and reality checks, review any past day in History, track progress in Stats & Growth, and have all data persist locally with a consistent cyberpunk console UI.
