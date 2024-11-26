import type { RosterId } from "@/contexts/Rosters/types";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";

export interface NominationAddButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export interface NominationAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface NominationAddFormProps {
  setNominee: (nominee: string) => void;
  onFormSubmit: (data: { nominee: string }) => void;
}

export interface NominationAddConfirmationProps {
  nominee: string;
  rosterId: RosterId;
  activeAccount: WalletAccount;
  onSuccess: () => void;
  onError: () => void;
}
