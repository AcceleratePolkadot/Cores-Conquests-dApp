import type React from "react";

const Divider: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="relative mb-4 inline-flex w-full items-center justify-center dark:bg-inherit">
      <hr className="h-px w-64 rounded border-0 dark:bg-white/50" />
      <div className="-translate-x-1/2 absolute left-1/2 px-4 text-xxs uppercase dark:bg-inherit">
        {label}
      </div>
    </div>
  );
};

export default Divider;