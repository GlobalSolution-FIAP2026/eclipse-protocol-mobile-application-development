const API_BASE_URL = "https://eclipse-protocol-java.onrender.com";

export async function login(email: string, senha: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    throw new Error("Erro ao realizar login");
  }

  return response.json();
}

export async function getAlertas(token: string) {
  const response = await fetch(`${API_BASE_URL}/alertas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar alertas");
  }

  return response.json();
}