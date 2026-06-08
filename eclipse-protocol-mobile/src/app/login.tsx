import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    router.push("/dashboard");
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

            <TouchableOpacity onPress={handleLogin}>
              <LinearGradient
                colors={["#19D991", "#008B68", "#005C46"]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </LinearGradient>
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
});