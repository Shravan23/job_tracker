export default [
  // Define the basic configuration
  {
    files: ["src/**/*.js", "tests/**/*.js"], // Apply to JS files in src and tests folders
    ignores: ["node_modules/**"], // Ignore node_modules

    // Define language options
    languageOptions: {
      ecmaVersion: 2021, // Use ECMAScript 2021
      sourceType: "module", // Allow ES modules (import/export)
      globals: {
        // Define globals
        chrome: "readonly", // Chrome Extension API
        process: "readonly", // Node.js process
        require: "readonly", // Node.js require
        module: "readonly", // Node.js module
      },
    },

    // Define rules
    rules: {
      "no-undef": "off", // Turn off undefined variable check
      "no-unused-vars": "warn", // Warn on unused variables
      "no-console": "off", // Allow console.log for debugging
    },
  },

  // Apply Jest-specific settings for test files
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly", // Jest globals
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
      },
    },
  },
];
