import type { Roster } from "@/contexts/Rosters/types";
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
  roster: Roster;
  activeAccount: WalletAccount;
  onComplete: () => void;
  setDismissible: (dismissible: boolean) => void;
}
