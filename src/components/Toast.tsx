import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Toast as ToastType } from "../types";

interface ToastProps {
  toast: ToastType;
  isExiting?: boolean;
  onRemove?: () => void;
  onMakePermanent?: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, isExiting, onRemove, onMakePermanent }) => {
  const removeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(toast.progress || 0);
  const [isPaused, setIsPaused] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [_mouseDownTime, setMouseDownTime] = useState(0);
  const [_hasMoved, setHasMoved] = useState(false);

  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove();
    }
  }, [onRemove]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setIsDragging(true);
    setIsPaused(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const deltaX = currentX - startX;

      if (deltaX > 0) {
        setSwipeOffset(deltaX);
      }
    },
    [isDragging, startX]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);

    if (swipeOffset > 100) {
      handleRemove();
    } else {
      setSwipeOffset(0);
    }
  }, [isDragging, swipeOffset, handleRemove]);

  // Mouse drag handlers for desktop
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setStartX(e.clientX);
      setMouseDownTime(Date.now());
      setHasMoved(false);
      setIsDragging(false);

      // Immediately pause on mouse down (click to pause)
      if (!toast.isPermanent) {
        setIsPaused(true);
      }
    },
    [toast.isPermanent]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (e.buttons !== 1) return; // Only if left mouse button is pressed

      const currentX = e.clientX;
      const deltaX = currentX - startX;

      // Mark that mouse has moved
      if (Math.abs(deltaX) > 2) {
        setHasMoved(true);
      }

      // Only start dragging if moved more than 5px
      if (Math.abs(deltaX) > 5 && !isDragging) {
        setIsDragging(true);
        setIsPaused(true);
      }

      if (isDragging && deltaX > 0) {
        setSwipeOffset(deltaX);
      }
    },
    [isDragging, startX]
  );

  const handleMouseUp = useCallback(
    (_e: React.MouseEvent) => {
      if (isDragging) {
        setIsDragging(false);
        setIsPaused(false);

        if (swipeOffset > 100) {
          handleRemove();
        } else {
          setSwipeOffset(0);
        }
      }

      // Reset tracking variables
      setHasMoved(false);
      setMouseDownTime(0);
    },
    [isDragging, swipeOffset, handleRemove]
  );

  useEffect(() => {
    if (toast.progress !== undefined) {
      setProgress(toast.progress);
    }
  }, [toast.progress]);

  useEffect(() => {
    if (toast.isPermanent || isPaused || toast.progress !== undefined) return;

    const duration = toast.duration || 10000;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (duration / 100);
        if (newProgress >= 100) {
          clearInterval(interval);
          handleRemove();
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [toast.duration, toast.isPermanent, isPaused, handleRemove, toast.progress]);

  useEffect(() => {
    return () => {
      if (removeTimeoutRef.current) {
        clearTimeout(removeTimeoutRef.current);
      }
    };
  }, []);

  const getGradientClasses = () => {
    switch (toast.type) {
      case "success":
        return "bg-gradient-to-r from-purple-500/90 to-indigo-500/90";
      case "error":
        return "bg-gradient-to-r from-purple-500/90 to-rose-500/90";
      case "warning":
        return "bg-gradient-to-r from-amber-500/90 to-orange-500/90";
      case "info":
        return "bg-gradient-to-r from-blue-500/90 to-purple-500/90";
      default:
        return "bg-gradient-to-r from-blue-500/90 to-indigo-500/90";
    }
  };

  const getProgressGradientClasses = () => {
    switch (toast.type) {
      case "success":
        return "bg-gradient-to-r from-purple-400 to-indigo-400";
      case "error":
        return "bg-gradient-to-r from-purple-400 to-rose-400";
      case "warning":
        return "bg-gradient-to-r from-amber-400 to-orange-400";
      case "info":
        return "bg-gradient-to-r from-blue-400 to-purple-400";
      default:
        return "bg-gradient-to-r from-blue-400 to-indigo-400";
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${
          isExiting
            ? "translate-x-full opacity-0 scale-95"
            : "translate-x-0 opacity-100 scale-100"
        }
      `}
    >
      <div
        className={`
          ${getGradientClasses()}
          backdrop-blur-sm
          rounded-lg
          p-4
          shadow-lg
          ${toast.isPermanent ? "cursor-default" : "cursor-pointer"}
          transition-all
          duration-200
          hover:shadow-xl
          hover:scale-105
          w-full
          relative
          overflow-hidden
          ${isDragging ? "cursor-grabbing" : "cursor-grab"}
        `}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          opacity: Math.max(0.3, 1 - swipeOffset / 200),
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="text-sm font-semibold text-white mb-1">
                {toast.title}
              </p>
            )}
            <p className="text-sm text-white/90 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
            aria-label="Dismiss notification"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar fixed to bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div
            className={`h-full ${getProgressGradientClasses()} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
