import type { ReactNode } from "react";
import styles from "./StatCard.module.css";

type StatCardProps = {
  label: string;
  value: string | number;
  badge?: string;
  badgeTone?: "success" | "neutral";
  icon?: ReactNode;
  sub?: string;
};

export default function StatCard({
  label,
  value,
  badge,
  badgeTone = "success",
  icon,
  sub,
}: StatCardProps) {
  const showHeader = Boolean(icon || badge);

  return (
    <div className={styles.card}>
      {showHeader ? (
        <div className={styles.header}>
          {icon ? (
            <span className={styles.icon} aria-hidden>
              {icon}
            </span>
          ) : (
            <span />
          )}
          {badge ? (
            <span
              className={`${styles.badge} ${
                badgeTone === "neutral" ? styles.badgeNeutral : ""
              }`}
            >
              {badge}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className={styles.label}>{label}</div>
      <div className={`${styles.value} ${sub ? styles.valueSmall : ""}`}>
        {value}
      </div>
      {sub ? <div className={styles.sub}>{sub}</div> : null}
    </div>
  );
}
