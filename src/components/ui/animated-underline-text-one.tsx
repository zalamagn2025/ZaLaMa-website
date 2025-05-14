import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  textClassName?: string;
  underlineClassName?: string;
  underlinePath?: string;
  underlineHoverPath?: string;
  underlineDuration?: number;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      textClassName,
      underlineClassName,
      underlinePath = "M 0,10 Q 75,0 150,10 Q 225,20 300,10",
      underlineHoverPath = "M 0,10 Q 75,20 150,10 Q 225,0 300,10",
      underlineDuration = 1.5,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      const currentRef = containerRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, []);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-2", props.className)}
      >
        <div
          className="relative"
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h1
            className={cn(
              "text-4xl font-bold text-center transform transition-all duration-500",
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
              textClassName
            )}
          >
            {text}
          </h1>
          <svg
            className={cn(
              "absolute bottom-0 left-0 w-full h-4 overflow-visible transition-all duration-300",
              underlineClassName
            )}
            viewBox="0 0 300 20"
            preserveAspectRatio="none"
          >
            <path
              d={isHovered ? underlineHoverPath : underlinePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{
                strokeDasharray: isVisible ? '1000' : '0',
                strokeDashoffset: isVisible ? '0' : '1000',
                transition: `stroke-dashoffset ${underlineDuration}s ease-in-out, d 0.3s ease-in-out`
              }}
            />
          </svg>
        </div>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
