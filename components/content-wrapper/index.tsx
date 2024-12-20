import { PropsWithChildren } from "react";
import { Theme } from "@react-navigation/native";

import { Text, View } from "../theme/Themed";
import Colors from "../../constants/Colors";

interface ContentWrapperProps extends PropsWithChildren {
  description?: string;
  rightText?: string;
  title?: string;
  theme: Theme;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  description,
  rightText,
  title,
  theme,
}) => {
  return (
    <View
      style={{
        gap: 12,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {
          title && (
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {title}
            </Text>
          )
        }
        {
          rightText && (
            <Text>
              {rightText}
            </Text>
          )
        }
      </View>
      {children}
      {
        description && (
          <Text
            style={{
              fontSize: 14,
              color: theme.dark ? Colors(theme).text : Colors(theme).gray300,
            }}
          >
            {description}
          </Text>
        )
      }
    </View>
  );
};

export default ContentWrapper;
