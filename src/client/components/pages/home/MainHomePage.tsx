import React, { FC, useState } from 'react';
import SEO from '@components/organisms/common/SEO';
import HomeTemplate from '../../templates/layout/HomeTemplate';
import MapView, { MapViewPropsType } from '@components/atoms/view/MapView';

interface PropsType {}

const MainHomePage: FC<PropsType> = props => {
  const [viewport, setViewport] = useState<MapViewPropsType>({
    width: '100%',
    height: '100%',
    longitude: 126.9783882,
    latitude: 37.5666103,
    zoom: 17,
  });

  return (
    <>
      <SEO title="Home" />
      <HomeTemplate>
        <MapView
          onViewportChange={nextViewport => setViewport(nextViewport)}
          mapStyle={'mapbox://styles/kaidu1982/ckpv80cdg250n17orm3lb4t06'}
          {...viewport}
        />
      </HomeTemplate>
    </>
  );
};

export default MainHomePage;
