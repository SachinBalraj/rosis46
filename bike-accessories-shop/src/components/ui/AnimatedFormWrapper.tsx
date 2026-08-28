import type { ReactNode } from "react";
import { Motorbike } from "lucide-react";

type AnimatedFormWrapperProps = {
  children: ReactNode;
  progress: number;
};

export function AnimatedFormWrapper({
  children,
  progress,
}: AnimatedFormWrapperProps) {
  return (
    <div className="relative mt-4 pt-6">
      <Motorbike
        aria-hidden="true"
        className="absolute -top-4 z-10 h-8 w-8 text-brand transition-all duration-500 ease-out"
        style={{ left: `calc(${progress}% - 16px)` }}
      />
      <div className="border-t border-gray-200 pt-6">{children}</div>
    </div>
  );
}