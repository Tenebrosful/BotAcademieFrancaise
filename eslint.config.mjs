import typescriptEslint from "@typescript-eslint/eslint-plugin";
import stylistic from '@stylistic/eslint-plugin';
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended").map(config => ({
        ...config,
        files: ["**/*.js", "**/*.ts"],
    })),
    {
        files: ["**/*.js", "**/*.ts"],

        plugins: {
            "@typescript-eslint": typescriptEslint,
            '@stylistic': stylistic
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            },

            parser: tsParser,
        },

        rules: {
            "no-return-await": "error",
            "no-unreachable-loop": "error",
            "no-promise-executor-return": "error",
            "no-unsafe-optional-chaining": "error",
            "no-useless-backreference": "error",
            "require-atomic-updates": "error",
            "no-await-in-loop": "error",
            "spaced-comment": "error",
            "sort-keys": "error",
            "no-unused-vars": "off",
            curly: ["error", "multi"],
            eqeqeq: "error",
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/no-unused-vars": "error",
            "@stylistic/semi": "error",
            "@typescript-eslint/no-loss-of-precision": "error",
            "@stylistic/quotes": "error",
            "@typescript-eslint/no-empty-function": "error",
            "@typescript-eslint/no-empty-interface": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/no-var-requires": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
        },
    },
];