import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { captureRef } from "react-native-view-shot";

export async function shareBoxScoreImage(
  viewRef: React.RefObject<any>,
  gameName?: string,
): Promise<boolean> {
  try {
    // Check if sharing is available on this platform
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        "Sharing not available",
        "Sharing is not available on this platform",
      );
      return false;
    }

    // Capture the view as an image
    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 0.9,
      result: "tmpfile",
    });

    // Share the image
    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle: gameName ? `Share ${gameName} Box Score` : "Share Box Score",
      UTI: "public.png",
    });

    // Cleanup temp file after 30 seconds to avoid cache bloat
    setTimeout(() => {
      FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {
        // Ignore cleanup errors
      });
    }, 30000);

    return true;
  } catch (error) {
    console.error("Error sharing box score:", error);
    Alert.alert(
      "Sharing failed",
      error instanceof Error ? error.message : "An unknown error occurred",
    );
    return false;
  }
}
