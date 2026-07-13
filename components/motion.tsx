"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

// ── Reusable primitives ────────────────────────────────────────────────────

export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.34, 1.4, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  delay = 0,
  from = "bottom",
  className,
}: {
  children: ReactNode;
  delay?: number;
  from?: "bottom" | "left" | "right";
  className?: string;
}) {
  const initial =
    from === "left"
      ? { opacity: 0, x: -32 }
      : from === "right"
      ? { opacity: 0, x: 32 }
      : { opacity: 0, y: 32 };

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger list ───────────────────────────────────────────────────────────

export function StaggerList({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.07, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Page-level step transition (booking flow) ──────────────────────────────

export function StepTransition({
  children,
  stepKey,
}: {
  children: ReactNode;
  stepKey: string | number;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Hover card lift ────────────────────────────────────────────────────────

export function HoverCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}

// ── Konfirmasi entrance (success page) ────────────────────────────────────

export function ConfirmationEntrance({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ConfirmationStagger({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ConfirmationItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      }}
    >
      {children}
    </motion.div>
  );
}
