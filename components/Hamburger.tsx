import React, { FC } from 'react';
import styled from 'styled-components/native';
import Icon from '../assets/icons/Hamburger.svg';

const Container = styled.View`
  background-color: white;
  border-radius: 60px;
  padding: 15px;
  border: 1px solid black;
`;

const Hamburger: FC = () => (
  <Container>
    <Icon width="30" height="30" fill="black" />
  </Container>
);

export default Hamburger;
