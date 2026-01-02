import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/auth/AuthProvider";

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (session) return <Redirect href="/(tabs)/calendar" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
