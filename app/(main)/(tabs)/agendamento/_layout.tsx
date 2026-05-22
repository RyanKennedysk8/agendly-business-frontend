import { Stack } from 'expo-router';
import { CustomHeader } from '@components/layout/header/orquestrador/CustomHeader';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props: NativeStackHeaderProps) => <CustomHeader {...props} />,
      }}
    > 
      <Stack.Screen
        name="index" 
        options={{ headerShown: true }} 
      /> 
    </Stack>
  );
}