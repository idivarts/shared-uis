import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Link, router, Stack } from "expo-router";
import { LoginStyles } from "../../interfaces/StyleInterface";
import withValidation from "../FormValidation";
import { z } from "zod";
import { toast } from "react-toastify";

interface LoginUIProps {
  styles: LoginStyles;
  formData: { [key: string]: any };
  error: string;
  handleChange: (field: string, value: any) => void;
  handleSubmit: () => void;
}

const LoginUI: React.FC<LoginUIProps> = ({
  styles,
  formData,
  error,
  handleChange,
  handleSubmit,
}) => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.logo}>Your Logo</Text>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          value={formData.emailOrUsername}
          onChangeText={(value) => handleChange("emailOrUsername", value)}
          keyboardType="email-address"
          accessibilityLabel="Email or Username Input"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={formData.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry
          accessibilityLabel="Password Input"
        />
        <Button title="Login" onPress={handleSubmit} />
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

const loginSchema = z.object({
  emailOrUsername: z.string().nonempty("Email or Username is required"),
  password: z.string().nonempty("Password is required"),
});

const LoginUIWithValidation = withValidation(LoginUI);

export default (props: Omit<LoginUIProps, "styles">) => (
  <LoginUIWithValidation
    {...props}
    schema={loginSchema}
    initialData={{ emailOrUsername: "", password: "" }}
    onSubmit={(data) => {
      toast.success("Login successful!");
      console.log("Login data:", data);
      router.replace("/dashboard/Campaign");
    }}
  />
);
