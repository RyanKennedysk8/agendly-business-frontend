import { NativeStackHeaderProps, Stack } from 'expo-router';
import { CustomHeader } from '@components/layout/header/orquestrador/CustomHeader';


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