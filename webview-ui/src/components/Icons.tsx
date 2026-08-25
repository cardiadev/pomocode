import type { SVGProps, ReactElement } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function TomatoIcon({ size = 18, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Tomato red-orange body */}
      <circle cx="12" cy="14" r="7.5" fill="#f43f5e" />
      {/* Subtle tomato highlight */}
      <path
        d="M7 12c-.5.8-.7 1.8-.4 2.6"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      {/* White clock face */}
      <circle cx="12" cy="14" r="4.5" fill="#ffffff" />
      {/* Clock hands pointing to 12 and 5 (25 min focus) */}
      <path
        d="M12 14v-2.8M12 14l1.9 1.9"
        stroke="#e11d48"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14" r="0.9" fill="#be123c" />
      {/* Green stem & leaves */}
      <path
        d="M12 6.5c0-1.5 1-2.5 2-3"
        stroke="#16a34a"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M12 6.5c-1.8-.4-3.5 0-4.5.8 1.1.2 2.7 0 4.5-.8zm0 0c1.8-.4 3.5 0 4.5.8-1.1.2-2.7 0-4.5-.8z"
        fill="#22c55e"
      />
    </svg>
  );
}

export function FlameIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 23c-4.418 0-8-3.582-8-8 0-3.375 2.1-6.425 4.5-8.5.347-.303.882-.047.882.417 0 1.25.7 2.583 1.618 3.083.473.257 1.05-.098 1.05-.636 0-2.364 1.76-6.364 4.45-8.864.38-.354.985-.097 1.015.417C17.75 5.5 20 9.25 20 15c0 4.418-3.582 8-8 8zm0-4c2.21 0 4-1.79 4-4 0-1.5-.75-2.75-2-3.5-.35-.2-.78.05-.78.46 0 1.04-.6 1.79-1.22 2.04-.38.15-.75-.12-.75-.5 0-1.5-.75-2.5-1.5-3-.3-.2-.72 0-.72.35 0 1.5-.5 2.65-1.03 3.15C8.42 14.5 8 15.2 8 16c0 2.21 1.79 4 4 4z" />
    </svg>
  );
}

export function CoffeeIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M4 19h16v2H4v-2zm14-14H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-2zm0 5v-3h2v3h-2z" />
    </svg>
  );
}

export function PalmIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M13.5 13.5c-.83 0-1.5.67-1.5 1.5v6c0 .55.45 1 1 1s1-.45 1-1v-6c0-.83-.67-1.5-1.5-1.5zm-1.5-4c0-2.21-1.79-4-4-4-.55 0-1 .45-1 1s.45 1 1 1c1.1 0 2 .9 2 2 0 .55.45 1 1 1s1-.45 1-1zm6-3c-2.21 0-4 1.79-4 4 0 .55.45 1 1 1s1-.45 1-1c0-1.1.9-2 2-2 .55 0 1-.45 1-1s-.45-1-1-1zm-6-4.5c0 .55.45 1 1 1 1.1 0 2 .9 2 2 0 .55.45 1 1 1s1-.45 1-1c0-2.21-1.79-4-4-4-.55 0-1 .45-1 1zm-4 4.5c.55 0 1-.45 1-1 0-2.21-1.79-4-4-4-.55 0-1 .45-1 1s.45 1 1 1c1.1 0 2 .9 2 2 0 .55.45 1 1 1z" />
    </svg>
  );
}

export function TrophyIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H8v2h8v-2h-3v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

export function StarIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function BoltIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.9 17.06 11 21 11 21z" />
    </svg>
  );
}

export function TargetIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

export function MedalIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  );
}

export function PaletteIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.18 19.34 10.54 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

export function WarningIcon({ size = 24, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="#f59e0b" />
    </svg>
  );
}

export function PlayIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
    </svg>
  );
}

export function PauseIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z" />
    </svg>
  );
}

export function SkipIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1s1-.45 1-1V8c0-.55-.45-1-1-1z" />
    </svg>
  );
}

export function ResetIcon({ size = 16, className, ...props }: IconProps): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 5V2.21c0-.45-.54-.67-.85-.35l-3.8 3.79c-.2.2-.2.51 0 .71l3.79 3.79c.32.31.86.09.86-.36V6.5c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8-.22.41-.11.93.25 1.22.42.34 1.01.24 1.28-.21.62-1.07.97-2.31.97-3.63 0-4.42-3.58-8-8-8zm-6.2 4.67c-.42-.34-1.01-.24-1.28.21C3.9 10.95 3.55 12.19 3.55 13.5c0 4.42 3.58 8 8 8v2.79c0 .45.54.67.85.35l3.79-3.79c.2-.2.2-.51 0-.71l-3.79-3.79c-.31-.31-.85-.09-.85.36V20.5c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8.22-.41.11-.93-.25-1.23z" />
    </svg>
  );
}
