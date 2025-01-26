import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { theme } from "@/theme";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Select Team",
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
        name="(tabs)"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
  );
}
