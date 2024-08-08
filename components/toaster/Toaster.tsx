import Toast from "react-native-toast-message";

export const showToast = (
  type = "success",
  title = "",
  description = "",
) => {
  Toast.show({
    type,
    text1: title,
    text2: description,
    text1Style: { fontSize: 14 },
    text2Style: { fontSize: 12 },
  });
};

class Toaster {
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
