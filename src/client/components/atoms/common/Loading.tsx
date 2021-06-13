import React, { FC } from 'react';
import styled from 'styled-components';

interface PropsType {}

const Loading: FC<PropsType> = () => {
  return (
    <Container className="animated delay-1s fadeIn">
      <Spin />
    </Container>
  );
};

export default Loading;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(204, 204, 204, 0.3);
  z-index: 1;
`;

const Spin = styled.div`
  position: absolute;
  left: calc(50% - 18px);
  top: calc(50% - 18px);
`;
