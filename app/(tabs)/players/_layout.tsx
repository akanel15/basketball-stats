import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { theme } from "@/theme";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Players",
          headerRight: () => (
            <Link href="/players/newPlayer" asChild>
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
        name="newPlayer"
        options={{ title: "New Player" }}
      ></Stack.Screen>
      <Stack.Screen
        name="[playerId]"
        options={{
          title: "My Player",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
