import api from "./api";

export async function register(user) {
  try {
    const response = await api.post("/auth/signup", user);
    console.log(response.data);
  } catch (error) {
    console.log(error.response.data);
    //Verificar todos os codigos de retorno e devolver as mensagens para o usuario
    return { error: error.message };
  }
}

export async function login(credentials) {
  try {
    const response = await api.post("/auth/signin", credentials);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    //Verificar todos os codigos de retorno e devolver as mensagens para o usuario
    return { error: error.message };
  }
}
