module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true
	},
	extends: ['prettier'],
	rules: {
		'no-console': 'off',
		'no-debugger': 'off',
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		indent: ['error', 'tab']
	},
	parserOptions: {
		parser: 'babel-eslint',
		ecmaVersion: 2017,
		sourceType: 'module',
		ecmaFeatures: {
            jsx: true
        }
	}
}
