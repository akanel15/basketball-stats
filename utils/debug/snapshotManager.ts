import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useTeamStore } from "@/store/teamStore";
import { usePlayerStore } from "@/store/playerStore";
import { useGameStore } from "@/store/gameStore";
import { useSetStore } from "@/store/setStore";
import { TeamType } from "@/types/team";
import { PlayerType } from "@/types/player";
import { GameType } from "@/types/game";
import { SetType } from "@/types/set";

// Version for backwards compatibility
const SNAPSHOT_VERSION = "1.0.0";

export type DebugSnapshot = {
  version: string;
  timestamp: string;
  metadata: {
    name: string;
    description?: string;
    deviceInfo?: string;
  };
  stores: {
    teams: Record<string, TeamType>;
    players: Record<string, PlayerType>;
    games: Record<string, GameType>;
    sets: Record<string, SetType>;
    teamCurrentId: string;
  };
};

export type SavedSnapshotInfo = {
  id: string;
  name: string;
  timestamp: string;
  filePath: string;
  fileSize: number;
  description?: string;
};

// Keys for AsyncStorage
const SNAPSHOT_REGISTRY_KEY = "debug_snapshot_registry";
const SNAPSHOTS_DIR = `${FileSystem.documentDirectory}debugSnapshots/`;

/**
 * Ensures the snapshots directory exists
 */
async function ensureSnapshotsDir(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(SNAPSHOTS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(SNAPSHOTS_DIR, { intermediates: true });
  }
}

/**
 * Gets the current registry of saved snapshots
 */
async function getSnapshotRegistry(): Promise<SavedSnapshotInfo[]> {
  try {
    const registryJson = await AsyncStorage.getItem(SNAPSHOT_REGISTRY_KEY);
    return registryJson ? JSON.parse(registryJson) : [];
  } catch (error) {
    console.error("Error getting snapshot registry:", error);
    return [];
  }
}

/**
 * Updates the snapshot registry
 */
async function updateSnapshotRegistry(
  registry: SavedSnapshotInfo[],
): Promise<void> {
  try {
    await AsyncStorage.setItem(SNAPSHOT_REGISTRY_KEY, JSON.stringify(registry));
  } catch (error) {
    console.error("Error updating snapshot registry:", error);
    throw new Error("Failed to update snapshot registry");
  }
}

/**
 * Captures the current state of all stores
 */
export async function captureSnapshot(): Promise<DebugSnapshot> {
  const teamState = useTeamStore.getState();
  const playerState = usePlayerStore.getState();
  const gameState = useGameStore.getState();
  const setState = useSetStore.getState();

  const snapshot: DebugSnapshot = {
    version: SNAPSHOT_VERSION,
    timestamp: new Date().toISOString(),
    metadata: {
      name: "", // Will be set when saving
      deviceInfo: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
    },
    stores: {
      teams: teamState.teams,
      players: playerState.players,
      games: gameState.games,
      sets: setState.sets,
      teamCurrentId: teamState.currentTeamId,
    },
  };

  return snapshot;
}

/**
 * Saves a snapshot to file and registry
 */
export async function saveSnapshot(
  name: string,
  snapshot: DebugSnapshot,
  description?: string,
): Promise<SavedSnapshotInfo> {
  try {
    await ensureSnapshotsDir();

    // Create unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${timestamp}-${name.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
    const filePath = `${SNAPSHOTS_DIR}${filename}`;

    // Update snapshot metadata
    snapshot.metadata.name = name;
    snapshot.metadata.description = description;

    // Save to file
    const snapshotJson = JSON.stringify(snapshot, null, 2);
    await FileSystem.writeAsStringAsync(filePath, snapshotJson);

    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    const fileSize = fileInfo.exists ? fileInfo.size || 0 : 0;

    // Create registry entry
    const snapshotInfo: SavedSnapshotInfo = {
      id: `${timestamp}-${name}`,
      name,
      timestamp: snapshot.timestamp,
      filePath,
      fileSize,
      description,
    };

    // Update registry
    const registry = await getSnapshotRegistry();
    registry.unshift(snapshotInfo); // Add to beginning (newest first)
    await updateSnapshotRegistry(registry);

    return snapshotInfo;
  } catch (error) {
    console.error("Error saving snapshot:", error);
    throw new Error(`Failed to save snapshot: ${error}`);
  }
}

/**
 * Loads a snapshot from file and restores all stores
 */
