import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        globals: true,
        environment: "node",
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        exclude: ["node_modules", "dist", ".expo"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: [
                "src/**/*.{test,spec}.{ts,tsx}",
                "src/test/**",
                "src/**/*.d.ts",
            ],
        },
    },
    resolve: {
        alias: {
            // React Native / Expo stubs — vitest runs in Node, not in a native runtime.
            // These map RN internals that would otherwise crash the test runner to
            // lightweight no-op mocks defined in src/test/mocks/.
            "react-native": "./src/test/mocks/react-native.ts",
            "expo-sqlite": "./src/test/mocks/expo-sqlite.ts",
            "expo-font": "./src/test/mocks/expo-generic.ts",
            "expo-constants": "./src/test/mocks/expo-generic.ts",
            "expo-haptics": "./src/test/mocks/expo-generic.ts",
            "expo-linking": "./src/test/mocks/expo-generic.ts",
            "expo-router": "./src/test/mocks/expo-generic.ts",
            "expo-splash-screen": "./src/test/mocks/expo-generic.ts",
            "expo-status-bar": "./src/test/mocks/expo-generic.ts",
            "expo-symbols": "./src/test/mocks/expo-generic.ts",
            "expo-system-ui": "./src/test/mocks/expo-generic.ts",
            "expo-web-browser": "./src/test/mocks/expo-generic.ts",
        },
    },
});
