import React, { FC } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { RootStackParamList } from '../types';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const ButtonContainer = styled.TouchableOpacity`
  margin-top: 15px;
  padding-vertical: 15px;
`;

const ButtonText = styled.Text`
  font-size: 14px;
`;

const NotFoundScreen: FC<StackScreenProps<RootStackParamList, 'NotFound'>> = ({ navigation }) => {
  return (
    <Container>
      <Title>Näkymää ei löydy</Title>
      <ButtonContainer onPress={() => navigation.replace('Root')}>
        <ButtonText>Palaa takaisin</ButtonText>
      </ButtonContainer>
    </Container>
  );
}

export default NotFoundScreen;