export async function loadSnapshot(
  snapshotInfo: SavedSnapshotInfo | DebugSnapshot,
): Promise<void> {
  try {
    let snapshot: DebugSnapshot;

    if ("filePath" in snapshotInfo) {
      // Loading from saved file
      const snapshotJson = await FileSystem.readAsStringAsync(
        snapshotInfo.filePath,
      );
      snapshot = JSON.parse(snapshotJson);
    } else {
      // Direct snapshot object (for seed data)
      snapshot = snapshotInfo;
    }

    // Validate version compatibility (for future use)
    if (snapshot.version !== SNAPSHOT_VERSION) {
      console.warn(
        `Snapshot version ${snapshot.version} may not be fully compatible with current version ${SNAPSHOT_VERSION}`,
      );
    }

    // Restore each store
    useTeamStore.setState({
      teams: snapshot.stores.teams,
      currentTeamId: snapshot.stores.teamCurrentId,
    });

    usePlayerStore.setState({
      players: snapshot.stores.players,
    });

    useGameStore.setState({
      games: snapshot.stores.games,
    });

    useSetStore.setState({
      sets: snapshot.stores.sets,
    });

    // Force persistence flush to ensure data is saved
    await AsyncStorage.flushGetRequests();

    console.log(`Successfully loaded snapshot: ${snapshot.metadata.name}`);
  } catch (error) {
    console.error("Error loading snapshot:", error);
    throw new Error(`Failed to load snapshot: ${error}`);
  }
}

/**
 * Lists all saved snapshots
 */
export async function listSnapshots(): Promise<SavedSnapshotInfo[]> {
  const registry = await getSnapshotRegistry();

  // Validate that files still exist and update registry if needed
  const validatedRegistry: SavedSnapshotInfo[] = [];
  let needsUpdate = false;

  for (const snapshot of registry) {
    const fileInfo = await FileSystem.getInfoAsync(snapshot.filePath);
    if (fileInfo.exists) {
      validatedRegistry.push(snapshot);
    } else {
      needsUpdate = true;
      console.warn(`Snapshot file not found: ${snapshot.filePath}`);
    }
  }

  if (needsUpdate) {
    await updateSnapshotRegistry(validatedRegistry);
  }

  return validatedRegistry;
}

/**
 * Deletes a snapshot file and removes from registry
 */
export async function deleteSnapshot(
  snapshotInfo: SavedSnapshotInfo,
): Promise<void> {
  try {
    // Delete file
    const fileInfo = await FileSystem.getInfoAsync(snapshotInfo.filePath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(snapshotInfo.filePath);
    }

    // Remove from registry
    const registry = await getSnapshotRegistry();
    const updatedRegistry = registry.filter((s) => s.id !== snapshotInfo.id);
    await updateSnapshotRegistry(updatedRegistry);

    console.log(`Deleted snapshot: ${snapshotInfo.name}`);
  } catch (error) {
    console.error("Error deleting snapshot:", error);
    throw new Error(`Failed to delete snapshot: ${error}`);
  }
}

/**
 * Exports a snapshot file for sharing
 */
export async function exportSnapshot(
  snapshotInfo: SavedSnapshotInfo,
): Promise<void> {
  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(snapshotInfo.filePath, {
        mimeType: "application/json",
        dialogTitle: `Export ${snapshotInfo.name} Snapshot`,
      });
    } else {
      throw new Error("Sharing is not available on this platform");
    }
  } catch (error) {
    console.error("Error exporting snapshot:", error);
    throw new Error(`Failed to export snapshot: ${error}`);
  }
}

/**
 * Quick save current state with auto-generated name
 */
export async function quickSave(
  description?: string,
): Promise<SavedSnapshotInfo> {
  const timestamp = new Date();
  const name = `QuickSave_${timestamp.toLocaleDateString()}_${timestamp.toLocaleTimeString().replace(/[:.]/g, "-")}`;

  const snapshot = await captureSnapshot();
  return await saveSnapshot(name, snapshot, description || "Quick save");
}

/**
 * Gets a summary of current store data for display
 */
export function getStoreSummary(): {
  teams: number;
  players: number;
  games: number;
  sets: number;
  finishedGames: number;
} {
  const teamState = useTeamStore.getState();
  const playerState = usePlayerStore.getState();
  const gameState = useGameStore.getState();
  const setState = useSetStore.getState();

  const games = Object.values(gameState.games);
  const finishedGames = games.filter((game) => game.isFinished).length;

  return {
    teams: Object.keys(teamState.teams).length,
    players: Object.keys(playerState.players).length,
    games: Object.keys(gameState.games).length,
    sets: Object.keys(setState.sets).length,
    finishedGames,
  };
}
