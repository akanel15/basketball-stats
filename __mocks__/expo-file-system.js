/* eslint-env jest */
module.exports = {
  cacheDirectory: "/mock/cache/directory/",
  documentDirectory: "/mock/document/directory/",
  EncodingType: {
    Base64: "base64",
    UTF8: "utf8",
  },
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  readAsStringAsync: jest.fn(() => Promise.resolve("mock file content")),
  deleteAsync: jest.fn(() => Promise.resolve()),
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: true, size: 100 })),
  copyAsync: jest.fn(() => Promise.resolve()),
  moveAsync: jest.fn(() => Promise.resolve()),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
};
