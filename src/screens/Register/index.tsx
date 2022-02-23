import React, { useState } from "react";
import { Modal } from "react-native";
import { useForm } from "react-hook-form";

import { Button } from "../../components/Form/Button";
import { Header } from "../../components/Header";
import { InputForm } from "../../components/Form/InputForm";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";

import {
  Container,
  Form,
  Fields,
  TransactionsType
} from "./styles";

interface FormData {
  name: string;
  amount: string;
}

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [toggleCategoryModal, setToggleCategoryModal] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit
  } = useForm();

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleToggleSelectCategoryModal() {
    toggleCategoryModal === true 
      ? setToggleCategoryModal(false)
      : setToggleCategoryModal(true);
  }

  function handleRegister(form: FormData) {
    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }
    console.log(data);
    
  }

  return (
    <Container>
      <Header title="Cadastro" />

      <Form>
        <Fields>
          <InputForm
            name="name"
            control={control}
            placeholder="Nome"
          />

          <InputForm
            name="amount"
            control={control}
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

        <Button 
          title="Enviar"
          onPress={handleSubmit(handleRegister)}
        />
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
