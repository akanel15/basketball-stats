import { useLayoutEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlayerStore } from "@/store/playerStore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { theme } from "@/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PlayerImage } from "@/components/PlayerImage";
import { Stat } from "@/types/stats";
import { useGameStore } from "@/store/gameStore";
import { useTeamStore } from "@/store/teamStore";
import { Result } from "@/types/player";
import { router } from "expo-router";
import { StatCard } from "@/components/shared/StatCard";
import { PlayerGameItem } from "@/components/shared/PlayerGameItem";
import { RecordBadge } from "@/components/shared/RecordBadge";
import { ViewAllButton } from "@/components/shared/ViewAllButton";
import { EmptyStateText } from "@/components/shared/EmptyStateText";
import { BaskitballImage } from "@/components/BaskitballImage";

export default function PlayerPage() {
  const { playerId } = useRoute().params as { playerId: string };
  const navigation = useNavigation();
  const players = usePlayerStore((state) => state.players);
  const deletePlayer = usePlayerStore((state) => state.removePlayer);
  const teams = useTeamStore((state) => state.teams);
  const games = useGameStore((state) => state.games);

  const player = players[playerId];
  const playerName = player?.name || "Player";
  const firstName =
    playerName.substring(0, playerName.indexOf(" ")) || "Player";

  const team = teams[player?.teamId || ""];
  const gameList = Object.values(games);
  const playerGames = gameList.filter(
    (game) => game.boxScore[playerId] !== undefined,
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeletePlayer = () => {
    Alert.alert(
      `${firstName} will be removed`,
      "All their stats will be lost",
      [
        {
          text: "Yes",
          onPress: () => {
            deletePlayer(playerId);
            navigation.goBack();
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: playerName,
      headerRight: () => (
        <Pressable hitSlop={20} onPress={handleDeletePlayer}>
          <FontAwesome5
            name="trash-alt"
            size={24}
            color={theme.colorOrangePeel}
          />
        </Pressable>
      ),
    });
  });

  const getMainStats = () => {
    const divisor = player.gameNumbers.gamesPlayed || 1;
    return (
      <>
        <StatCard
          value={(player.stats[Stat.Points] / divisor).toFixed(1)}
          label="Points"
        />
        <StatCard
          value={(player.stats[Stat.Assists] / divisor).toFixed(1)}
          label="Assists"
        />
        <StatCard
          value={(
            (player.stats[Stat.DefensiveRebounds] +
              player.stats[Stat.OffensiveRebounds]) /
            divisor
          ).toFixed(1)}
          label="Rebounds"
        />
        <StatCard
          value={(player.stats[Stat.Steals] / divisor).toFixed(1)}
          label="Steals"
        />
        <StatCard
          value={(player.stats[Stat.Blocks] / divisor).toFixed(1)}
          label="Blocks"
        />
        <StatCard
          value={(player.stats[Stat.Turnovers] / divisor).toFixed(1)}
          label="Turnovers"
        />
      </>
    );
  };

  const getExpandedStats = () => {
    const divisor = player.gameNumbers.gamesPlayed || 1;
    return (
      <>
        <StatCard
          value={(
            (player.stats[Stat.TwoPointMakes] +
              player.stats[Stat.ThreePointMakes]) /
            divisor
          ).toFixed(1)}
          label="FGM"
        />
        <StatCard
          value={(
            (player.stats[Stat.TwoPointAttempts] +
              player.stats[Stat.ThreePointAttempts]) /
            divisor
          ).toFixed(1)}
          label="FGA"
        />
        <StatCard
          value={
            (
              ((player.stats[Stat.TwoPointMakes] +
                player.stats[Stat.ThreePointMakes]) /
                (player.stats[Stat.TwoPointAttempts] +
                  player.stats[Stat.ThreePointAttempts])) *
              100
            ).toFixed(1) + "%"
          }
          label="FG%"
        />
        <StatCard
          value={(player.stats[Stat.TwoPointMakes] / divisor).toFixed(1)}
          label="2PM"
        />
        <StatCard
          value={(player.stats[Stat.TwoPointAttempts] / divisor).toFixed(1)}
          label="2PA"
        />
        <StatCard
          value={
            (
              (player.stats[Stat.TwoPointMakes] /
                player.stats[Stat.TwoPointAttempts]) *
              100
            ).toFixed(1) + "%"
          }
          label="2P%"
        />
        <StatCard
          value={(player.stats[Stat.ThreePointMakes] / divisor).toFixed(1)}
          label="3PM"
        />
        <StatCard
          value={(player.stats[Stat.ThreePointAttempts] / divisor).toFixed(1)}
          label="3PA"
        />
        <StatCard
          value={
            (
              (player.stats[Stat.ThreePointMakes] /
                player.stats[Stat.ThreePointAttempts]) *
              100
            ).toFixed(1) + "%"
          }
          label="3P%"
        />
        <StatCard
          value={(player.stats[Stat.FreeThrowsMade] / divisor).toFixed(1)}
          label="FTM"
        />
        <StatCard
          value={(player.stats[Stat.FreeThrowsAttempted] / divisor).toFixed(1)}
          label="FTA"
        />
        <StatCard
          value={
            (
              (player.stats[Stat.FreeThrowsMade] /
                player.stats[Stat.FreeThrowsAttempted]) *
              100
            ).toFixed(1) + "%"
          }
          label="FT%"
        />
        <StatCard
          value={(player.stats[Stat.OffensiveRebounds] / divisor).toFixed(1)}
          label="Off Rebs"
        />
        <StatCard
          value={(player.stats[Stat.DefensiveRebounds] / divisor).toFixed(1)}
          label="Def Rebs"
        />
        <StatCard
          value={(player.stats[Stat.FoulsCommitted] / divisor).toFixed(1)}
          label="Fouls"
        />
      </>
    );
  };

  const renderRecentGames = () => {
    if (playerGames.length === 0) {
      return (
        <EmptyStateText message="No games played yet.\nJoin a game to start tracking stats!" />
      );
    }

    return playerGames.slice(0, 3).map((game) => {
      const playerGameStats = game.boxScore[playerId];
      const playerPoints = playerGameStats?.[Stat.Points] || 0;
      const playerAssists = playerGameStats?.[Stat.Assists] || 0;
      const playerRebounds =
        (playerGameStats?.[Stat.OffensiveRebounds] || 0) +
        (playerGameStats?.[Stat.DefensiveRebounds] || 0);

      return (
        <PlayerGameItem
          key={game.id}
          opponent={`vs ${game.opposingTeamName}`}
          score={`${game.statTotals[0][Stat.Points]} - ${game.statTotals[1][Stat.Points]}`}
          result={
            game.statTotals[0][Stat.Points] > game.statTotals[1][Stat.Points]
              ? Result.Win
              : game.statTotals[0][Stat.Points] <
                  game.statTotals[1][Stat.Points]
                ? Result.Loss
                : Result.Draw
          }
          playerStats={{
            points: playerPoints,
            assists: playerAssists,
            rebounds: playerRebounds,
          }}
        />
      );
    });
  };

  const handleTeamPress = () => {
    if (team) {
      router.push(`/(tabs)/${team.id}`);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={[styles.centered, styles.topBanner]}>
        <PlayerImage player={player} size={150} />
        <RecordBadge
          wins={player.gameNumbers.wins}
          losses={player.gameNumbers.losses}
          draws={player.gameNumbers.draws}
          label="Record"
        />
      </View>

      <View style={styles.padding}>
        {/* Player Stats */}
        <View style={styles.section}>
          <View style={styles.statsHeader}>
            <Text style={styles.sectionTitle}>Player Stats</Text>
            <TouchableOpacity style={styles.expandBtn} onPress={toggleExpanded}>
              <Text style={styles.expandText}>
                {isExpanded ? "Less" : "More"}
              </Text>
              <Text style={styles.expandArrow}>{isExpanded ? "▲" : "▼"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            {getMainStats()}
            {isExpanded && getExpandedStats()}
          </View>
        </View>

        {/* Team Information */}
        {team && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team</Text>
            <TouchableOpacity style={styles.teamCard} onPress={handleTeamPress}>
              <View style={styles.teamInfo}>
                <View style={styles.teamAvatar}>
                  <BaskitballImage size={50} imageUri={team.imageUri} />
                </View>
                <View style={styles.teamDetails}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <Text style={styles.teamRecord}>
                    {team.gameNumbers.wins}-{team.gameNumbers.losses}-
                    {team.gameNumbers.draws} Record
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Games</Text>
          <View style={styles.recentGames}>{renderRecentGames()}</View>
          <ViewAllButton
            text="View All Games"
            onPress={() => router.navigate("/games")}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ marginBottom: 100 }} />
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  centered: {
    alignItems: "center",
    marginBottom: 24,
    padding: 24,
  },
  topBanner: {
    backgroundColor: theme.colorOnyx,
  },
  padding: {
    padding: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colorOnyx,
    marginBottom: 15,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  expandBtn: {
    backgroundColor: theme.colorBlue,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  expandText: {
    color: theme.colorWhite,
    fontSize: 12,
    fontWeight: "600",
  },
  expandArrow: {
    color: theme.colorWhite,
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: theme.colorWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  teamAvatar: {
    width: 50,
    height: 50,
    backgroundColor: theme.colorOrangePeel,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    fontWeight: "600",
    fontSize: 16,
    color: theme.colorOnyx,
    marginBottom: 2,
  },
  teamRecord: {
    fontSize: 12,
    color: theme.colorGrey,
    fontWeight: "500",
  },
  recentGames: {
    backgroundColor: theme.colorWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colorLightGrey,
  },
});
