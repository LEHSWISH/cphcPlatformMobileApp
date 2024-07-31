import React from 'react';
import {StyleSheet, View} from 'react-native';

import {
  HeartbeatActiveTabIcon,
  HeartbeatTabIcon,
  HomeTabActiveIcon,
  HomeTabIcon,
  MapTabActiveIcon,
  MapTabIcon,
} from '../../assets/images';
import {TabNameEnum} from './TabNavigator';
import {Colors} from '../../styles';

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  activeTabBarTopBorder: {
    width: 80,
    height: 4,
    position: 'absolute',
    backgroundColor: Colors.variable.primary,
    borderRadius: 5,
    top: -6,
    left: -28,
    right: '50%',
  },
});

export const getTabIcon = (tabName: TabNameEnum) => {
  switch (tabName) {
    case TabNameEnum.HOME:
      return RenderHomeTabIcon;
    case TabNameEnum.TRACKING:
      return RenderTrackingTabIcon;
    case TabNameEnum.VITALS:
      return RenderVitalsTabIcon;
  }
};

const RenderHomeTabIcon = ({
  focused,
}: {
  focused: boolean;
  color: string;
  size: number;
}) => {
  return focused ? (
    <View>
      <View style={styles.activeTabBarTopBorder} />
      <HomeTabActiveIcon style={styles.relative} />
    </View>
  ) : (
    <HomeTabIcon />
  );
};

const RenderTrackingTabIcon = ({
  focused,
}: {
  focused: boolean;
  color: string;
  size: number;
}) => {
  return focused ? (
    <View>
      <View style={styles.activeTabBarTopBorder} />
      <MapTabActiveIcon />
    </View>
  ) : (
    <MapTabIcon />
  );
};

const RenderVitalsTabIcon = ({
  focused,
}: {
  focused: boolean;
  color: string;
  size: number;
}) => {
  return focused ? (
    <View>
      <View style={styles.activeTabBarTopBorder} />
      <HeartbeatActiveTabIcon />
    </View>
  ) : (
    <HeartbeatTabIcon />
  );
};
