import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { getOrders } from "../../services/OrderService";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { token } = useAuth();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchOrders() {
        try {
          setLoading(true);
          setError(null);
          const response = await getOrders(token);
          if (isActive) {
            setOrders(response.orders || []);
          }
        } catch (err) {
          if (isActive) {
            setError("Erro ao carregar pedidos. Tente novamente.");
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      fetchOrders();

      // cleanup function
      return () => {
        isActive = false;
      };
    }, [token])
  );

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate("OrderDetailScreen", { order: item })}
    >
      <Text style={styles.orderId}>Pedido #{item.id}</Text>
      <Text style={styles.orderDate}>Data: {formatDate(item.orderDate)}</Text>
      <Text style={styles.orderTotal}>
        Total: R$ {item.totalConvertedPrice.toFixed(2)}
      </Text>
      <Text style={styles.orderItems}>
        Itens: {item.items ? item.items.length : 0}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4e73df" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noOrdersText}>Você ainda não tem pedidos.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderOrder}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#343a40",
  },
  orderDate: {
    fontSize: 14,
    marginBottom: 4,
    color: "#6c757d",
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#28a745",
  },
  orderItems: {
    fontSize: 14,
    color: "#495057",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  noOrdersText: {
    fontSize: 16,
    color: "#6c757d",
  },
});
