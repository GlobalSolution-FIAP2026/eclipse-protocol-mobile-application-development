import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const TOKEN_KEY = "@eclipse:token";
export const USER_ID_KEY = "@eclipse:userId";
export const USER_EMAIL_KEY = "@eclipse:email";
export const USER_NAME_KEY = "@eclipse:nome";


export const api = axios.create({
  baseURL: "https://eclipse-protocol-java.onrender.com",
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

// Request interceptor: inject Bearer token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_ID_KEY);
      await AsyncStorage.removeItem(USER_EMAIL_KEY);
      await AsyncStorage.removeItem(USER_NAME_KEY);
      router.replace("/login");
    }
    return Promise.reject(error);
  }
);


export async function saveAuthData(token: string, userId: number, email: string, nome: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_ID_KEY, String(userId));
  await AsyncStorage.setItem(USER_EMAIL_KEY, email);
  await AsyncStorage.setItem(USER_NAME_KEY, nome);
}

export async function getStoredToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUserId(): Promise<number | null> {
  const id = await AsyncStorage.getItem(USER_ID_KEY);
  return id ? parseInt(id, 10) : null;
}

export async function getStoredUserEmail() {
  return AsyncStorage.getItem(USER_EMAIL_KEY);
}

export async function getStoredUserName() {
  return AsyncStorage.getItem(USER_NAME_KEY);
}

export async function clearAuthData() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_ID_KEY);
  await AsyncStorage.removeItem(USER_EMAIL_KEY);
  await AsyncStorage.removeItem(USER_NAME_KEY);
}


export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface Localizacao {
  id: number;
  cidade: string;
  estado: string;
  pais: string;
  latitude?: number;
  longitude?: number;
  cep: string;
}

export interface Propriedade {
  id: number;
  nome: string;
  proprietario: string;
  areaTotal: number;
  tipoSolo?: string;
  idLocalizacao: number;
  idUsuario: number;
}

export interface Plantacao {
  id: number;
  nome: string;
  cultura: string;
  areaHectares: number;
  status: string;
  idPropriedade: number;
}

export interface Sensor {
  id: number;
  nome?: string;
  tipo: string;
  idPlantacao: number;
}

export interface Leitura {
  id: number;
  temperatura?: number;
  umidade?: number;
  precipitacao?: number;
  ndvi?: number;
  dataLeitura?: string;
  idSensor: number;
}

export interface Alerta {
  id: number;
  tipoAlerta: string;
  severidade: string;
  mensagem: string;
  status: string;
  dataCriacao?: string;
  idLeitura: number;
  idPlantacao: number;
  cultura?: string;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function login(email: string, senha: string) {
  const response = await api.post<{ token: string; tipo: string }>("/auth/login", { email, senha });
  return response.data;
}

// ─── USUÁRIOS ─────────────────────────────────────────────────────────────────

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await api.get("/usuarios");
  return response.data._embedded?.usuarioResponseList ?? [];
}

