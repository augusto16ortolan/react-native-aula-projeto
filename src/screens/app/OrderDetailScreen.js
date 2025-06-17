import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from "react-native";

export default function OrderDetailScreen({ route }) {
  const { order } = route.params;

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.product.imageUrl ? (
        <Image
          source={{ uri: item.product.imageUrl }}
          style={styles.productImage}
          resizeMode="contain"
        />
      ) : null}
      <View style={styles.productDetails}>
        <Text style={styles.productDescription}>
          {item.product.description || "Sem descrição"}
        </Text>
        <Text style={styles.productBrandModel}>
          {item.product.brand} - {item.product.model}
        </Text>
        <Text>Quantidade: {item.quantity}</Text>
        <Text>
          Preço na compra: {item.priceAtPurchase.toFixed(2)}{" "}
          {item.currencyAtPurchase}
        </Text>
        <Text>
          Preço convertido: {item.convertedPriceAtPruchase.toFixed(2)} BRL
        </Text>
        <Text>Estoque atual: {item.product.stock}</Text>
        <Text>Ambiente: {item.product.enviroment}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalhes do Pedido #{order.id}</Text>
      <Text style={styles.date}>Data: {formatDate(order.orderDate)}</Text>

      <Text style={styles.sectionTitle}>Itens do Pedido</Text>
      <FlatList
        data={order.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />

      <View style={styles.totals}>
        <Text style={styles.totalText}>
          Total: R$ {order.totalPrice.toFixed(2)}
        </Text>
        <Text style={styles.totalConvertedText}>
          Total Convertido: R$ {order.totalConvertedPrice.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    height: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: "#e9ecef",
  },
  productDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  productDescription: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  productBrandModel: {
    color: "#495057",
    marginBottom: 6,
  },
  totals: {
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    paddingTop: 12,
    marginTop: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#198754",
  },
  totalConvertedText: {
    fontSize: 16,
    color: "#6c757d",
  },
});
