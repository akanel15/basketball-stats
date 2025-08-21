import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { theme } from "@/theme";
import { BackToTeamsButton } from "@/components/BackToTeamsButton";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Games",
          headerLeft: () => <BackToTeamsButton />,
          headerRight: () => (
            <Link href="/games/newGame" asChild>
              <Pressable hitSlop={20}>
                <AntDesign
                  name="pluscircleo"
                  size={24}
                  color={theme.colorOrangePeel}
                />
              </Pressable>
            </Link>
          ),
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="newGame"
        options={{ title: "New Game" }}
      ></Stack.Screen>
      <Stack.Screen
        name="[gameId]"
        options={{
          title: "Game Info",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
