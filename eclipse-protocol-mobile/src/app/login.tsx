import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { login, saveAuthData, TOKEN_KEY } from "../services/api";
import axios from "axios";

async function getUsuariosComToken(token: string, email: string) {
  try {
    const response = await axios.get(
      "https://eclipse-protocol-java.onrender.com/usuarios",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data._embedded?.usuarioResponseList ?? [];
  } catch {
    return [];
  }
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Block hardware back button so users can't press back to dashboard after logout
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
      return () => sub.remove();
    }, [])
  );

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);
      const { token } = await login(email.trim().toLowerCase(), senha);
      const usuarios = await getUsuariosComToken(token, email.trim().toLowerCase());
      const usuario = usuarios.find(
        (u: { email: string }) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      const userId = usuario?.id ?? 0;
      const nome = usuario?.nome ?? "Usuário";

      await saveAuthData(token, userId, email.trim().toLowerCase(), nome);
      router.replace("/dashboard");
    } catch (err: any) {
      if (err?.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
        Alert.alert("Servidor aguarde", "O servidor está iniciando (Render free tier). Tente novamente em alguns segundos.");
      } else if (err?.response?.status === 401 || err?.response?.status === 403) {
        Alert.alert("Acesso negado", "E-mail ou senha inválidos.");
      } else if (err?.response?.data?.message) {
        Alert.alert("Erro", err.response.data.message);
      } else {
        Alert.alert("Erro de conexão", "Não foi possível conectar. Verifique sua internet e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGithubLogin() {
    setLoading(true);
    try {
      const redirectUri = Linking.createURL("/");
      const authUrl =
        "https://eclipse-protocol-java.onrender.com/oauth2/authorization/github" +
        "?mobile_redirect=" +
        encodeURIComponent(redirectUri);

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const token = (parsed.queryParams?.token as string) ?? result.url.split("token=")[1];
        if (token) {
          await AsyncStorage.setItem(TOKEN_KEY, token);
          const usuarios = await getUsuariosComToken(token, "");
          const usuario = usuarios[0];
          await saveAuthData(
            token,
            usuario?.id ?? 0,
            usuario?.email ?? "",
            usuario?.nome ?? "Usuário"
          );
          router.replace("/dashboard");
        } else {
          Alert.alert("Erro", "Token não recebido do GitHub.");
        }
      }
    } catch (err: any) {
      Alert.alert("Erro", err?.message ?? "Não foi possível autenticar com GitHub.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={["#000814", "#001D2E", "#003D35"]}
      style={styles.page}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eclipseGlow} />
          <View style={styles.eclipseDark} />

          <View style={styles.header}>
            <Text style={styles.overline}>SECURE ACCESS</Text>

            <Text style={styles.title}>ECLIPSE</Text>
            <Text style={styles.protocol}>PROTOCOL</Text>

            <Text style={styles.subtitle}>
              Acesse o centro de monitoramento agrícola inteligente.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar</Text>

            <Text style={styles.cardSubtitle}>
              Utilize suas credenciais para acessar a plataforma.
            </Text>

            <Text style={styles.label}>E-mail</Text>

            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <LinearGradient
                colors={["#19D991", "#008B68", "#005C46"]}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.githubButton}
              onPress={handleGithubLogin}
              disabled={loading}
            >
              <View style={styles.githubButtonContent}>
                <AntDesign name="github" size={22} color="#FFFFFF" />
                <Text style={styles.githubButtonText}>Entrar com GitHub</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.registerText}>
                Não possui conta? Criar cadastro
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },

  keyboard: { flex: 1 },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  eclipseGlow: {
    position: "absolute",
    top: -40,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(0,117,216,0.28)",
  },

  eclipseDark: {
    position: "absolute",
    top: -10,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(0,10,20,0.88)",
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  overline: {
    color: "#58C7FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 10,
  },

  protocol: {
    color: "#58C7FF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 8,
  },

  subtitle: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  cardSubtitle: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
  },

  label: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 15,
    color: "#FFFFFF",
    marginBottom: 15,
  },

  button: {
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 16,
  },

  registerButton: {
    marginTop: 18,
    alignItems: "center",
  },

  registerText: {
    color: "#DDF7FF",
    fontWeight: "700",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  dividerText: {
    color: "rgba(255,255,255,0.5)",
    marginHorizontal: 10,
    fontSize: 13,
  },

  githubButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  githubButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  githubButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});