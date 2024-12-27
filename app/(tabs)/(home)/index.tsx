import { TeamCard } from "@/components/TeamCard";
import { theme } from "@/theme";
import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function App() {
  const teams = [
    {
      id: 1,
      name: "Vikings",
      playerList: [],
    },
  ];
  return <TeamCard team={teams}></TeamCard>;
}
