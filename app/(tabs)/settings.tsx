import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../src/auth/AuthProvider";

function notify(message: string) {
  // Alert.alert isn't reliable on web, so do this:
  if (Platform.OS === "web") {
    window.alert(message);
  } else {
    // for mobile we keep it simple without Alert dependency
    // (you can add Alert later if you want)
    console.log(message);
  }
}

export default function SettingsScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string>("");

  const signOut = async () => {
    setBusy(true);
    setStatus("Signing out...");

    try {
      // Try global sign out (revokes tokens if possible)
      const { error } = await supabase.auth.signOut();

      // Always clear local storage too (fixes "session missing" + web weirdness)
      await supabase.auth.signOut({ scope: "local" });

      if (error) {
        setStatus(`Sign out warning: ${error.message}`);
        notify(`Sign out warning: ${error.message}`);
      } else {
        setStatus("Signed out");
      }

      // Force navigation to auth screen (web sometimes needs this)
      router.replace("/(auth)/sign-in");
    } catch (e: any) {
      // Still ensure local signout
      await supabase.auth.signOut({ scope: "local" });
      setStatus(`Sign out failed: ${e?.message ?? "Unknown error"}`);
      notify(`Sign out failed: ${e?.message ?? "Unknown error"}`);
      router.replace("/(auth)/sign-in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Settings</Text>

      {/* Debug info so we know web session state */}
      <Text selectable style={{ opacity: 0.8 }}>
        Signed in as: {session?.user?.email ?? "(no session)"}
      </Text>

      {!!status && <Text style={{ opacity: 0.8 }}>{status}</Text>}

      <Pressable
        disabled={busy}
        onPress={signOut}
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          opacity: busy ? 0.6 : 1,
        }}
      >
        <Text>{busy ? "Signing out..." : "Sign out"}</Text>
      </Pressable>
    </View>
  );
}
