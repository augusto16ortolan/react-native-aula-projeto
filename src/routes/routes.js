import React from "react";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/app/HomeScreen";
import ProductDetail from "../screens/app/ProductDetailScreen";
import CartScreen from "../screens/app/CartScreen";
import OrderConfirmationScreen from "../screens/app/OrderConfirmationScreen";
import OrdersScreen from "../screens/app/OrdersScreen";
import OrderDetailScreen from "../screens/app/OrderDetailScreen";
import ProductFormScreen from "../screens/app/ProductFormScreen";

import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{
          headerTitle: "Detalhes do produto",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerTitle: "Carrinho",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{
          headerTitle: "Pedido",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductFormScreen}
        options={{
          headerTitle: "Novo Produto",
          headerBackTitle: "Voltar",
        }}
      />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrdersScreen"
        component={OrdersScreen}
        options={{ headerTitle: "Pedidos" }}
      />
      <Stack.Screen
        name="OrderDetailScreen"
        component={OrderDetailScreen}
        options={{ headerTitle: "Detalhes do Pedido" }}
      />
    </Stack.Navigator>
  );
}

export default function Routes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Produtos") {
              iconName = focused ? "pricetags" : "pricetags-outline";
            } else if (route.name === "Pedidos") {
              iconName = focused ? "list" : "list-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4e73df",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Produtos"
          component={ProductsStack}
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

            if (
              routeName === "Cart" ||
              routeName === "OrderConfirmation" ||
              routeName === "ProductDetail" ||
              routeName === "ProductForm"
            ) {
              return {
                tabBarStyle: { display: "none" },
                tabBarLabel: "Produtos",
              };
            }

            return { tabBarLabel: "Produtos" };
          }}
        />
        <Tab.Screen
          name="Pedidos"
          component={OrdersStack}
          options={({ route }) => {
            const routeName =
              getFocusedRouteNameFromRoute(route) ?? "OrdersScreen";

            if (routeName === "OrderDetailScreen") {
              return {
                tabBarStyle: { display: "none" },
                tabBarLabel: "Pedidos",
              };
            }

            return { tabBarLabel: "Pedidos" };
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
