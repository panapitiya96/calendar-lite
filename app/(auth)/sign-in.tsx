import { Redirect } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // quick session check
  supabase.auth.getSession().then(({ data }) => {
    if (!sessionChecked) {
      setHasSession(!!data.session);
      setSessionChecked(true);
    }
  });

  if (sessionChecked && hasSession) return <Redirect href="/(tabs)/calendar" />;

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert("Sign in failed", error.message);
    else setHasSession(true);
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert("Sign up failed", error.message);
    else Alert.alert("Success", "Account created. You can sign in now.");
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Sign in</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <Pressable onPress={signIn} style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}>
        <Text>Sign in</Text>
      </Pressable>

      <Pressable onPress={signUp} style={{ padding: 12, borderWidth: 1, borderRadius: 8 }}>
        <Text>Create account</Text>
      </Pressable>
    </View>
  );
}
