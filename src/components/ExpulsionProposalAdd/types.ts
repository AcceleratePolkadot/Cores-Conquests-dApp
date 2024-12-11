import type { Address } from "@/contexts/ActiveAccount/types";
import type { RosterId } from "@/contexts/Rosters/types";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";

export type CanAddExpulsionProposalResult = {
  can: boolean;
  reason?: string;
};

export interface ExpulsionProposalAddProps {
  subject: Address;
}

export interface ExpulsionProposalAddButtonProps {
  onClick: () => void;
  disabled: boolean;
  tooltipContent?: string;
}

export interface ExpulsionProposalAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Address;
}

export interface ExpulsionProposalAddFormProps {
  setReason: (reason: string) => void;
  onFormSubmit: (data: { reason: string }) => void;
  minLength: number;
  maxLength: number;
}

export interface ExpulsionProposalAddConfirmationProps {
  reason: string;
  subject: string;
  rosterId: RosterId;
  activeAccount: WalletAccount;
  onComplete: () => void;
  setDismissible: (dismissible: boolean) => void;
}
