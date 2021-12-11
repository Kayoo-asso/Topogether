module.exports = {
    // -- General config, from ESLint's initial configuration
    "env": {
        "browser": true,
        "es2021": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 13,
        "sourceType": "module"
    },
    // 
    // -- Plugins
    // Those are the default rule configurations
    "plugins": [
        "react",
        "react-hooks",
        "@typescript-eslint"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "next/core-web-vitals",
        "plugin:storybook/recommended"
    ],
    "rules": {
        "react-hooks/exhaustive-deps": ["warn", {
            "additionalHooks": "useAsyncEffect"
        }]
    },
    // -- Shared settings
    "settings": {
        // Required by eslint-plugin-react
        "react": {
            "version": "detect"
        }
    },
    // -- Ignore: Materialize and jQuery
    "ignorePatterns": ["/src/js/materialize", "/src/js/script"]
};
