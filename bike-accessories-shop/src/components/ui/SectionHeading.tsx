import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  eyebrowClassName?: string;
  title: string;
  titleClassName?: string;
  rainbowTitle?: boolean;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  eyebrowClassName,
  title,
  titleClassName,
  rainbowTitle = true,
  description,
  align = "left",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow", eyebrowClassName)}>{eyebrow}</p>
      ) : (
        <span aria-hidden="true" className="h-2 w-2 bg-brand" />
      )}
      <h2
        className={cn(
          "display-heading max-w-3xl text-4xl sm:text-5xl lg:text-6xl",
          rainbowTitle && "text-rainbow",
          titleClassName ?? (light ? "text-white" : "text-foreground")
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed",
            align === "center" && "mx-auto",
            light ? "text-smoke" : "text-smoke"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
