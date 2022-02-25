import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { HighlightCard } from "../../components/HighlightCard";
import { 
  TransactionCard, 
  TransactionCardProps 
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserContainer,
  UserInfo,
  UserAvatar,
  User,
  UserGreetings,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList
} from "./styles";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([]);

  async function loadTransactions() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    console.log(transactions);

    const formattedTransactions: DataListProps[] = transactions
      .map((item: DataListProps) => {
        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
        
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date
        }
      });

      setData(formattedTransactions);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      <Header>
        <UserContainer>
          <UserInfo>
            <UserAvatar source={{ uri: 'data:image/webp;base64,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' }} />

            <User>
              <UserGreetings>
                Olá,
              </UserGreetings>
              <UserName>
                Everton
              </UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserContainer>
      </Header>

      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entrada"
          amount="R$ 17.400,00"
          lastTransaction="Última transação dia 21 de Fevereiro"
        />

        <HighlightCard
          type="down"
          title="Saídas"
          amount="1.259,00"
          lastTransaction="Última saída dia 03 de Fevereiro"
        />

        <HighlightCard
          type="total"
          title="Total"
          amount="16.141,00"
          lastTransaction="01 à 22 de Fevereiro"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
          showsVerticalScrollIndicator={false}
        />

      </Transactions>
    </Container>
  );
};
