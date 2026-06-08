import { useState } from "react";
import {
  Alert,
  Image,
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

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleCadastro() {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    Alert.alert("Cadastro realizado", "Conta criada com sucesso!");
    router.push("/dashboard");
  }

  return (
    <LinearGradient colors={["#001923", "#00382F", "#005C46"]} style={styles.page}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.eclipseOuter} />
          <View style={styles.eclipseInner} />

          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Image
                source={require("../../assets/images/logo-eclipse.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>ECLIPSE</Text>
            <Text style={styles.protocol}>PROTOCOL</Text>

            <Text style={styles.subtitle}>
              Inteligência agrícola para monitoramento de plantações, sensores
              IoT e alertas ambientais.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Criar conta</Text>

            <Text style={styles.cardSubtitle}>
              Cadastre-se para acessar o painel de monitoramento rural.
            </Text>

            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João Silva"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha segura"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <TouchableOpacity activeOpacity={0.85} onPress={handleCadastro}>
              <LinearGradient
                colors={["#19D991", "#008B68", "#005C46"]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Criar conta</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginText}>Já tenho uma conta. Entrar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            IoT • NDVI • Umidade • Temperatura • Alertas críticos
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 44,
    paddingBottom: 28,
    overflow: "hidden",
  },

  eclipseOuter: {
    position: "absolute",
    top: 8,
    left: -72,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(0,117,216,0.28)",
  },

  eclipseInner: {
    position: "absolute",
    top: 34,
    left: -38,
    width: 225,
    height: 225,
    borderRadius: 112.5,
    backgroundColor: "rgba(0,28,34,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  header: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
  },

  logoBox: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  logo: {
    width: 86,
    height: 86,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 5,
  },

  protocol: {
    color: "#5BC5FF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 8,
    marginTop: 2,
  },

  subtitle: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 18,
    maxWidth: 330,
  },

  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.17)",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  cardSubtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.26)",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 15,
  },

  button: {
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  loginButton: {
    marginTop: 17,
    alignItems: "center",
  },

  loginText: {
    color: "#DDF7FF",
    fontSize: 14,
    fontWeight: "800",
  },

  footer: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 22,
  },
});