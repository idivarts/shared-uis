import React, { useState } from "react";
import { Link, Stack } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

type styles = {
  container: any;
  logo: any;
  formContainer: any;
  title: any;
  input: any;
  error: any;
  link: any;
  linksContainer: any;
};

interface LoginUIProps {
  styles: styles;
}

const LoginUI: React.FC<LoginUIProps> = ({ styles }) => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const handleLogin = () => {
    if (!emailOrUsername && !password) {
      setError("Email and Password are required");
      return;
    }
    if (!emailOrUsername) {
      setError("Email or Username is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");
    router.replace("/Dashboard");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.logo}>Your Logo</Text>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
          keyboardType="email-address"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
        <View style={styles.linksContainer}>
          <Link href={"/Signup"}>
            <Text style={styles.link}>Don't have an account? Signup</Text>
          </Link>
          <Link href={"/ForgotPassword"} style={styles.link}>
            <Text>Forgot Password?</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default LoginUI;
