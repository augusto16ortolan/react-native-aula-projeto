import { StatusBar } from "expo-status-bar";
import Routes from "./src/routes/routes";
import AuthProvider from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Routes />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
