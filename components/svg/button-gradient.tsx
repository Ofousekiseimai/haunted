export function ButtonGradient() {
  return (
    <svg className="block" width={0} height={0} aria-hidden="true">
      <defs>
        <linearGradient id="btn-left" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#6A0DAD" />
          <stop offset="100%" stopColor="#910479ff" />
        </linearGradient>
        <linearGradient id="btn-top" x1="100%" x2="0%" y1="50%" y2="50%">
          <stop offset="0%" stopColor="#6A0DAD" />
          <stop offset="100%" stopColor="#910479ff" />
        </linearGradient>
        <linearGradient id="btn-bottom" x1="100%" x2="0%" y1="50%" y2="50%">
          <stop offset="0%" stopColor="#6A0DAD" />
          <stop offset="100%" stopColor="#910479ff" />
        </linearGradient>
        <linearGradient id="btn-right" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#6A0DAD" />
          <stop offset="100%" stopColor="#910479ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
