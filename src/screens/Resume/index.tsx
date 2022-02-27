import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from 'styled-components';

import { Header } from "../../components/Header";
import { HistoryCard } from "../../components/HistoryCard";
import { TransactionCardProps } from "../../components/TransactionCard";
import { categories } from "../../utils/categories";

import { 
  Container, 
  ChartContainer,
  Content 
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
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const theme = useTheme();

  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const formattedResponse = response ? JSON.parse(response) : [];

    const expenses = formattedResponse
      .filter((expenses: TransactionCardProps) => expenses.type === 'negative');

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
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header title="Resumo por categoria" />

      <Content>
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
    </Container>
  );
};
