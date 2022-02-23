import React, { useState } from "react";
import { Modal } from "react-native";

import { Button } from "../../components/Form/Button";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";

import {
  Container,
  Form,
  Fields,
  TransactionsType
} from "./styles";

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [toggleCategoryModal, setToggleCategoryModal] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleToggleSelectCategoryModal() {
    toggleCategoryModal === true 
      ? setToggleCategoryModal(false)
      : setToggleCategoryModal(true);
  }

  return (
    <Container>
      <Header title="Cadastro" />

      <Form>
        <Fields>
          <Input
            placeholder="Nome"
          />

          <Input
            placeholder="Preço"
          />

          <TransactionsType>
            <TransactionTypeButton
              type="up"
              title="Income"
              onPress={() => handleTransactionTypeSelect('up')}
              isActive={transactionType === 'up'}
            />

            <TransactionTypeButton
              type="down"
              title="Outcome"
              onPress={() => handleTransactionTypeSelect('down')}
              isActive={transactionType === 'down'}
            />
          </TransactionsType>

          <CategorySelectButton 
            title={category.name}
            onPress={handleToggleSelectCategoryModal}
          />
        </Fields>

        <Button title="Enviar" />
      </Form>

      <Modal visible={toggleCategoryModal}>
        <CategorySelect 
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleToggleSelectCategoryModal}
        />
      </Modal>
    </Container>
  );
};
