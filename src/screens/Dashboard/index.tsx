import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from "styled-components";

import { useAuth } from "../../hooks/auth";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps
} from "../../components/TransactionCard";

import {
  Container,
  LoadContainer,
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

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  incomes: HighlightProps;
  expenses: HighlightProps;
  balance: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const collectionFiltered = collection.filter(transaction => transaction.type === type);

    if (collectionFiltered.length === 0) {
      return 0;
    }

    const lastTransaction = new Date(
      Math.max.apply(Math, collectionFiltered
      .map(transaction => new Date(transaction.date).getTime()))
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}`
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const lastTransactionIncomes = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpenses = getLastTransactionDate(transactions, 'negative');

    const lastTransaction = lastTransactionIncomes > lastTransactionExpenses
      ? lastTransactionIncomes
      : lastTransactionExpenses

    const totalInterval = lastTransaction === 0
      ? 'Não há transações'
      : `01 à ${lastTransaction}`; 

    let incomesTotal = 0;
    let expensesTotal = 0;
    let balance = 0;

    const formattedTransactions: DataListProps[] = transactions
      .map((item: DataListProps) => {

        item.type === 'positive'
          ? incomesTotal += Number(item.amount)
          : expensesTotal += Number(item.amount)

        balance = incomesTotal - expensesTotal;

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

    setHighlightData({
      incomes: {
        amount: incomesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionIncomes === 0
          ? 'Não há transações'
          : `Última entrada dia ${lastTransactionIncomes}`
      },
      expenses: {
        amount: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpenses === 0
          ? 'Não há transações'
          : `Última saída dia ${lastTransactionExpenses}`
      },
      balance: {
        amount: balance.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    });

    setTransactions(formattedTransactions);

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size='large'
            />
          </LoadContainer>
        :
          <>
            <Header>
              <UserContainer>
                <UserInfo>
                  <UserAvatar source={{ uri: user.photo }} />

                  <User>
                    <UserGreetings>
                      Olá,
                    </UserGreetings>
                    <UserName>
                      {user.name}
                    </UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={signOut}>
                  <Icon name="power" />
                </LogoutButton>
              </UserContainer>
            </Header>

            <HighlightCards>
              <HighlightCard
                type="up"
                title="Entrada"
                amount={highlightData.incomes.amount}
                lastTransaction={highlightData.incomes.lastTransaction}
              />

              <HighlightCard
                type="down"
                title="Saídas"
                amount={highlightData.expenses.amount}
                lastTransaction={highlightData.expenses.lastTransaction}
              />

              <HighlightCard
                type="total"
                title="Total"
                amount={highlightData.balance.amount}
                lastTransaction={highlightData.balance.lastTransaction}
              />
            </HighlightCards>

            <Transactions>
              <Title>Listagem</Title>

              <TransactionsList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
                showsVerticalScrollIndicator={false}
              />

            </Transactions>
          </>
      }
    </Container>
  );
};
