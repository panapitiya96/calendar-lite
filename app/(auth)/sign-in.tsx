import { useState } from "react";
import { Alert, Platform, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "../../lib/supabase";

function notify(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Always-visible messages (works everywhere)
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [infoMsg, setInfoMsg] = useState<string>("");

  const cleanEmail = (v: string) => v.trim().toLowerCase();

  const validate = () => {
    const e = cleanEmail(email);
    if (!e || !e.includes("@")) return "Please enter a valid email address.";
    if (!password || password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const signIn = async () => {
    setErrorMsg("");
    setInfoMsg("");

    const v = validate();
    if (v) {
      setErrorMsg(v);
      notify("Fix this", v);
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail(email),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        notify("Sign in failed", error.message);
      } else {
        setInfoMsg("Signed in!");
      }
    } finally {
      setBusy(false);
    }
  };

  const signUp = async () => {
    setErrorMsg("");
    setInfoMsg("");

    const v = validate();
    if (v) {
      setErrorMsg(v);
      notify("Fix this", v);
      return;
    }

    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail(email),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        notify("Sign up failed", error.message);
        return;
      }

      // If email confirmation is enabled in Supabase, session may be null
      if (!data.session) {
        const msg = "Your account was created. Please check your email to confirm, then sign in.";
        setInfoMsg(msg);
        notify("Check your email", msg);
        return;
      }

      setInfoMsg("Account created and signed in!");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12, maxWidth: 420 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Sign in</Text>

      {!!errorMsg && (
        <Text style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}>
          ❌ {errorMsg}
        </Text>
      )}

      {!!infoMsg && (
        <Text style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}>
          ✅ {infoMsg}
        </Text>
      )}

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Password (min 6 chars)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <Pressable
        disabled={busy}
        onPress={signIn}
        style={{ padding: 12, borderWidth: 1, borderRadius: 8, opacity: busy ? 0.6 : 1 }}
      >
        <Text>{busy ? "Please wait..." : "Sign in"}</Text>
      </Pressable>

      <Pressable
        disabled={busy}
        onPress={signUp}
        style={{ padding: 12, borderWidth: 1, borderRadius: 8, opacity: busy ? 0.6 : 1 }}
      >
        <Text>{busy ? "Please wait..." : "Create account"}</Text>
      </Pressable>
    </View>
  );
}
