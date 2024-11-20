import flowbiteTheme from "@/config/flowbite";
import { Flowbite } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";

const FlowbiteThemeWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <Flowbite theme={{ theme: flowbiteTheme }}>{children}</Flowbite>;
};

export default FlowbiteThemeWrapper;
