// vite.config.js
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "src/assets/images/*", dest: "assets/images" },

        // Specify additional files or patterns as needed
      ],
      hook: "writeBundle", // Ensures the assets are copied after the bundle is written
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        background: "src/background.js",
        bngContentScript: "src/scripts/bngContentScript.js", // Add the new script file here
        yhoContentScript: "src/scripts/yhoContentScript.js", // Add the new script file here
        gglContentScript: "src/scripts/gglContentScript.js", // Add the new script file here
      },
      output: {
        entryFileNames: `[name].bundle.js`, // Use [name] placeholder to generate dynamic bundle names
      },
    },
  },
});
