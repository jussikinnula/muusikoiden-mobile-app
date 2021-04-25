import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styled from 'styled-components/native';

import MarketplaceNavigator from './MarketplaceNavigator';
import SearchNavigator from './SearchNavigator';
import UserNavigator from './UserNavigator';

import { BottomTabParamList } from '../types';

import BookIcon from '../assets/icons/Book.svg';
import SearchIcon from '../assets/icons/Search.svg';
import ProfileIcon from '../assets/icons/Profile.svg';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: FC = () => (
  <BottomTab.Navigator
    initialRouteName="Marketplace"
    tabBarOptions={{ activeTintColor: '#ff0000' }}
  >
    <BottomTab.Screen
      name="Marketplace"
      component={MarketplaceNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <BookIcon width={size} height={size} fill={color} />
        ),
        tabBarLabel: 'Tori',
      }}
    />
    <BottomTab.Screen
      name="Search"
      component={SearchNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <SearchIcon width={size} height={size} fill={color} />
        ),
        tabBarLabel: 'Haku',
      }}
    />
    <BottomTab.Screen
      name="User"
      component={UserNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <ProfileIcon width={size} height={size} fill={color} />
        ),
        tabBarLabel: 'Käyttäjä',
      }}
    />
  </BottomTab.Navigator>
);

export default BottomTabNavigator;
