import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Drawer} from 'react-native-drawer-layout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Header from '../../components/shared/header/Header';
import DrawerMenuContent from '../../navigation/drawer/drawerMenuContent/DrawerMenuContent';

const DrawerLayoutWrapper = ({children}: {children: React.ReactNode}) => {
  const insets = useSafeAreaInsets();
  const safeAreaStyle = {
    paddingLeft: insets.left,
    paddingRight: insets.right,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(
    (newState: boolean) => () => setOpen(newState),
    [],
  );

  return (
    <Drawer
      style={[styles.wrapper, safeAreaStyle]}
      open={open}
      onOpen={handleToggle(true)}
      onClose={handleToggle(false)}
      renderDrawerContent={DrawerMenuContent}>
      <Header toggleDrawerToOpen={handleToggle(true)} />
      {children}
    </Drawer>
  );
};

export default DrawerLayoutWrapper;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
  },
});
