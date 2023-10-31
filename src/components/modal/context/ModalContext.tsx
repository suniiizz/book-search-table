import { createContext, useCallback, useState } from "react";

type ModalContextType = {
  isOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
};

interface Props {
  children: React.ReactNode;
}

export const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  onOpenModal: () => {
    return;
  },
  onCloseModal: () => {
    return;
  },
});

export const ModalContextProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        onOpenModal: handleOpenModal,
        onCloseModal: handleCloseModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
