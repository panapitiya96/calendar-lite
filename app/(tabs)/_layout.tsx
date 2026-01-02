import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
      <Tabs.Screen name="agenda" options={{ title: "Agenda" }} />
    </Tabs>
  );
}
