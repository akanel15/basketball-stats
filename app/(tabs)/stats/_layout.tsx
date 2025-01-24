import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Stats Page",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
