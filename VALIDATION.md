# Support UI validation

The support update preserves sketch.js and its detector, camera, and Bluetooth behavior. README and help text describe the current protocol rather than the older introduction-page claim about automatic stop on face loss.

## Checks

- Real MediaPipe Tasks Vision 0.10.3 FaceLandmarker initialization and simulated camera stream.
- All 12 walkthrough steps at viewport widths 320, 360, 390, 430, 768, 844, and 1280: no page overflow; visible spotlights; panels inside the viewport without covering the spotlight.
- Chapter navigation, optional connection skip, Escape dismissal, focus restoration, and unchanged recognition state during walkthroughs.
- Contextual Bluetooth help and the linked AI Ponybot example URL.
- Existing 19-digit packet order with newline, Visible=0 packets, and stop-button transmission using a simulated Bluetooth characteristic.
- Actual recognition start and stop controls with the loaded detector and simulated camera.
- No uncaught browser errors. Mobile, landscape, desktop, and support-card screenshots inspected.

Run `node tests/browser.cjs` with Node.js, Playwright, and Microsoft Edge installed. `BROWSER_CHANNEL` can select another installed Playwright channel; `TEST_ARTIFACTS` selects the screenshot directory. Internet access is needed for the existing CDN scripts and model assets. Test-only module access is injected by Playwright, not shipped in the application.

## Limits

No physical micro:bit, AI Ponybot, or real person's face was used. Detector accuracy and the linked MakeCode project's hardware behavior were not measured. The introduction's older servo example is accompanied by object-detection instructions, so the support card uses the explicitly named AI Ponybot face-control example instead. Outgoing values in the existing data display are not delivery confirmations.
