module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "prettier",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@tanstack/query"], // tanstack/query 플러그인 추가
  rules: {
    "react/prop-types": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": "off", // import * from "react" 없이도 코드 작성 가능
    "react-hooks/exhaustive-deps": "off", // 디펜던시 값을 임의로 세팅 할 수 있음
    "@tanstack/query/exhaustive-deps": "off", // tanstack query의 디펜던시 값을 임의로 세팅 할 수 있음
    "no-console": "warn", // console을 무조건 지우게 셋팅
    /* 
    "@tanstack/query/prefer-query-object-syntax" 룰은 eslint-plugin-query 의 일부로 제공되는 규칙입니다.
    이 규칙은 "query" 패키지를 사용할 때, 쿼리 객체 구문을 사용하도록 권장하는 규칙입니다.
    "query" 패키지는 상태 관리와 데이터 가져오기를 단순화하기 위해 설계된 도구이며,
    쿼리 객체를 사용하여 데이터 요청을 정의하는 것이 주요 아이디어입니다. 
    "query" 패키지를 사용할 때, 당신의 코드에서 쿼리 객체를 사용하여 데이터 요청을 정의하는 것이 권장되며, 
    이 규칙은 이를 강제하기 위한 것입니다. 예를 들어, 다음은 "query" 패키지를 사용하여 데이터 요청을 정의하는 코드의 예시입니다:    
    */
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
