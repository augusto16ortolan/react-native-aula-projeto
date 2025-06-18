import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getProductById } from "../../services/ProductService";

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const DEFAULT_IMAGE = require("../../../assets/default_image.png");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response.product);
    } catch (error) {
      Alert.alert("Erro ao carregar produto", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert("Carrinho", "Produto adicionado ao carrinho!");
  };

  const handleEdit = () => {
    navigation.navigate("ProductForm", { product });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              //Adicionar metodo de excluir produto
              Alert.alert("Sucesso", "Produto excluído com sucesso!");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Erro", error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e73df" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>Produto não encontrado.</Text>
      </View>
    );
  }

  const imageSource =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? DEFAULT_IMAGE //{ uri: product.imageUrl }
      : DEFAULT_IMAGE;

  return (
    <View style={styles.pageContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={imageSource}
          style={styles.productImage}
          resizeMode="cover"
        />

        <Text style={styles.productDescription}>{product.description}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Marca:</Text>
          <Text style={styles.infoValue}>{product.brand}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Modelo:</Text>
          <Text style={styles.infoValue}>{product.model}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Preço:</Text>
          <Text style={styles.infoValuePrice}>
            R$ {product.convertedPrice.toFixed(2)}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Estoque:</Text>
          <Text style={styles.infoValue}>{product.stock}</Text>
        </View>
      </ScrollView>

      {user?.type === "Admin" ? (
        <View style={styles.adminButtonsContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Editar Produto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Excluir Produto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Adicionar ao carrinho</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#f8f9fc",
  },
  container: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 150,
  },
  productImage: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: "#e9ecef",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  productDescription: {
    fontSize: 26,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 24,
    textAlign: "center",
  },
  infoBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
  },
  infoValue: {
    fontSize: 16,
    color: "#343a40",
  },
  infoValuePrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4e73df",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fc",
  },
  emptyText: {
    fontSize: 18,
    color: "#868e96",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#4e73df",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 7,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  adminButtonsContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#17a2b8",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
