import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Team Info",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
