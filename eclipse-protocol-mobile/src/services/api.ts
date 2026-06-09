const API_BASE_URL = "https://eclipse-protocol-java.onrender.com";

async function handleResponse(response: Response, errorMessage: string) {
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Erro da API:", errorText);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function login(
  email: string,
  senha: string
): Promise<{ token: string; tipo: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  return handleResponse(response, "E-mail ou senha inválidos");
}

export async function register(
  nome: string,
  email: string,
  senha: string
): Promise<{ id: number; nome: string; email: string }> {
  const response = await fetch(`${API_BASE_URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, email, senha }),
  });

  return handleResponse(response, "Erro ao criar conta");
}

export async function getAlertas(token: string) {
  const response = await fetch(`${API_BASE_URL}/alertas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Erro ao buscar alertas");
}