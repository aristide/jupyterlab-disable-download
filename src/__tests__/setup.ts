import '@testing-library/jest-dom';

// Mock the window.getSelection
Object.defineProperty(window, 'getSelection', {
    value: jest.fn()
});
