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
    console.log(response.data);
    return {
      product: response.data,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function createProduct(productToCreate, token) {
  try {
    const response = await api.post("/ws/products", productToCreate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      product: response.data,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateProduct(id, productToUpdate, token) {
  try {
    const response = await api.put(`/ws/products/${id}`, productToUpdate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      product: response.data,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteProduct(id, token) {
  try {
    await api.delete(`/ws/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {};
  } catch (error) {
    return { error: error.message };
  }
}
