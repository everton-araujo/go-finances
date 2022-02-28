import React from "react";
import { RFValue } from "react-native-responsive-fontsize";

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
  const { user } = useAuth();

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
          />
        </FooterWrapper>
      </Footer>
    </Container>
  );
};
