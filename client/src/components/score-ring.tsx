interface ScoreRingProps {
  score: number | null | undefined;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, size = 48, strokeWidth = 4 }: ScoreRingProps) {
  const displayScore = score ?? 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  let colorClass = "text-slate-300 dark:text-slate-700";
  if (displayScore >= 80) colorClass = "text-emerald-500";
  else if (displayScore >= 60) colorClass = "text-primary";
  else if (displayScore > 0) colorClass = "text-rose-500";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-slate-100 dark:text-slate-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {displayScore > 0 && (
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {score === null || score === undefined ? (
          <span className="text-[10px] font-medium text-slate-400">--</span>
        ) : (
          <span className="text-xs font-bold text-foreground">{displayScore}</span>
        )}
      </div>
    </div>
  );
}
