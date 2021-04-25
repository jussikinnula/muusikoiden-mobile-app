import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import { SearchParamList } from '../types';

const SearchStack = createStackNavigator<SearchParamList>();

const SearchNavigator: FC = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{ headerTitle: 'Haku' }}
    />
  </SearchStack.Navigator>
);

export default SearchNavigator;
