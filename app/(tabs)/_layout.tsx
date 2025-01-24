import { Tabs } from "expo-router";
import { theme } from "@/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colorOrangePeel }}>
      <Tabs.Screen
        name="(teamInfo)"
        options={{
          title: "Team info",
          tabBarShowLabel: true,
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="group" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: "Players",
          tabBarShowLabel: true,
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="group" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: "Games",
          tabBarShowLabel: true,
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="basketball" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarShowLabel: true,
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="basketball" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
