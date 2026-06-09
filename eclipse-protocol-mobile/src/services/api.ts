const API_BASE_URL = "https://eclipse-protocol-java.onrender.com";

type PropriedadePayload = {
  nome: string;
  proprietario: string;
  areaTotal: number;
  tipoSolo: string;
  idLocalizacao: number;
  idUsuario: number;
};

async function handleResponse(response: Response, errorMessage: string) {
  const text = await response.text();

  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  console.log("STATUS API:", response.status);
  console.log("RESPOSTA API:", data);

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message || data?.error || errorMessage
    );
  }

  return data;
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

export async function listarPropriedades(token: string) {
  const response = await fetch(`${API_BASE_URL}/propriedades`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Erro ao listar propriedades");
}

export async function buscarPropriedadePorId(token: string, id: number) {
  const response = await fetch(`${API_BASE_URL}/propriedades/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response, "Erro ao buscar propriedade");
}

export async function criarPropriedade(
  token: string,
  propriedade: PropriedadePayload
) {
  const response = await fetch(`${API_BASE_URL}/propriedades`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(propriedade),
  });

  return handleResponse(response, "Erro ao criar propriedade");
}

export async function atualizarPropriedade(
  token: string,
  id: number,
  propriedade: PropriedadePayload
) {
  const response = await fetch(`${API_BASE_URL}/propriedades/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(propriedade),
  });

  return handleResponse(response, "Erro ao atualizar propriedade");
}

export async function deletarPropriedade(token: string, id: number) {
  console.log("CHAMANDO DELETE ID:", id);
  console.log("TOKEN NO DELETE:", token);

  const response = await fetch(`${API_BASE_URL}/propriedades/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await response.text();

  console.log("STATUS DELETE:", response.status);
  console.log("RESPOSTA DELETE:", text);

  if (response.status === 204) {
    return true;
  }

  throw new Error(text || "Erro ao deletar propriedade");
}

type PlantacaoPayload = {
  nome: string;
  cultura: string;
  areaHectares: number;
  status: string;
  idPropriedade: number;
};

