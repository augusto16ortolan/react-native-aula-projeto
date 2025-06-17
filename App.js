import { StatusBar } from "expo-status-bar";
import Routes from "./src/routes/routes";
import AuthProvider from "./src/context/AuthContext";
import CartProvider from "./src/context/CartContext";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes />
        <StatusBar style="auto" />
      </CartProvider>
    </AuthProvider>
  );
}
