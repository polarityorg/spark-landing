import React from "react";
import Link from "next/link";
import classNames from "classnames";

interface SparkButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SparkButton: React.FC<SparkButtonProps> = ({
  href,
  onClick,
  children,
  disabled = false,
  className = "",
  style,
}) => {
  const hasRoundedClass = (cls: string) => {
    return cls.split(" ").some((c) => c.startsWith("rounded"));
  };

  const includeDefaultRounded = !hasRoundedClass(className);

  const baseClassesWithoutRounded =
    "flex items-center justify-center gap-2 bg-[#0E3154] text-white font-bold text-sm sm:text-base md:text-lg px-8 sm:px-10 py-6 transition-colors duration-200 whitespace-nowrap w-full relative overflow-hidden border-2 border-black shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]";

  const baseClasses = includeDefaultRounded
    ? `${baseClassesWithoutRounded} rounded-lg`
    : baseClassesWithoutRounded;

  const disabledClasses = disabled
    ? "hover:bg-gray-400 cursor-not-allowed"
    : "hover:bg-[#1A4B7C]";

  const combinedClasses = classNames(baseClasses, disabledClasses, className);

  const content = children;

  const defaultStyle: React.CSSProperties = {
    border: "1px",
    borderImage: "linear-gradient(to bottom, #F9F9F9 12%, transparent 4%) 1",
    background:
      "linear-gradient(to bottom, #0E3154, #0E3154), linear-gradient(to bottom, #F9F9F9 12%, transparent 4%)",
    backgroundClip: "padding-box, border-box",
    backgroundOrigin: "padding-box, border-box",
    boxShadow: `
    0px 0px 0px 1px #0C0D0F,
    0px 4px 6px 0px rgba(0, 0, 0, 0.14),
    inset 0px 9px 14px -5px rgba(255, 255, 255, 0.1)
   `,
  };

  const combinedStyle = { ...defaultStyle, ...style };

  if (href) {
    if (disabled) {
      return (
        <span className={combinedClasses} style={combinedStyle}>
          {content}
        </span>
      );
    }
    return (
      <Link href={href} className={combinedClasses} style={combinedStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled}
      style={combinedStyle}>
      {content}
    </button>
  );
};

export default SparkButton;
