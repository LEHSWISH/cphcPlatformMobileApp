import React from 'react';
import HomeFragments from '../fragments/HomeFragments';
import DrawerLayoutWrapper from '../../navigation/drawer/DrawerLayoutWrapper';

const Home = () => {
  return (
    <DrawerLayoutWrapper>
      <HomeFragments />
    </DrawerLayoutWrapper>
  );
};

export default Home;
