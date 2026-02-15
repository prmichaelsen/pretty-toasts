import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Toast as ToastType } from "../types";
import { useToastBackgroundStyle, useProgressBarStyle } from "../styles/helpers";

interface ToastProps {
  toast: ToastType;
  isExiting?: boolean;
  onRemove?: () => void;
  onMakePermanent?: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, isExiting, onRemove, onMakePermanent }) => {
  const removeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
          // Defer handleRemove to next tick to avoid setState during render warning
          setTimeout(() => handleRemove(), 0);
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

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnterWrapper = useCallback(() => {
    setIsHovered(true);
    handleMouseEnter();
  }, [handleMouseEnter]);

  const handleMouseLeaveWrapper = useCallback(() => {
    setIsHovered(false);
    handleMouseLeave();
  }, [handleMouseLeave]);

  const backgroundStyle = useToastBackgroundStyle(toast.type);
  const progressStyle = useProgressBarStyle(toast.type, progress);

  return (
    <div
      style={{
        transform: isExiting ? 'translateX(100%) scale(0.95)' : 'translateX(0) scale(1)',
        opacity: isExiting ? 0 : 1,
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          ...backgroundStyle,
          backdropFilter: 'blur(4px)',
          borderRadius: '0.5rem',
          padding: '1rem',
          boxShadow: isHovered
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          cursor: toast.isPermanent ? 'default' : isDragging ? 'grabbing' : 'grab',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(${swipeOffset}px) scale(${isHovered ? 1.05 : 1})`,
          opacity: Math.max(0.3, 1 - swipeOffset / 200),
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={handleMouseEnterWrapper}
        onMouseLeave={handleMouseLeaveWrapper}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        role="alert"
        aria-live="polite"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {toast.title && (
              <p style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '0.25rem',
              }}>
                {toast.title}
              </p>
            )}
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.625,
            }}>
              {toast.message}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            style={{
              flexShrink: 0,
              padding: '0.25rem',
              backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              borderRadius: '9999px',
              transition: 'background-color 200ms',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Dismiss notification"
          >
            <svg
              style={{ width: '1rem', height: '1rem', color: '#ffffff' }}
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
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}>
          <div style={progressStyle} />
        </div>
      </div>
    </div>
  );
};
