import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Link, router, Stack } from "expo-router";
import { SignupStyles } from "../../interfaces/StyleInterface";
import withValidation from "../FormValidation";
import { toast } from "react-toastify";
import { z } from "zod";

interface SignupUIProps {
  styles: SignupStyles;
  formData: { [key: string]: any };
  error: string;
  handleChange: (field: string, value: any) => void;
  handleSubmit: () => void;
}

const SignupUI: React.FC<SignupUIProps> = ({
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
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Work Email"
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          keyboardType="email-address"
          accessibilityLabel="Work Email Input"
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
        <Button title="Sign Up" onPress={handleSubmit} />
        <Link href={"/Login"} style={styles.link}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </Link>
      </View>
    </View>
  );
};

const signupSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email")
    .refine((email) => {
      const personalEmailDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
      ];
      const domain = email.split("@")[1];
      return !personalEmailDomains.includes(domain);
    }, "Please use your work email"),
  password: z.string().nonempty("Password is required"),
});

const SignupUIWithValidation = withValidation(SignupUI);

export default (
  props: Omit<SignupUIProps, "styles"> & { styles?: SignupStyles }
) => (
  <SignupUIWithValidation
    {...props}
    schema={signupSchema}
    initialData={{ email: "", password: "" }}
    onSubmit={(data) => {
      toast.success("Account created!");
      console.log("Signup data:", data);
      router.replace("/Dashboard");
    }}
  />
);
