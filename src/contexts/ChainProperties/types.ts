export type ChainProperties = {
  ss58Format: number;
  tokenDecimals: number;
  tokenSymbol: string;
};

export interface ChainPropertiesContextType {
  chainProperties: ChainProperties | undefined;
  syncChainProperties: (callback?: (properties: ChainProperties) => void) => Promise<void>;
}
