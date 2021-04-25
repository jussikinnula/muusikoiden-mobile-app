import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserScreen from '../screens/UserScreen';
import { UserParamList } from '../types';

const UserStack = createStackNavigator<UserParamList>();

const UserNavigator: FC = () => (
  <UserStack.Navigator>
    <UserStack.Screen
      name="UserScreen"
      component={UserScreen}
      options={{ headerTitle: 'Käyttäjä' }}
    />
  </UserStack.Navigator>
);

export default UserNavigator;
