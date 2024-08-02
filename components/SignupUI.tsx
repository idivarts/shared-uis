import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Link, router, Stack } from "expo-router";

type styles = {
  container: any;
  logo: any;
  formContainer: any;
  title: any;
  input: any;
  error: any;
  link: any;
};

interface SignupUIProps {
  styles: styles;
}

const SignupUI: React.FC<SignupUIProps> = ({ styles }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isWorkEmail = (email: string) => {
    const personalEmailDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];
    const domain = email.split("@")[1];
    return !personalEmailDomains.includes(domain);
  };

  const handleSignup = () => {
    if (!email && !password) {
      setError("Email and Password are required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!isWorkEmail(email)) {
      setError("Please use your work email");
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
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Work Email"
          value={email}
          onChangeText={setEmail}
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
        <Button title="Sign Up" onPress={handleSignup} />
        <Link href={"/Login"} style={styles.link}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </Link>
      </View>
    </View>
  );
};

export default SignupUI;
