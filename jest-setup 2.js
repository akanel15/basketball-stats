/* eslint-env jest */
// Mock react-native-uuid
jest.mock("react-native-uuid", () => ({
  v4: jest.fn(() => "mock-uuid-" + Math.random().toString(36).substr(2, 9)),
}));

// Global test utilities
global.mockZustandStore = (initialState) => {
  return {
    getState: jest.fn(() => initialState),
    setState: jest.fn(),
    subscribe: jest.fn(),
  };
};
