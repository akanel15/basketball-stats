import { StyleSheet, View, Text, Pressable } from "react-native";
import { theme } from "@/theme";
import { Link } from "expo-router";
import { useTeamStore } from "@/store/teamStore";
import { GameType, Team } from "@/types/game";
import { Stat } from "@/types/stats";
//<PlayerImage game={game} size={80}></PlayerImage>

export function GameCard({ game }: { game: GameType }) {
  const teamList = useTeamStore((state) => state.teams);
  const ourTeam = teamList.find((team) => team.id === game.teamId);

  return (
    <Link href={`/games/${game.id}`} asChild>
      <Pressable style={styles.playerCard}>
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.playerName}>
            {ourTeam?.name} vs {game.opposingTeamName}
          </Text>
          <Text style={styles.subtitle}>
            {game.statTotals[Team.Us][Stat.Points]} -{" "}
            {game.statTotals[Team.Opponent][Stat.Points]}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  playerCard: {
    flexDirection: "row",
    shadowColor: theme.colorOnyx,
    backgroundColor: theme.colorWhite,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  details: {
    padding: 14,
    justifyContent: "center",
  },
  playerName: {
    fontSize: 18,
    marginBottom: 4,
    marginLeft: 8,
  },
  subtitle: {
    color: theme.colorGrey,
    marginLeft: 8,
  },
});
