import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Link, router, Stack } from "expo-router";
import { ForgotPasswordStyles } from "../../interfaces/StyleInterface";
import withValidation from "../FormValidation";
import { z } from "zod";
import { toast } from "react-toastify";

interface ForgotPasswordUIProps {
  styles: ForgotPasswordStyles;
  formData: { [key: string]: any };
  error: string;
  handleChange: (field: string, value: any) => void;
  handleSubmit: () => void;
}

const ForgotPasswordUI: React.FC<ForgotPasswordUIProps> = ({
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
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          keyboardType="email-address"
          accessibilityLabel="Email Input"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Reset Password" onPress={handleSubmit} />
        <Link href={"/Login"} style={styles.link}>
          <Text>Back to Login</Text>
        </Link>
      </View>
    </View>
  );
};

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

const ForgotPasswordUIWithValidation = withValidation(ForgotPasswordUI);

export default (
  props: Omit<ForgotPasswordUIProps, "styles"> & {
    styles?: ForgotPasswordStyles;
  }
) => (
  <ForgotPasswordUIWithValidation
    {...props}
    schema={forgotPasswordSchema}
    initialData={{ email: "" }}
    onSubmit={(data) => {
      toast.success("Password reset link sent!");
      console.log("Forgot Password data:", data);
      router.replace("/Login");
    }}
  />
);
