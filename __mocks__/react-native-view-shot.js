/* eslint-env jest */
const React = require("react");

const captureRef = jest.fn(() =>
  Promise.resolve("file://mock/path/to/image.png"),
);

const captureScreen = jest.fn(() =>
  Promise.resolve("file://mock/path/to/screen.png"),
);

const ViewShot = React.forwardRef((props, ref) => {
  return React.createElement("View", {
    ...props,
    ref,
    testID: "ViewShot",
  });
});
ViewShot.displayName = "ViewShot";

module.exports = ViewShot;
module.exports.captureRef = captureRef;
module.exports.captureScreen = captureScreen;
module.exports.default = ViewShot;
