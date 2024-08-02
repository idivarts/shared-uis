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

type Styles = {
  container: any;
  logo: any;
  formContainer: any;
  title: any;
  input: any;
  error: any;
  link: any;
};

interface ForgotPasswordUIProps {
  styles: Styles;
}

const ForgotPasswordUI: React.FC<ForgotPasswordUIProps> = ({ styles }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleForgotPassword = () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    router.push("/Login");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.logo}>Your Logo</Text>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Reset Password" onPress={handleForgotPassword} />
        <Link href={"/Login"} style={styles.link}>
          <Text>Back to Login</Text>
        </Link>
      </View>
    </View>
  );
};

export default ForgotPasswordUI;
