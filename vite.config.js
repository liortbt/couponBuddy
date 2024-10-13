// vite.config.js
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "src/assets/images/*", dest: "assets/images" },
        {src:"public/manifest.json",dest:"."}

        // Specify additional files or patterns as needed
      ],
      hook: "writeBundle", // Ensures the assets are copied after the bundle is written
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        utils:"src/utils.js",
        background: "src/background.js",
        initalBanner:"src/scripts/initalBanner.js",
        progressBar:"src/scripts/progressBar.js",
        finalBanner:"src/scripts/finalBanner.js",
        gglContentScript: "src/scripts/gglContentScript.js", // Add the new script file here
      },
      output: {
        entryFileNames: `[name].bundle.js`, // Use [name] placeholder to generate dynamic bundle names
      },
    },
  },
});
