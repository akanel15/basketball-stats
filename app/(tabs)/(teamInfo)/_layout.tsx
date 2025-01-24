import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { theme } from "@/theme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Team Info",
          headerRight: () => (
            <Link href="/newTeam" asChild>
              <Pressable hitSlop={20}>
                <FontAwesome6
                  name="arrows-rotate"
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
    </Stack>
  );
}
