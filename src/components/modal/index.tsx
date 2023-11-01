import { useContext } from "react";
import { createPortal } from "react-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/modal";
import { ModalContext } from "@/components/modal/context/ModalContext";

interface ModalType {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({ title, children }: ModalType) => {
  const { onCloseModal } = useContext(ModalContext);

  return (
    <>
      {createPortal(
        <>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black z-10 bg-opacity-60"
            onClick={onCloseModal}
          />
          <Alert
            className={`fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-white max-w-[50%] max-h-[90%] z-20`}
          >
            <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              {children}
            </AlertDescription>
          </Alert>
        </>,
        document.body,
      )}
    </>
  );
};

export default Modal;
