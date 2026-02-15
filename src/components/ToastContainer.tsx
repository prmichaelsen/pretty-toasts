import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Toast as ToastType } from "../types";
import { Toast } from "./Toast";

interface AnimatedToast extends ToastType {
  isEntering?: boolean;
  isExiting?: boolean;
  animationKey?: string;
  yPosition?: number;
  height?: number;
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemoveToast: (id: string) => void;
  isDesktop?: boolean;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
  isDesktop = true,
}) => {
  const [animatedToasts, setAnimatedToasts] = useState<AnimatedToast[]>([]);
  const toastRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Calculate Y positions for all toasts (excluding exiting toasts)
  const calculatePositions = useCallback((toastList: AnimatedToast[]) => {
    let currentY = 0;
    return toastList.map((toast) => {
      const element = toastRefs.current.get(toast.id);
      const height = element ? element.offsetHeight : 80; // fallback height

      // Only increment position for non-exiting toasts
      const yPosition = toast.isExiting ? toast.yPosition || 0 : currentY;
      if (!toast.isExiting) {
        currentY += height + 12; // 12px gap
      }

      return {
        ...toast,
        yPosition,
        height,
      };
    });
  }, []);

  // Sync with toasts and manage enter/exit animations
  useEffect(() => {
    setAnimatedToasts((current) => {
      const currentIds = new Set(current.map((t) => t.id));

      // Add new toasts with enter animation
      const newToasts = toasts
        .filter((t) => !currentIds.has(t.id))
        .map((t) => ({
          ...t,
          isEntering: true,
          isExiting: false,
          animationKey: `${t.id}-${Date.now()}`,
          yPosition: 0,
          height: 80,
        }));

      // Mark toasts for exit that are no longer in toasts, and update existing ones
      const updatedToasts = current.map((toast) => {
        const reduxToast = toasts.find((t) => t.id === toast.id);
        if (!reduxToast && !toast.isExiting) {
          return { ...toast, isExiting: true, isEntering: false };
        }
        if (reduxToast) {
          return { ...toast, ...reduxToast };
        }
        return toast;
      });

      // Calculate new positions for all toasts
      const allToasts = [...updatedToasts, ...newToasts];
      return calculatePositions(allToasts);
    });
  }, [toasts, calculatePositions]);

  // Update positions when toast heights change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedToasts((prev) => {
        // Measure actual heights and recalculate positions
        const measuredToasts = prev.map((toast) => {
          const element = toastRefs.current.get(toast.id);
          const height = element ? element.offsetHeight : toast.height || 80;
          return { ...toast, height };
        });

        return calculatePositions(
          measuredToasts.map((toast) =>
            toast.isEntering ? { ...toast, isEntering: false } : toast
          )
        );
      });
    }, 100); // Give time for DOM to update

    return () => clearTimeout(timer);
  }, [animatedToasts.filter((t) => t.isEntering).length, calculatePositions]);

  // Remove toasts after exit animation completes
  const handleToastExitComplete = useCallback(
    (toastId: string) => {
      setAnimatedToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== toastId);
        toastRefs.current.delete(toastId);
        return calculatePositions(filtered);
      });
    },
    [calculatePositions]
  );

  useEffect(() => {
    const exitingToasts = animatedToasts.filter((t) => t.isExiting);
    if (exitingToasts.length > 0) {
      const timer = setTimeout(() => {
        exitingToasts.forEach((toast) => handleToastExitComplete(toast.id));
      }, 300); // Corresponds to the animation duration
      return () => clearTimeout(timer);
    }
  }, [animatedToasts, handleToastExitComplete]);

  // Removed aggressive click-outside handler that was clearing all toasts
  // when clicking buttons to create new toasts. This was causing the stacking bug.
  // Users can still dismiss individual toasts by swiping or clicking the X button.

  if (!animatedToasts || animatedToasts.length === 0) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    zIndex: 50,
    width: isDesktop ? "33vw" : "calc(100% - 1rem)",
    left: isDesktop ? "auto" : "0.5rem",
    maxWidth: isDesktop ? "33vw" : "100%",
    pointerEvents: "none",
  };

  return (
    <div
      data-toast-container
      style={containerStyle}
      aria-live="polite"
      aria-label="Notifications"
    >
      <div style={{ position: 'relative', width: '100%', pointerEvents: "auto" }}>
        {animatedToasts.map((toast) => {
          const getTransform = () => {
            const yTransform = `translateY(-${toast.yPosition || 0}px)`;
            if (toast.isExiting) {
              return `${yTransform} translateX(100%) scale(0.95)`;
            } else if (toast.isEntering) {
              return `${yTransform} translateX(100%) scale(0.95)`;
            } else {
              return `${yTransform} translateX(0) scale(1)`;
            }
          };

          const getOpacity = () => {
            if (toast.isExiting || toast.isEntering) {
              return 0;
            }
            return 1;
          };

          return (
            <div
              key={toast.animationKey || toast.id}
              ref={(el) => {
                if (el) toastRefs.current.set(toast.id, el);
                else toastRefs.current.delete(toast.id);
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                transform: getTransform(),
                opacity: getOpacity(),
                transition:
                  "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Toast
                toast={toast}
                isExiting={toast.isExiting}
                onRemove={() => onRemoveToast(toast.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
