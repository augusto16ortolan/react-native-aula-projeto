import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createProduct, updateProduct } from "../../services/ProductService";
import { useAuth } from "../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../../services/ImageService";

export default function ProductFormScreen({ navigation, route }) {
  const existingProduct = route.params?.product;
  const { token } = useAuth();

  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [currency, setCurrency] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (existingProduct) {
      setDescription(existingProduct.description || "");
      setBrand(existingProduct.brand || "");
      setModel(existingProduct.model || "");
      setCurrency(existingProduct.currency || "");
      setPrice(existingProduct.price?.toString() || "");
      setImage(
        existingProduct.imageUrl ? { uri: existingProduct.imageUrl } : null
      );
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

  const handleSubmit = async () => {
    if (!description || !brand || !model || !currency || !price) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    let responseImage = {};

    if (!image?.base64) {
      responseImage = { imageUrl: image?.uri || null };
    } else {
      responseImage = await uploadImage(image);
    }

    const productData = {
      description,
      brand,
      model,
      currency,
      price: parseFloat(price),
      imageUrl: responseImage?.imageUrl,
    };

    setLoading(true);

    if (existingProduct) {
      const response = await updateProduct(
        existingProduct.id,
        productData,
        token
      );

      if (response.error) {
        Alert.alert("Erro", response.error);
        return;
      }

      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
    } else {
      const response = await createProduct(productData, token);

      if (response.error) {
        Alert.alert("Erro", response.error);
        return;
      }

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
    }

    navigation.goBack();
    setLoading(false);
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada!",
        "Você precisa permitir acesso à câmera."
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhotoWithCamera = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
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

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.button} onPress={takePhotoWithCamera}>
          <Text>Tirar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
          <Text>Escolher da galeria</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 100, height: 100, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        {loading ? (
          <Text style={styles.buttonText}>Salvando...</Text>
        ) : (
          <Text style={styles.buttonText}>
            {existingProduct ? "Salvar Alterações" : "Salvar Produto"}
          </Text>
        )}
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
