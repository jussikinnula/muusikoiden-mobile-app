import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import { MarketplaceParamList } from '../types';

const MarketplaceStack = createStackNavigator<MarketplaceParamList>();

const MarketplaceNavigator: FC = () => (
  <MarketplaceStack.Navigator>
    <MarketplaceStack.Screen
      name="MarketplaceScreen"
      component={MarketplaceScreen}
      options={{ headerTitle: 'Tori' }}
    />
  </MarketplaceStack.Navigator>
);

export default MarketplaceNavigator;
