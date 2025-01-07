import { Text, View } from "../theme/Themed";

interface MessageTopbarProps {
  actions?: React.ReactNode;
  description: string;
  rightAction?: React.ReactNode;
}

const MessageTopbar: React.FC<MessageTopbarProps> = ({
  actions,
  description,
  rightAction,
}) => {
  return (
    <View
      style={{
        gap: 6,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            flex: 1,
          }}
        >
          {description}
        </Text>
        {rightAction}
      </View>
      {actions}
    </View>
  );
};

export default MessageTopbar;
