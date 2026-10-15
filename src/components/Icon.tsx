import { faGithub, faLinkedin, faPixiv, faReddit, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBrain, faEye, faEnvelope, faFileLines, faFlaskVial } from '@fortawesome/free-solid-svg-icons';

const icons = { youtube: faYoutube, github: faGithub, linkedin: faLinkedin, pixiv: faPixiv, reddit: faReddit, brain: faBrain, eye: faEye, email: faEnvelope, cv: faFileLines, flask: faFlaskVial };
export type IconName = keyof typeof icons;

// Labels stay on the surrounding links/cards; decorative icons are hidden from screen readers.
export default function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const [width, height, , , paths] = icons[name].icon;
  return <svg className={`site-icon ${className}`} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false" fill="currentColor">
    {(Array.isArray(paths) ? paths : [paths]).map((path, i) => <path key={i} d={path}/>)}
  </svg>;
}
