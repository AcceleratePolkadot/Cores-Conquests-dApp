import type { CustomFlowbiteTheme } from "flowbite-react";

const buttonTheme: CustomFlowbiteTheme["button"] = {
  disabled: "opacity-90",
  isProcessing: "cursor-wait",
  label: "inline-flex items-center justify-center uppercase",
  size: {
    xl: "px-6 py-3 text-xl",
  },
};

const spinnerTheme: CustomFlowbiteTheme["spinner"] = {
  base: "inline animate-spin text-white",
  light: {
    off: {
      base: "",
      color: {
        failure: "",
        gray: "",
        info: "",
        pink: "",
        purple: "",
        success: "",
        warning: "",
      },
    },
  },
};

export { buttonTheme, spinnerTheme };
