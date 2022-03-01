import React, { useCallback, useState } from "react";
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from "react-native-responsive-fontsize";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTheme } from 'styled-components';
import { useFocusEffect } from "@react-navigation/native";

import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { Header } from "../../components/Header";
import { HistoryCard } from "../../components/HistoryCard";
import { TransactionCardProps } from "../../components/TransactionCard";
import { categories } from "../../utils/categories";
import { useAuth } from "../../hooks/auth";

import {
  Container,
  LoadContainer,
  Content,
  ChangeChargeDisplayContainer,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month
} from "./styles";

interface CategoryData {
  id: string;
  name: string;
  total: number;
  formattedTotal: string;
  color: string;
  expensesPercent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const [toggleDisplay, setToggleDisplay] = useState('negative');
  const theme = useTheme();
  const { user } = useAuth();

  function handleDateChange(action: 'next' | 'previous') {
    if (action === 'next') {
      return setSelectedDate(addMonths(selectedDate, 1));
    }

    setSelectedDate(subMonths(selectedDate, 1));
  }

  async function loadData() {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const formattedResponse = response ? JSON.parse(response) : [];

    const expenses = formattedResponse
      .filter((expenses: TransactionCardProps) =>
        expenses.type === toggleDisplay &&
        new Date(expenses.date).getMonth() === selectedDate.getMonth() &&
        new Date(expenses.date).getFullYear() === selectedDate.getFullYear()
    );

    const totalExpenses = expenses
      .reduce((accumulator: number, expense: TransactionCardProps) => {
        return accumulator + Number(expense.amount);
      }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach((expenses: TransactionCardProps) => {
        if (expenses.category === category.key) {
          categorySum += Number(expenses.amount);
        }
      });

      if (categorySum > 0) {
        const formattedTotal = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const expensesPercent = `${(categorySum / totalExpenses * 100).toFixed(0)}%`

        totalByCategory.push({
          id: category.key,
          name: category.name,
          total: categorySum,
          formattedTotal,
          color: category.color,
          expensesPercent
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  function handleToggleDisplay() {
    if (toggleDisplay === 'positive') {
      return setToggleDisplay('negative');
    }
    setToggleDisplay('positive');
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate, toggleDisplay]));

  return (
    <Container>
      <Header title="Resumo por categoria" />
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size='large'
            />
          </LoadContainer>
        :
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight()
            }}
          >
            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange('previous')}>
                <MonthSelectIcon name='chevron-left' />
              </MonthSelectButton>

              <Month>
                {
                  format(selectedDate, 'MMMM, yyyy', { locale: ptBR }).charAt(0).toUpperCase()
                  + format(selectedDate, 'MMMM, yyyy', { locale: ptBR }).slice(1)
                }
              </Month>

              <MonthSelectButton onPress={() => handleDateChange('next')}>
                <MonthSelectIcon name='chevron-right' />
              </MonthSelectButton>
            </MonthSelect>

            <ChangeChargeDisplayContainer>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleToggleDisplay()}
                isActive={toggleDisplay === 'positive'}
              />

              <TransactionTypeButton
                type="down"
                title="Expenses"
                onPress={() => handleToggleDisplay()}
                isActive={toggleDisplay === 'negative'}
              />
            </ChangeChargeDisplayContainer>

            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                x='expensesPercent'
                y='total'
                labelRadius={80}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
              />
            </ChartContainer>

            {
              totalByCategories.map(item => (
                <HistoryCard
                  key={item.id}
                  title={item.name}
                  amount={item.formattedTotal}
                  color={item.color}
                />
              ))
            }
          </Content>
      }
    </Container>
  );
};
