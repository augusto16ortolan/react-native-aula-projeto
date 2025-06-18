import api from "./api";

export async function getProducts(targetCurrency = "BRL") {
  try {
    const response = await api.get(`/products/${targetCurrency}?size=40`);
    return {
      products: response.data.content,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getProductById(id, targetCurrency = "BRL") {
  try {
    const response = await api.get(`/products/${id}/${targetCurrency}`);
    return {
      product: response.data,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}
