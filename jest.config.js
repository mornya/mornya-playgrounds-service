module.exports = {
  roots: ['.'],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  setupFiles: ['<rootDir>/test/@setup.ts'],
  transform: {
    '.(jsx?|mjs)$': 'babel-jest', // ts-jest
    '.(bmp|gif|jpe?g|png|tif|webp|svg|mp4|webm|flac|mp3|wav|ogg|aac|eot|[t|o]tf|woff2?)$': 'jest-transform-stub',
    '.((sa|sc|c|le)ss|styl(us)?)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    '/coverage',
    '/bin',
    '/dist',
    '/build',
    '/out',
    '/static',
    '/node_modules/',
    '/.idea',
    '/.vscode',
    '/.git',
  ],
  testRegex: '\\.test\\.([t|j]sx?|mjs)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'vue', 'json', 'mjs'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '^.+.(bmp|gif|jpe?g|png|tif|webp|svg|mp4|webm|flac|mp3|wav|ogg|aac|eot|[t|o]tf|woff2?)$': 'jest-transform-stub',
    '^.+.((sa|sc|c|le)ss|styl(us)?)$': 'jest-transform-stub',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/components/**/*.vue',
    '<rootDir>/pages/**/*.vue'
  ]
}
