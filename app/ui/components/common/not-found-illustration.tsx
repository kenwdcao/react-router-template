import classes from "./not-found-page.module.css";

export function NotFoundIllustration() {
  return (
    <svg
      aria-hidden="true"
      className={classes.illustration}
      viewBox="0 0 360 180"
    >
      <path
        className={classes.illustrationFloor}
        d="M42 144c38 16 235 16 276 0"
      />
      <rect
        className={classes.illustrationPanel}
        x="83"
        y="34"
        width="194"
        height="104"
        rx="14"
      />
      <path
        className={classes.illustrationGrid}
        d="M112 67h136M112 92h88M112 117h112"
      />
      <circle
        className={classes.illustrationDotPrimary}
        cx="112"
        cy="67"
        r="7"
      />
      <circle className={classes.illustrationDotMuted} cx="112" cy="92" r="7" />
      <circle
        className={classes.illustrationDotMuted}
        cx="112"
        cy="117"
        r="7"
      />
      <path
        className={classes.illustrationMagnifier}
        d="M244 118l34 34M224 99a31 31 0 1 0 0 .1"
      />
      <path
        className={classes.illustrationSpark}
        d="M58 58l10 10m0-10L58 68M300 47l8 8m0-8l-8 8"
      />
    </svg>
  );
}
