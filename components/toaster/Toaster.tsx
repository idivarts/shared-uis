import Toast from "react-native-toast-message";

class Toaster {
  public static success(title: string = "", description: string = "") {
    Toast.show({
      type: "success",
      text1: title,
      text2: description,
      text1Style: {
        fontSize: 14,
      },
      text2Style: {
        fontSize: 12,
      },
    });
  }

  public static error(title: string, description: string) {
    Toast.show({
      type: "error",
      text1: title,
      text2: description,
      text1Style: {
        fontSize: 14,
      },
      text2Style: {
        fontSize: 12,
      },
    });
  }

  public static info(title: string, description: string) {
    Toast.show({
      type: "info",
      text1: title,
      text2: description,
      text1Style: {
        fontSize: 14,
      },
      text2Style: {
        fontSize: 12,
      },
    });
  }

  public static warning(title: string, description: string) {
    Toast.show({
      type: "warning",
      text1: title,
      text2: description,
      text1Style: {
        fontSize: 14,
      },
      text2Style: {
        fontSize: 12,
      },
    });
  }
}

export default Toaster;
