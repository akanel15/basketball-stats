// Mock the dependencies first before any imports
import { shareBoxScoreImage } from "../../utils/shareBoxScore";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

jest.mock("expo-sharing");
jest.mock("react-native-view-shot");
jest.mock("expo-file-system");
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

const mockSharing = Sharing as jest.Mocked<typeof Sharing>;
const mockCaptureRef = captureRef as jest.MockedFunction<typeof captureRef>;

describe("shareBoxScoreImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should capture and share the box score image", async () => {
    // Mock the ref object
    const mockRef = { current: {} };

    // Mock Sharing.isAvailableAsync to return true
    mockSharing.isAvailableAsync.mockResolvedValue(true);

    // Mock captureRef to return a file URI
    mockCaptureRef.mockResolvedValue("file://path/to/image.png");

    // Mock Sharing.shareAsync to resolve successfully
    mockSharing.shareAsync.mockResolvedValue();

    const result = await shareBoxScoreImage(mockRef, "Test Game");

    expect(result).toBe(true);
    expect(mockSharing.isAvailableAsync).toHaveBeenCalled();
    expect(mockCaptureRef).toHaveBeenCalledWith(mockRef, {
      format: "png",
      quality: 0.9,
      result: "tmpfile",
    });
    expect(mockSharing.shareAsync).toHaveBeenCalledWith("file://path/to/image.png", {
      mimeType: "image/png",
      dialogTitle: "Share Test Game Box Score",
      UTI: "public.png",
    });
  });

  it("should return false when sharing is not available", async () => {
    const mockRef = { current: {} };

    // Mock Sharing.isAvailableAsync to return false
    mockSharing.isAvailableAsync.mockResolvedValue(false);

    const result = await shareBoxScoreImage(mockRef);

    expect(result).toBe(false);
    expect(mockCaptureRef).not.toHaveBeenCalled();
    expect(mockSharing.shareAsync).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    const mockRef = { current: {} };

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockSharing.isAvailableAsync.mockResolvedValue(true);
    mockCaptureRef.mockRejectedValue(new Error("Capture failed"));

    const result = await shareBoxScoreImage(mockRef);

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith("Error sharing box score:", expect.any(Error));

    consoleSpy.mockRestore();
  });
});
