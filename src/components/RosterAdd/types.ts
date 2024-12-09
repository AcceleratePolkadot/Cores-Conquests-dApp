import type { WalletAccount } from "@reactive-dot/core/wallets.js";

export interface RosterAddButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export interface RosterAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface RosterAddFormProps {
  setTitle: (title: string) => void;
  onFormSubmit: (data: { title: string }) => void;
}

export interface RosterAddConfirmationProps {
  title: string;
  activeAccount: WalletAccount;
  onComplete: () => void;
  setDismissible: (dismissible: boolean) => void;
}
