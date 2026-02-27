## Packages
react-dropzone | Drag and drop file upload for the application form
framer-motion | Page transitions and smooth micro-interactions
date-fns | Date formatting for candidate application dates

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}

The backend API for POST /api/candidates expects `multipart/form-data`.
The frontend will use native `fetch` for this specific endpoint instead of a JSON wrapper to allow the browser to set the correct multipart boundary headers automatically.
