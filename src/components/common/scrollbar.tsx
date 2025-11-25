import cn from "classnames";
import React from "react";

type ScrollbarProps = {
  options?: any;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const Scrollbar: React.FC<ScrollbarProps> = ({
  // keep signature compatible; ignore options to avoid runtime issues
  options: _options,
  children,
  style,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("overflow-auto", className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default Scrollbar;
