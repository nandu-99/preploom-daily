"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type SubmissionNoticeProps = {
  status: "idle" | "sending" | "success" | "error";
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
  onDismiss: () => void;
};

const noticeDuration = 120_000;

export function SubmissionNotice({
  status,
  successTitle,
  successMessage,
  errorTitle,
  errorMessage,
  onDismiss,
}: SubmissionNoticeProps) {
  const noticeRef = useRef<HTMLDivElement>(null);
  const onDismissRef = useRef(onDismiss);
  const reduceMotion = useReducedMotion();
  const isVisible = status === "success" || status === "error";
  const isSuccess = status === "success";

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!isVisible || !noticeRef.current) return;

    noticeRef.current.focus({ preventScroll: true });
    noticeRef.current.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
    });

    const timeout = window.setTimeout(
      () => onDismissRef.current(),
      noticeDuration,
    );

    return () => window.clearTimeout(timeout);
  }, [isVisible, reduceMotion, status]);

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          ref={noticeRef}
          key={status}
          role={isSuccess ? "status" : "alert"}
          aria-live={isSuccess ? "polite" : "assertive"}
          tabIndex={-1}
          initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }
          }
          transition={{
            duration: reduceMotion ? 0 : 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="grid grid-cols-[44px_1fr] gap-4 rounded-[12px] border border-black/[0.14] bg-black/[0.035] p-4 text-[#151515] shadow-[0_12px_32px_rgba(0,0,0,0.06)] outline-none dark:border-white/[0.14] dark:bg-white/[0.055] dark:text-[#f3f3f1] dark:shadow-[0_14px_36px_rgba(0,0,0,0.22)] sm:p-5"
        >
          <motion.div
            initial={reduceMotion ? false : { scale: 0.55, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 360, damping: 19, delay: 0.08 }
            }
            className="flex size-11 items-center justify-center rounded-[10px] bg-[#151515] text-white dark:bg-[#ededeb] dark:text-[#151515]"
          >
            {isSuccess ? (
              <CircleCheck
                className="size-5"
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <CircleAlert
                className="size-5"
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </motion.div>

          <div className="pt-0.5">
            <p className="text-[14px] font-semibold tracking-[-0.015em] sm:text-[15px]">
              {isSuccess ? successTitle : errorTitle}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[#555] dark:text-[#b3b3b3] sm:text-[13px]">
              {isSuccess ? successMessage : errorMessage}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
