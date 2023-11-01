# Modal Component

`React Portal`, `shadcn/ui`를 사용하여 `modal` 컴포넌트를 구현해 보려고 한다.

<br>
  
**Portal이란?**

- 부모 컴포넌트의 DOM 계층 구조 바깥에 있는 DOM 노드로 자식을 렌더링한다.

<br>
  
**Portal을 사용하는 이유는?**

- 부모 - 자식 관계와 독립적인 구조를 동시에 유지가 가능하다.

`shadcn/ui`의 `Alert Component` ui를 사용하기 위해 설치를 하였다.

```jsx
npm install @radix-ui/react-alert-dialog
```

<br>
  
### useContext

`useContext`를 사용하여 `props`를 매번 전달하지 않아도 모달을 사용할 수 있게 만들고자 했다.

그리하여 `ModalContext` 객체를 생성하고, `Provider`로 생성한 `context`를 하위 컴포넌트에 전달하도록 구현하였다.

- `createContext` : context 객체를 생성
- `Provider` : 생성한 context를 하위 컴포넌트에게 전달

```jsx
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
```

```jsx
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "@/routes";
import { ModalContextProvider } from "@/components/modal/context/ModalContext";

const App = () => {
  const router = createBrowserRouter([routes]);

  return (
    <ModalContextProvider>
      <RouterProvider router={router} />
    </ModalContextProvider>
  );
};

export default App;
```

<br>
  
### Portal

`createPortal`을 사용하여 첫번째 인자에 `modal component`, 두번째 인자에 렌더링 할 `DOM element`를 넣어준다. 두번째 인자에 넣은 `body`에 첫번째 인자에 넣은 `modal layout`이 렌더링 될 것이다.

```jsx
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
```

`title`과 `children`이라는 `props`를 추가하여, `shadcn/ui`의 `shadcn/ui Component` 내부에 전달 가능하도록 하였다.
<br>

<br>
  
### 🧐

초반에는 `shadcn/ui`의 `Alert Dialog Component`를 이용하여 `Portal`로 구현하려 했지만 어쨰서인지 렌더링조차 되지 않았다. 이 부분을 수정하려 했지만 실패하여 좀 더 라이브러리를 분석해봐야할 것 같다.
