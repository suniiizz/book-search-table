import { useContext } from "react";
import { createPortal } from "react-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ModalContext } from "@/components/modal/context/ModalContext";

// import {
//   AlertDialog as ModalWrap,
//   AlertDialogAction as ModalAction,
//   AlertDialogCancel as ModalClose,
//   AlertDialogContent as ModalContent,
//   AlertDialogDescription as ModalDescription,
//   AlertDialogFooter as ModalFooter,
//   AlertDialogHeader as ModalHeader,
//   AlertDialogTitle as ModalTitle,
//   AlertDialogTrigger as ModalButton,
// } from "@/components/ui/modal";

interface Props {
  title: string;
  children: React.ReactNode;
  className?: string;
  modalButton?: boolean | string;
}

const Modal = ({ title, children }: Props) => {
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
            <div className="flex justify-end w-full gap-2">
              <Button
                variant={"secondary"}
                className="flex gap-2"
                onClick={onCloseModal}
              >
                취소
              </Button>
              <Button className="flex gap-2" onClick={onCloseModal}>
                확인
              </Button>
            </div>
          </Alert>
        </>,

        // <ModalWrap>
        //   {modalButton && <ModalButton>{modalButton}</ModalButton>}
        //   <ModalContent>
        //     <ModalHeader>
        //       <ModalTitle>{title}</ModalTitle>
        //       <ModalDescription>{children}</ModalDescription>
        //     </ModalHeader>
        //     <ModalFooter>
        //       <ModalClose>취소</ModalClose>
        //       <ModalAction>확인</ModalAction>
        //     </ModalFooter>
        //   </ModalContent>
        // </ModalWrap>,
        document.body,
      )}
    </>
  );
};

export default Modal;
