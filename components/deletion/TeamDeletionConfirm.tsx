import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "@/theme";
import { CascadeDeletionInfo, cascadeDeleteTeam } from "@/utils/cascadeDelete";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type TeamDeletionConfirmProps = {
  visible: boolean;
  teamId: string;
  teamName: string;
  deletionInfo: CascadeDeletionInfo;
  onCancel: () => void;
  onConfirm: () => void;
};

export function TeamDeletionConfirm({
  visible,
  teamId,
  teamName,
  deletionInfo,
  onCancel,
  onConfirm,
}: TeamDeletionConfirmProps) {
  const totalItems =
    deletionInfo.games.length +
    deletionInfo.players.length +
    deletionInfo.sets.length;

  const handleConfirmDeletion = () => {
    cascadeDeleteTeam(teamId);
    onConfirm();
  };

  const renderSection = (
    title: string,
    items: { id: string; name: string }[],
    icon: string,
  ) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome5 name={icon} size={16} color={theme.colorOrangePeel} />
          <Text style={styles.sectionTitle}>
            {title} ({items.length})
          </Text>
        </View>
        {items.map((item) => (
          <Text key={item.id} style={styles.itemText}>
            • {item.name}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <FontAwesome5
              name="exclamation-triangle"
              size={24}
              color={theme.colorOrangePeel}
            />
            <Text style={styles.title}>Delete {teamName}?</Text>
          </View>

          {totalItems > 0 ? (
            <>
              <Text style={styles.warning}>
                This will permanently delete the team and any associated data.
                This action cannot be undone.
              </Text>

              <Text style={styles.cascadeTitle}>
                The following items will also be removed:
              </Text>

              <ScrollView style={styles.content}>
                {renderSection("Players", deletionInfo.players, "user")}
                {renderSection("Games", deletionInfo.games, "basketball-ball")}
                {renderSection("Sets", deletionInfo.sets, "clipboard-list")}
              </ScrollView>
            </>
          ) : (
            <>
              <Text style={styles.warning}>
                This will permanently delete the team and any associated data.
                This action cannot be undone.
              </Text>
              <Text style={styles.safeMessage}>
                No related data found. The team can be safely deleted.
              </Text>
            </>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleConfirmDeletion}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: theme.colorWhite,
    borderRadius: 16,
    padding: 24,
    maxHeight: "80%",
    width: "100%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colorOnyx,
    flex: 1,
  },
  warning: {
    fontSize: 16,
    color: theme.colorOnyx,
    marginBottom: 20,
    lineHeight: 22,
  },
  content: {
    maxHeight: 300,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colorOnyx,
  },
  itemText: {
    fontSize: 14,
    color: theme.colorGrey,
    marginLeft: 24,
    marginBottom: 4,
  },
  cascadeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colorOnyx,
    marginBottom: 20,
  },
  safeMessage: {
    fontSize: 16,
    color: theme.colorGrey,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colorLightGrey,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colorOnyx,
  },
  deleteButton: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colorOrangePeel,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colorWhite,
  },
});
