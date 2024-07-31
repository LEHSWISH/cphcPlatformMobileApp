import React, {useCallback} from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/core';
import HomeFragmentStack from '../stack/HomeFragmentStack';
import Tracker from '../../screens/Tracker/Tracker';
import Vitals from '../../screens/Vitals/Vitals';
import {getTabIcon} from './tabIcons';
import {Colors} from '../../styles';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {screenNameListToHideTabNavigation} from '../navigationConfig';

export enum TabNameEnum {
  HOME = 'HOME',
  TRACKING = 'TRACKING',
  VITALS = 'VITALS',
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const getTabNavigatorScreenOptions = useCallback(
    ({
      route,
    }: {
      route: RouteProp<ParamListBase>;
      navigation: any;
    }): BottomTabNavigationOptions => {
      const currentScreenName = getFocusedRouteNameFromRoute(route);
      const isTabHidden = screenNameListToHideTabNavigation.includes(
        currentScreenName || '',
      );
      return {
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.variable.primary,
        tabBarInactiveTintColor: Colors.variable.blackTextColor,
        tabBarStyle: {display: isTabHidden ? 'none' : 'flex'},
      };
    },
    [],
  );

  return (
    <Tab.Navigator screenOptions={getTabNavigatorScreenOptions}>
      <Tab.Screen
        name="HomeFragment"
        component={HomeFragmentStack}
        options={{
          headerShown: false,
          tabBarIcon: getTabIcon(TabNameEnum.HOME),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Tracking"
        component={Tracker}
        options={{
          tabBarIcon: getTabIcon(TabNameEnum.TRACKING),
          tabBarLabel: 'Tracking',
        }}
      />
      <Tab.Screen
        name="Vitals"
        component={Vitals}
        options={{
          tabBarIcon: getTabIcon(TabNameEnum.VITALS),
          tabBarLabel: 'Vitals',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
