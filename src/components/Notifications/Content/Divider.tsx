import type React from "react";

const Divider: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="relative mb-4 inline-flex w-full items-center justify-center bg-inherit">
      <hr className="h-px w-64 rounded border-0 bg-white/50" />
      <div className="-translate-x-1/2 absolute left-1/2 bg-inherit px-4 text-xxs uppercase">
        {label}
      </div>
    </div>
  );
};

export default Divider;
