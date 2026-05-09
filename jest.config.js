/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: { 
    "^@/(.*)$": "<rootDir>/src/$1",
    "^nanoid$": "<rootDir>/src/lib/nanoid-shim.js"
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
  transformIgnorePatterns: [],
}

module.exports = config