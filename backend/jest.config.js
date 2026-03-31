module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests/'],
    testMatch: ['**/*.test.js'],
    clearMocks: true,
    moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
        '^@routes/(.*)$': '<rootDir>/src/routes/$1',
        '^@schemas/(.*)$': '<rootDir>/src/schemas/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1'
    },
    verbose: true
}