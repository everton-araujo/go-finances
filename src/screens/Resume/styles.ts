import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;


export const ChartContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;
