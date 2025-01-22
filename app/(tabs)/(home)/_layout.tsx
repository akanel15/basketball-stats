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
          title: "My teams",
          headerRight: () => (
            <Link href="/newTeam" asChild>
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
        name="newTeam"
        options={{ title: "New team" }}
      ></Stack.Screen>
      <Stack.Screen
        name="[teamId]"
        options={{ title: "My team" }}
      ></Stack.Screen>
    </Stack>
  );
}
