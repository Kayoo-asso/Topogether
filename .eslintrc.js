module.exports = {
    // -- General config, from ESLint's initial configuration
    "env": {
        "browser": true,
        "es2021": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "tsx": true
        },
        "ecmaVersion": 13,
        "sourceType": "module",
        "project": ["tsconfig.json"]
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
        "airbnb",
        "airbnb-typescript",
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
        }],
        'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
        "react/destructuring-assignment": 0,
        "react/function-component-definition": 0,
        "import/prefer-default-export": 0,
        "react/prop-types": "off",
        "react/require-default-props":0,
        "react/jsx-props-no-spreading": 0,
        "import/no-extraneous-dependencies": 0
    },
    // -- Shared settings
    "settings": {
        // Required by eslint-plugin-react
        "react": {
            "version": "detect"
        }
    },
    // -- Ignore: Materialize and jQuery
    "ignorePatterns": ["/src/js/materialize", "/src/js/script", "*index.js"]
};
