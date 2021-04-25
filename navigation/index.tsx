import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ColorSchemeName } from 'react-native';
import LinkingConfiguration from './LinkingConfiguration';
import RootNavigator from './RootNavigator';

interface NavigationProps {
  colorScheme: ColorSchemeName;
}

const Navigation: React.FC<NavigationProps> = ({ colorScheme }) => (
  <NavigationContainer
    linking={LinkingConfiguration}
    theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <RootNavigator />
  </NavigationContainer>
);

export default Navigation;
