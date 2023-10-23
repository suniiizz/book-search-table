import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

/* 
  tsconfigPaths
  - typescript를 vite와 함께 사용할 때 ts의 모듈 확인을 tsconfig.json의 baseUrl 및 paths 구성에 의존한다.
    하지만 ESlint는 기본적으로 해당 구성을 읽지 않는다.
    ESlint가 프로젝트의 모듈 경로를 제대로 확인하게 하려면 vite 구성 파일에서 vite-tsconfig-paths를 사용해야 한다.
    
    그러나 우리 프로젝트에서는 compilerOption을 사용안하고
    
    "paths": {
      "@/*": ["src/*"]
    }

    해당 옵션을 사용하기 때문에 사실 안해줘도 된다.

*/
