"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Egységes szekció-keret scroll-alapú belépő animációval. */
export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-[86rem] px-5 py-20 sm:px-8 ${className}`}
    >
      {(eyebrow || title || subtitle) && (
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-accent-2">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-4xl font-black leading-tight sm:text-5xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{subtitle}</p>
          )}
        </motion.header>
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
