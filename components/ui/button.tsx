import React, { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

// Custom button props including our extra variants and sizes.
export interface ButtonProps extends MuiButtonProps {
  /**
   * Renders the child component without wrapping it in an additional DOM element.
   */
  asChild?: boolean;
  /**
   * Custom variant styles.
   * - "default": Primary button style.
   * - "destructive": For destructive actions.
   * - "outline": Button with a primary-colored border.
   * - "secondary": Secondary action style.
   * - "ghost": Transparent background with primary text.
   * - "link": Styled as a link.
   */
  customVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /**
   * Custom size options.
   * - "default": Standard size.
   * - "sm": Small size.
   * - "lg": Large size.
   * - "icon": Square button for icons.
   */
  customSize?: "default" | "sm" | "lg" | "icon";
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "customVariant" && prop !== "customSize",
})<Pick<ButtonProps, "customVariant" | "customSize">>(({ theme, customVariant, customSize }) => {
  // Define variant styles based on the customVariant prop
  let variantStyles = {};
  switch (customVariant) {
    case "destructive":
      variantStyles = {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.error.dark,
        },
      };
      break;
    case "outline":
      variantStyles = {
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: "transparent",
        color: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      };
      break;
    case "secondary":
      variantStyles = {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.secondary.dark,
        },
      };
      break;
    case "ghost":
      // For ghost, we want a transparent background, primary text,
      // and on hover, a subtle tint. Here we convert the primary.light hex
      // to an rgba string with, for example, 10% opacity.
      variantStyles = {
        backgroundColor: "transparent",
        color: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.main.replace("#", "rgba(") + ",0.1)",
        },
      };
      break;
    case "link":
      variantStyles = {
        backgroundColor: "transparent",
        color: theme.palette.primary.main,
        textDecoration: "underline",
        "&:hover": {
          backgroundColor: "transparent",
          textDecoration: "underline",
        },
      };
      break;
    default:
      // "default" variant or unspecified: primary style.
      variantStyles = {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      };
  }

  // Define size styles based on the customSize prop
  let sizeStyles = {};
  switch (customSize) {
    case "sm":
      sizeStyles = {
        padding: theme.spacing(0.75, 2),
        fontSize: theme.typography.pxToRem(14),
        minHeight: 36,
      };
      break;
    case "lg":
      sizeStyles = {
        padding: theme.spacing(1.5, 4),
        fontSize: theme.typography.pxToRem(16),
        minHeight: 48,
      };
      break;
    case "icon":
      sizeStyles = {
        padding: 0,
        minWidth: 40,
        minHeight: 40,
      };
      break;
    default:
      sizeStyles = {
        padding: theme.spacing(1, 3),
        fontSize: theme.typography.pxToRem(15),
        minHeight: 40,
      };
  }

  return {
    textTransform: "none", // prevent automatic capitalization
    ...variantStyles,
    ...sizeStyles,
  };
});

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, customVariant = "default", customSize = "default", ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
      <StyledButton
        component={Component as any}
        customVariant={customVariant}
        customSize={customSize}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
