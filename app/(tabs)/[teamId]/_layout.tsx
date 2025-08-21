import { Stack } from "expo-router";
import { BackToTeamsButton } from "@/components/BackToTeamsButton";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Team Info",
          headerLeft: () => <BackToTeamsButton />,
        }}
      ></Stack.Screen>
    </Stack>
  );
}
