import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProductFormScreen({ navigation, route }) {
  const existingProduct = route.params?.product;

  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [currency, setCurrency] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (existingProduct) {
      setDescription(existingProduct.description || "");
      setBrand(existingProduct.brand || "");
      setModel(existingProduct.model || "");
      setCurrency(existingProduct.currency || "");
      setPrice(existingProduct.price?.toString() || "");
    }
  }, [existingProduct]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: existingProduct ? "Editar Produto" : "Cadastrar Produto",
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "#f8f9fc",
      },
    });
  }, [navigation, existingProduct]);

  const handleSubmit = () => {
    if (!description || !brand || !model || !currency || !price) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const productData = {
      description,
      brand,
      model,
      currency,
      price: parseFloat(price),
    };

    if (existingProduct) {
      console.log("Atualizando produto:", {
        id: existingProduct.id,
        ...productData,
      });
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
    } else {
      console.log("Criando novo produto:", productData);
      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
    }

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Digite a descrição"
      />

      <Text style={styles.label}>Marca</Text>
      <TextInput
        style={styles.input}
        value={brand}
        onChangeText={setBrand}
        placeholder="Digite a marca"
      />

      <Text style={styles.label}>Modelo</Text>
      <TextInput
        style={styles.input}
        value={model}
        onChangeText={setModel}
        placeholder="Digite o modelo"
      />

      <Text style={styles.label}>Moeda</Text>
      <TextInput
        style={styles.input}
        value={currency}
        onChangeText={setCurrency}
        placeholder="Exemplo: BRL"
      />

      <Text style={styles.label}>Preço</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Digite o preço"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>
          {existingProduct ? "Salvar Alterações" : "Salvar Produto"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fc",
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#4e73df",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});
