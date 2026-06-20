'use client';

export interface DataProgressProps {
  currentStep: number;
  message: string;
  progress: number;
  step: string;
  totalSteps: number;
}

export function DataProgress({
  step,
  message,
  progress,
  currentStep,
  totalSteps,
}: DataProgressProps) {
  // Don't show the progress bar if the analysis is complete
  if (currentStep === totalSteps) {
    return null;
  }

  return (
    <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
        <span className="font-medium text-blue-400">
          Step {currentStep}/{totalSteps}: {step}
        </span>
      </div>
      <p className="mb-2 text-blue-300/80">{message}</p>
      <div className="h-2 w-full rounded-full bg-blue-500/20">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-1 text-right text-blue-400/60 text-xs">{progress}%</p>
    </div>
  );
}
