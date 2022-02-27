import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Header } from "../../components/Header";
import { HistoryCard } from "../../components/HistoryCard";
import { TransactionCardProps } from "../../components/TransactionCard";
import { categories } from "../../utils/categories";

import { Container, Content } from "./styles";

interface CategoryData {
  id: string;
  name: string;
  total: string;
  color: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const formattedResponse = response ? JSON.parse(response) : [];

    const expenses = formattedResponse
      .filter((expenses: TransactionCardProps) => expenses.type === 'negative');

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach((expenses: TransactionCardProps) => {
        if (expenses.category === category.key) {
          categorySum += Number(expenses.amount);
        }
      });

      if (categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        totalByCategory.push({
          id: category.key,
          name: category.name,
          total: total,
          color: category.color
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
        {
          totalByCategories.map(item => (
            <HistoryCard
              key={item.id}
              title={item.name}
              amount={item.total}
              color={item.color}
            />
          ))
        }
      </Content>
    </Container>
  );
};
