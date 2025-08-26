// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
	basePath: ".",
	files: ["**/*.ts"],
	extends: [
		eslint.configs.recommended,
		tseslint.configs.strict
	],
	rules: {
		"no-async-promise-executor": "off",
		"no-empty": ["error", {allowEmptyCatch:true}],

		"@typescript-eslint/no-dynamic-delete": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unused-vars": "off",
	}})