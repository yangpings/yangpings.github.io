import { useEffect, useState } from 'react';

// How long a closed popup keeps its content. It must outlast the longest exit in styles.css (460ms).
const EXIT_MS = 480;

// A popup's value stays available for a moment after it is cleared, so its content is still there
// to animate out. Then it goes, which also stops anything running inside (audio, games).
export default function useLingering<T>(value: T | undefined) {
  const [last, setLast] = useState(value);
  useEffect(() => {
    if (value !== undefined) { setLast(value); return; }
    const timer = window.setTimeout(() => setLast(undefined), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [value]);
  return value ?? last;
}
