import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExpandableTextProps {
  children: React.ReactNode;
  /** Number of lines to clamp on mobile before showing "read more" */
  mobileLines?: number;
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
}

/**
 * Wraps content with a line-clamp + show more/less toggle.
 * Only active on mobile — desktop renders children fully.
 */
const ExpandableText = ({
  children,
  mobileLines = 5,
  className = "",
  moreLabel = "קראו עוד",
  lessLabel = "הצג פחות",
}: ExpandableTextProps) => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile) {
      setNeedsClamp(false);
      return;
    }
    const el = ref.current;
    if (!el) return;
    // Measure full content height vs clamped height
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || "20");
    const maxClampedHeight = lineHeight * mobileLines + 2;
    setNeedsClamp(el.scrollHeight > maxClampedHeight);
  }, [isMobile, mobileLines, children]);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  const clampStyle: React.CSSProperties =
    needsClamp && !expanded
      ? {
          display: "-webkit-box",
          WebkitLineClamp: mobileLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : {};

  return (
    <div className={className}>
      <div ref={ref} style={clampStyle}>
        {children}
      </div>
      {needsClamp && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-primary text-xs font-medium hover:text-[hsl(var(--primary-glow))] transition-colors"
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
