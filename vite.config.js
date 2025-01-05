// vite.config.js
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";


export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "src/assets/images/*", dest: "assets/images" },
        { src: "src/assets/svg/*", dest: "assets/svg" },


      ],
      hook: "writeBundle", // Ensures the assets are copied after the bundle is written
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        utils: "src/utils.js",
        background: "src/background.js", 
        initalBanner: "src/scripts/newBanner.js",
        progressBar: "src/scripts/newProgressBar.js",
        finalBanner: "src/scripts/finalBanner.js",
        gglContentScript: "src/scripts/gglContentScript.js",
        userNavigate: "src/scripts/userNavigate.js",
        banner: "src/scripts/banner.js",
      },
      output: {
        entryFileNames: `[name].bundle.js`,
        dir: 'dist',
        assetFileNames: `[name].[ext]`
      },
      treeshake: {
        moduleSideEffects: (id) => {
          if (id.includes('utils.js')) {
            return 'no-treeshake';
          }
          return true;
        }
      }
    },
  },
});
