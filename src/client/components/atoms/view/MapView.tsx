import React, {
  forwardRef,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Loading from '../common/Loading';
import { MAPBOX_ACCESS_TOKEN } from '@constants/token';
import { MAP_STYLES } from '@constants/map';
import { MAP_STYLE_TYPE } from '@enums/map';
import ResizeObserver, { DOMRect } from 'react-resize-observer';
import { useDebounce } from '@react-hook/debounce';
import mapboxgl from 'mapbox-gl';
import { ViewportProps } from 'react-map-gl';
import { InteractiveMapProps } from 'react-map-gl/dist/es6/components/interactive-map';

interface PropType extends InteractiveMapProps {
  showTileBoundaries?: boolean;
  images?: { name: string; src: string }[];
  children?: ReactNode;
}

export type MapViewPropsType = PropsWithoutRef<PropType> & RefAttributes<mapboxgl.Map>;

const MapView = forwardRef<mapboxgl.Map, PropType>((props, ref) => {
  const [rect, setRect] = useDebounce<DOMRect>(null, 500);
  const [map, setMap] = useState<mapboxgl.Map>(null);
  const [viewport, setViewport] = useState<InteractiveMapProps>({
    ...props,
  });

  useEffect(() => {
    setViewport({
      ...props,
    });
  }, [props]);

  useImperativeHandle(ref, () => map, [map]);

  useEffect(() => {
    if (!map || !rect || !rect.width || !rect.height) {
      return;
    }

    setViewport(prev => ({
      ...prev,
      width: rect.width,
      height: rect.height,
    }));
    onResize({
      width: rect.width,
      height: rect.height,
    });
  }, [rect, map]);

  function onViewportChange(viewState: ViewportProps, interactionState: ExtraState, oldViewState: ViewportProps): void {
    setViewport(viewState);
    props.onViewportChange && props.onViewportChange(viewState, interactionState, oldViewState);
  }

  function onLoad(event: MapLoadEvent): void {
    const map = event.target;
    setMap(map);
    window['_map'] = map;

    if (typeof props.showTileBoundaries !== 'undefined') {
      map.showTileBoundaries = true;
    }

    if (Array.isArray(props.images)) {
      props.images.forEach(image =>
        map.loadImage(image.src, (e, i) => {
          if (e) {
            console.error(e);
            return;
          }

          if (map.hasImage(image.name)) {
            return;
          }

          map.addImage(image.name, i);
        }),
      );
    }

    props.onLoad && props.onLoad(event);
  }

  function onResize(dimensions: { width: number; height: number }): void {
    props.onResize && props.onResize(dimensions);
  }

  return (
    <Container>
      <ReactMapGL
        mapOptions={{
          attributionControl: false,
          localIdeographFontFamily: false,
        }}
        mapStyle={MAP_STYLES[MAP_STYLE_TYPE.MAPBOX_STREET]}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        {...props}
        {...viewport}
        onViewportChange={onViewportChange}
        onLoad={onLoad}
        onResize={onResize}
      />
      <ResizeObserver
        onResize={rect => {
          setRect(rect);
        }}
      />
    </Container>
  );
});

export default MapView;

interface ExtraState {
  inTransition?: boolean;
  isDragging?: boolean;
  isHovering?: boolean;
  isPanning?: boolean;
  isRotating?: boolean;
  isZooming?: boolean;
}

interface MapLoadEvent {
  type: string;
  target: mapboxgl.Map;
}

const ReactMapGL = dynamic(() => import('react-map-gl'), {
  ssr: false,
  loading: () => <Loading />,
});

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
