import { View, Text, StyleSheet } from "react-native";
import { BaskitballButton } from "@/components/BaskitballButton";
import { GameStatButton } from "@/components/GameStatButton";
import { theme } from "@/theme";
import {
  ActionType,
  DefensiveStat,
  FoulTurnoverStat,
  ReboundAssistStat,
  ShootingStatMake,
  ShootingStatMiss,
} from "@/types/stats";

type StatOverlayProps = {
  onClose: () => void;
  onStatPress: (category: ActionType, action: string) => void;
};

export default function StatOverlay({ onClose, onStatPress }: StatOverlayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shooting</Text>
      <View style={styles.rowContainer}>
        {Object.values(ShootingStatMake).map(action => (
          <GameStatButton
            key={action}
            title={action}
            onPress={() => onStatPress(ActionType.ShootingMake, action)}
            backgroundColor={theme.colorMindaroGreen}
          />
        ))}
      </View>
      <View style={styles.rowContainer}>
        {Object.values(ShootingStatMiss).map(action => (
          <GameStatButton
            key={action}
            title={action}
            onPress={() => onStatPress(ActionType.ShootingMiss, action)}
            backgroundColor={theme.colorRedCrayola}
          />
        ))}
      </View>

      <Text style={styles.heading}>Assists + Rebs</Text>
      <View style={styles.rowContainer}>
        {Object.values(ReboundAssistStat).map(action => (
          <GameStatButton
            key={action}
            title={action}
            onPress={() => onStatPress(ActionType.ReboundAssist, action)}
            backgroundColor={theme.colorMayaBlue}
          />
        ))}
      </View>

      <Text style={styles.heading}>Defence</Text>
      <View style={styles.rowContainer}>
        {Object.values(DefensiveStat).map(action => (
          <GameStatButton
            key={action}
            title={action}
            onPress={() => onStatPress(ActionType.DefensivePlay, action)}
          />
        ))}
      </View>

      <Text style={styles.heading}>Fouls + TOs</Text>
      <View style={styles.rowContainer}>
        {Object.values(FoulTurnoverStat).map(action => (
          <GameStatButton
            key={action}
            title={action}
            onPress={() => onStatPress(ActionType.FoulTurnover, action)}
          />
        ))}
      </View>

      <BaskitballButton onPress={onClose} title="Close" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 6,
    marginBottom: 6,
    flexWrap: "wrap",
  },
});
