import React from "react";
import styles from "./Text.module.css";

export interface TextProps {
  alignment?: "center" | "left" | "right";
  variant?: "normal" | "light" | "bold";
  className?: string;
  color?: string;
  required?: boolean;
}

export const Text: React.FunctionComponent<TextProps> = ({ alignment = "left", variant = "normal", className, color, required = false, children }) => {
  return (
      <span
          className={className}
          color={color ?? ''}
          style={{
              textAlign: alignment,
              opacity: variant === 'light' ? 0.6 : 1,
              fontWeight: variant === 'bold' ? 'bold' : 'regular',
          }}
      >
          {children}
          {required && <span className={styles.requiredField}> *</span>}
      </span>
  );
};
