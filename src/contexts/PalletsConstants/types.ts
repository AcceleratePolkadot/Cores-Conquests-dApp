import type { BlocConstants } from "@polkadot-api/descriptors";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type PalletsConstants = DeepPartial<BlocConstants>;
export type PalletsConstantsList = DeepPartial<
  Record<keyof BlocConstants, keyof BlocConstants[keyof BlocConstants][]>
>;

export interface PalletsConstantsContextType {
  palletsConstants: PalletsConstants;
}
