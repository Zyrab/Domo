import Domo from "../../domo/src/index.js";
// Import the isolated styles
// import "../styles/button.css";

/**
 * This is the "Shadcn Pattern" (CVA).
 * It's just a dictionary mapping your props to CSS classes.
 */
const buttonVariants = {
  base: "btn",
  variants: {
    variant: {
      default: "btn-default",
      destructive: "btn-destructive",
      outline: "btn-outline",
      ghost: "btn-ghost",
    },
    size: {
      default: "btn-default-size",
      sm: "btn-sm",
      lg: "btn-lg",
      icon: "btn-icon",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
};

// Helper function to piece the string together based on the dictionary
function getClasses({ variant, size, className }) {
  const v = variant || buttonVariants.defaultVariants.variant;
  const s = size || buttonVariants.defaultVariants.size;

  return [buttonVariants.base, buttonVariants.variants.variant[v], buttonVariants.variants.size[s], className]
    .filter(Boolean)
    .join(" ");
}

export default function Button(props = {}) {
  const {
    variant,
    size,
    cls,
    label = "",
    type = "button", // Prevents accidental form submissions
    disabled = false,
    href = null,
    onClick = null,
    children = [],
    ...rest // grabs anything else like aria-label
  } = props;

  const tag = href ? "a" : "button";
  const finalClasses = getClasses({ variant, size, cls });

  const el = Domo(tag)
    .cls(finalClasses)
    .attr({
      // If it's a link acting like a button, tell screen readers it's a button
      ...(tag === "a" ? { href, role: "button" } : { type }),
      ...(disabled && tag === "button" ? { disabled: "" } : {}),
      ...rest, // applies aria-labels or aria-expanded automatically
    });

  // Links don't have a native disabled state, so we fake it for screen readers
  if (tag === "a" && disabled) {
    el.attr({ "aria-disabled": "true", tabindex: "-1" });
  }

  // Combine any passed-in children (like icons) with the text label
  const content = [...children, label ? Domo("span").txt(label) : null].filter(Boolean);

  el.child(content);

  if (onClick && !disabled) el.on("click", onClick);

  return el;
}
