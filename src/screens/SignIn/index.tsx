import React, { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from 'styled-components';

import GoogleLogo from '../../assets/google-logo.svg';
import AppLogo from '../../assets/logo.svg';
import { useAuth } from "../../hooks/auth";
import { SingInSocialButton } from "../../components/SingInSocialButton";

import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from "./style";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const theme = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();

    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Google');
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <AppLogo
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>

          <SignInTitle>
            Faça seu login com {'\n'}
            uma das contas abaixo
          </SignInTitle>
        </TitleWrapper>
      </Header>

      <Footer>
        <FooterWrapper>
          <SingInSocialButton 
            title="Entrar com Google"
            svg={GoogleLogo}
            onPress={handleSignInWithGoogle}
          />
        </FooterWrapper>
    
        {
          isLoading && 
            <ActivityIndicator 
              color={theme.colors.shape}
              style={{ marginTop: 18 }}
            />
        }
 
      </Footer>
    </Container>
  );
};
