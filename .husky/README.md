- [husky 참고링크](https://xiubindev.tistory.com/136)
  - `.husky/_/pre-commit`
    ![Untitled](../src/assets/image/markdown/Untitled.png)
    - **`#!/usr/bin/env sh`**
      - 이 첫 번째 줄은 이 스크립트가 어떤 셸을 사용할 것인지를 지정합니다. 이 스크립트는 "sh" 셸을 사용합니다.
    - **`. "$(dirname -- "$0")/_/husky.sh"`**
      - 이 줄은 스크립트 파일이 위치한 디렉토리 내의 "\_/husky.sh" 파일을 실행합니다. 이 파일은 Husky 프로젝트의 실행 스크립트인데, Git 훅(hook)을 관리하고 실행하는 데 사용됩니다. 이 스크립트는 Husky를 초기화하고 Git 훅 설정을 로드합니다.
    - **`npx lint-staged`**
      - 이 명령어는 "npx"를 사용하여 "lint-staged" 패키지를 실행합니다. "lint-staged"는 Git 스테이징 영역에 있는 변경된 파일에 대해 지정된 명령어를 실행하는 도구입니다. 보통, 코드 포맷팅, ESLint 검사 및 다른 정적 분석 도구와 같이 전반적인 코드 품질을 검사하거나 개선하는 데 사용됩니다. "npx"는 "lint-staged"를 프로젝트 로컬 노드 모듈로 설치된 패키지를 실행하기 위해 사용됩니다.
  - `package.json`
    ![Untitled](./src/assets/image/markdown//Untitled%201.png)
    - **`"*.{js,jsx,ts,tsx}"`**
      - **`"*.{js,jsx,ts,tsx}"`**는 정규 표현식 패턴으로, JavaScript와 TypeScript 파일을 대상으로 합니다. 즉, 이 규칙은 프로젝트에서 해당 확장자를 가진 모든 JavaScript 및 TypeScript 파일을 대상으로 합니다.
    - **`"prettier --cache --write"`**
      - 이 부분은 Prettier를 실행하는 명령어입니다. "prettier"는 코드 포맷팅 도구로, 코드를 일관된 스타일로 자동으로 정리합니다. **`--cache`** 옵션은 이미 포맷팅된 파일을 건너뛰고, **`--write`** 옵션은 파일을 직접 수정하여 포맷팅을 적용합니다. 따라서, 스테이징 영역에 있는 파일이 Prettier로 자동 포맷팅됩니다.
    - **`"eslint --cache --fix --max-warnings=0"`**
      - 이 부분은 ESLint를 실행하는 명령어입니다. ESLint는 JavaScript 및 TypeScript 코드의 품질을 검사하는 정적 분석 도구입니다. **`--cache`** 옵션은 이미 검사된 파일을 건너뛰고, **`--fix`** 옵션은 가능한 오류를 자동으로 수정하려고 시도합니다. **`--max-warnings=0`** 옵션은 경고가 발생하면 커밋을 중지시키는 옵션으로, 커밋 시에 ESLint가 0개의 경고를 보장합니다.
