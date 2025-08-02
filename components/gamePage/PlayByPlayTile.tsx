import { usePlayerStore } from "@/store/playerStore";
import { PlayByPlayType } from "@/types/game";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { theme } from "@/theme";
import { useRef } from "react";

interface PlayByPlayTileProps {
  play: PlayByPlayType;
  teamScore?: number;
  opponentScore?: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function PlayByPlayTile({
  play,
  teamScore,
  opponentScore,
  isSelected,
  onSelect,
  onDelete,
}: PlayByPlayTileProps) {
  const players = usePlayerStore((state) => state.players);

  const isOpponent = play.playerId === "Opponent";
  const player = isOpponent ? null : players[play.playerId];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          // Swipe right detected
          onSelect();
        }
      },
    }),
  ).current;

  return (
    <View {...panResponder.panHandlers}>
      <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
        <View
          style={[
            styles.container,
            isOpponent ? styles.opponentBackground : styles.playerBackground,
            isSelected && styles.selectedBackground,
          ]}
        >
          <Text style={[styles.playerInfo, isOpponent && styles.opponentText]}>
            {isOpponent ? "Opponent" : `${player?.name} (#${player?.number})`}
          </Text>

          <Text
            style={[
              styles.action,
              teamScore || opponentScore ? styles.boldText : null,
            ]}
          >
            {play.action}
          </Text>

          <Text style={styles.score}>
            {teamScore !== undefined && opponentScore !== undefined ? (
              <>
                <Text style={!isOpponent ? styles.boldText : null}>
                  {teamScore}
                </Text>
                <Text>{` ${teamScore !== undefined && opponentScore !== undefined ? "-" : ""} `}</Text>
                <Text style={isOpponent ? styles.boldText : null}>
                  {opponentScore}
                </Text>
              </>
            ) : (
              ""
            )}
          </Text>

          {isSelected && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: theme.colorLightGrey,
    width: 370,
  },
  playerInfo: {
    width: 150,
    fontSize: 14,
    fontWeight: "600",
  },
  opponentText: {
    color: theme.colorRedCrayola,
  },
  action: {
    flex: 1,
    fontSize: 14,
    width: 110,
  },
  boldText: {
    fontWeight: "bold",
  },
  score: {
    width: 72,
    fontSize: 16,
    textAlign: "right",
    color: theme.colorBlack,
    flexDirection: "row",
  },
  opponentBackground: {
    backgroundColor: theme.colorLightGrey,
  },
  playerBackground: {
    backgroundColor: theme.colorWhite,
  },
  selectedBackground: {
    backgroundColor: theme.colorMayaBlue,
    borderLeftWidth: 4,
    borderLeftColor: theme.colorOrangePeel,
  },
  deleteButton: {
    backgroundColor: theme.colorRedCrayola,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: theme.colorWhite,
    fontSize: 12,
    fontWeight: "600",
  },
});
