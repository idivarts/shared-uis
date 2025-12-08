import { ColorsStatic } from "@/shared-uis/constants/Colors";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const styles = StyleSheet.create({
  glowWrapper: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  successGlow: {
    shadowColor: ColorsStatic.toastSuccess,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
  },
  errorGlow: {
    shadowColor: ColorsStatic.toastError,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
  },
  infoGlow: {
    shadowColor: ColorsStatic.toastInfo,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
  },
  warningGlow: {
    shadowColor: ColorsStatic.toastWarning,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  successContainer: {
    borderColor: ColorsStatic.toastSuccess,
  },
  errorContainer: {
    borderColor: ColorsStatic.toastError,
  },
  infoContainer: {
    borderColor: ColorsStatic.toastInfo,
  },
  warningContainer: {
    borderColor: ColorsStatic.toastWarning,
  },
  text: {
    color: ColorsStatic.toastText,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: ColorsStatic.toastText,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: ColorsStatic.toastText,
    opacity: 0.9,
  },
});

const toastConfig = {
  success: (props: any) => (
    <View style={[styles.glowWrapper, styles.successGlow]}>
      <View style={[styles.container, styles.successContainer, { backgroundColor: ColorsStatic.toastSuccessBg }]}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.description}>{props.text2}</Text>}
      </View>
    </View>
  ),
  error: (props: any) => (
    <View style={[styles.glowWrapper, styles.errorGlow]}>
      <View style={[styles.container, styles.errorContainer, { backgroundColor: ColorsStatic.toastErrorBg }]}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.description}>{props.text2}</Text>}
      </View>
    </View>
  ),
  info: (props: any) => (
    <View style={[styles.glowWrapper, styles.infoGlow]}>
      <View style={[styles.container, styles.infoContainer, { backgroundColor: ColorsStatic.toastInfoBg }]}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.description}>{props.text2}</Text>}
      </View>
    </View>
  ),
  warning: (props: any) => (
    <View style={[styles.glowWrapper, styles.warningGlow]}>
      <View style={[styles.container, styles.warningContainer, { backgroundColor: ColorsStatic.toastWarningBg }]}>
        <Text style={styles.title}>{props.text1}</Text>
        {props.text2 && <Text style={styles.description}>{props.text2}</Text>}
      </View>
    </View>
  ),
};

export const showToast = (
  type = "success",
  title = "",
  description = "",
) => {
  Toast.show({
    type,
    text1: title,
    text2: description,
  });
};

class Toaster {
  public static notification(title: string, description: string, onPress: Function) {
    Toast.show({
      type: "info",
      text1: title,
      text2: description,
      onPress: () => {
        onPress();
      }
    });
  }
  public static success(title: string = "", description: string = "") {
    showToast("success", title, description)
  }

  public static error(title: string = "", description: string = "") {
    showToast("error", title, description)
  }

  public static info(title: string = "", description: string = "") {
    showToast("info", title, description)
  }

  public static warning(title: string = "", description: string = "") {
    showToast("warning", title, description)
  }
}

export default Toaster;
export { toastConfig };