export async function getUsuario(id: number): Promise<Usuario> {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

export async function createUsuario(data: { nome: string; email: string; senha: string }) {
  // Public endpoint — use plain axios without auth interceptor
  const response = await axios.post(
    "https://eclipse-protocol-java.onrender.com/usuarios",
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
}

export async function updateUsuario(id: number, data: { nome: string; email: string; senha: string }) {
  const response = await api.put(`/usuarios/${id}`, data);
  return response.data;
}

export async function deleteUsuario(id: number) {
  await api.delete(`/usuarios/${id}`);
}

// ─── LOCALIZAÇÕES ─────────────────────────────────────────────────────────────

export async function getLocalizacoes(): Promise<Localizacao[]> {
  const response = await api.get("/localizacoes");
  return response.data._embedded?.localizacaoResponseList ?? [];
}

export async function getLocalizacao(id: number): Promise<Localizacao> {
  const response = await api.get(`/localizacoes/${id}`);
  return response.data;
}

export async function createLocalizacao(data: {
  cidade: string;
  estado: string;
  pais: string;
  latitude?: number;
  longitude?: number;
  cep: string;
}): Promise<Localizacao> {
  const response = await api.post("/localizacoes", data);
  return response.data;
}

export async function updateLocalizacao(id: number, data: {
  cidade: string;
  estado: string;
  pais: string;
  latitude?: number;
  longitude?: number;
  cep: string;
}) {
  const response = await api.put(`/localizacoes/${id}`, data);
  return response.data;
}

export async function deleteLocalizacao(id: number) {
  await api.delete(`/localizacoes/${id}`);
}

// ─── PROPRIEDADES ─────────────────────────────────────────────────────────────

export async function getPropriedades(): Promise<Propriedade[]> {
  const response = await api.get("/propriedades");
  return response.data._embedded?.propriedadeResponseList ?? [];
}

export async function getPropriedade(id: number): Promise<Propriedade> {
  const response = await api.get(`/propriedades/${id}`);
  return response.data;
}

export async function createPropriedade(data: {
  nome: string;
  proprietario: string;
  areaTotal: number;
  tipoSolo?: string;
  idLocalizacao: number;
  idUsuario: number;
}): Promise<Propriedade> {
  const response = await api.post("/propriedades", data);
  return response.data;
}

export async function updatePropriedade(id: number, data: {
  nome: string;
  proprietario: string;
  areaTotal: number;
  tipoSolo?: string;
  idLocalizacao: number;
  idUsuario: number;
}) {
  const response = await api.put(`/propriedades/${id}`, data);
  return response.data;
}

export async function deletePropriedade(id: number) {
  await api.delete(`/propriedades/${id}`);
}

// ─── PLANTAÇÕES ───────────────────────────────────────────────────────────────

export async function getPlantacoes(): Promise<Plantacao[]> {
  const response = await api.get("/plantacoes");
  return response.data._embedded?.plantacaoResponseList ?? [];
}

export async function getPlantacao(id: number): Promise<Plantacao> {
  const response = await api.get(`/plantacoes/${id}`);
  return response.data;
}

export async function createPlantacao(data: {
  nome: string;
  cultura: string;
  areaHectares: number;
  status: string;
  idPropriedade: number;
}): Promise<Plantacao> {
  const response = await api.post("/plantacoes", data);
  return response.data;
}

export async function updatePlantacao(id: number, data: {
  nome: string;
  cultura: string;
  areaHectares: number;
  status: string;
  idPropriedade: number;
}) {
  const response = await api.put(`/plantacoes/${id}`, data);
  return response.data;
}

export async function deletePlantacao(id: number) {
  await api.delete(`/plantacoes/${id}`);
}

// ─── SENSORES ─────────────────────────────────────────────────────────────────

export async function getSensores(): Promise<Sensor[]> {
  const response = await api.get("/sensores");
  return response.data._embedded?.sensorResponseList ?? [];
}

export async function getSensor(id: number): Promise<Sensor> {
  const response = await api.get(`/sensores/${id}`);
  return response.data;
}

export async function createSensor(data: {
  nome?: string;
  tipo: string;
  idPlantacao: number;
}): Promise<Sensor> {
  const response = await api.post("/sensores", data);
  return response.data;
}

export async function updateSensor(id: number, data: {
  nome?: string;
  tipo: string;
  idPlantacao: number;
}) {
  const response = await api.put(`/sensores/${id}`, data);
  return response.data;
}

export async function deleteSensor(id: number) {
  await api.delete(`/sensores/${id}`);
}

// ─── LEITURAS ─────────────────────────────────────────────────────────────────

export async function getLeituras(): Promise<Leitura[]> {
  const response = await api.get("/leituras");
  return response.data._embedded?.leituraResponseList ?? [];
}

export async function getLeitura(id: number): Promise<Leitura> {
  const response = await api.get(`/leituras/${id}`);
  return response.data;
}

export async function createLeitura(data: {
  sensor: number;
  temperatura?: number;
  umidade?: number;
  precipitacao?: number;
  ndvi?: number;
}): Promise<Leitura> {
  const response = await api.post("/leituras", data);
  return response.data;
}

export async function updateLeitura(id: number, data: {
  sensor: number;
  temperatura?: number;
  umidade?: number;
  precipitacao?: number;
  ndvi?: number;
}) {
  const response = await api.put(`/leituras/${id}`, data);
  return response.data;
}

export async function deleteLeitura(id: number) {
  await api.delete(`/leituras/${id}`);
}

// ─── ALERTAS ──────────────────────────────────────────────────────────────────

export async function getAlertas(): Promise<Alerta[]> {
  const response = await api.get("/alertas");
  return response.data._embedded?.alertaResponseList ?? [];
}

export async function getAlerta(id: number): Promise<Alerta> {
  const response = await api.get(`/alertas/${id}`);
  return response.data;
}

export async function createAlerta(data: {
  idLeitura: number;
  idPlantacao: number;
  tipoAlerta: string;
  severidade: string;
  mensagem: string;
}): Promise<Alerta> {
  const response = await api.post("/alertas", data);
  return response.data;
}

export async function updateAlerta(id: number, data: {
  idLeitura: number;
  idPlantacao: number;
  tipoAlerta: string;
  severidade: string;
  mensagem: string;
}) {
  const response = await api.put(`/alertas/${id}`, data);
  return response.data;
}

export async function deleteAlerta(id: number) {
  await api.delete(`/alertas/${id}`);
}