import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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

export default function PropriedadeFormScreen() {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [area, setArea] = useState("");
  const [tipoSolo, setTipoSolo] = useState("");

  function handleSalvar() {
    if (!nome || !cidade || !estado || !area) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    Alert.alert("Sucesso", "Propriedade salva com sucesso!");
    router.push("/propriedades");
  }

  return (
    <LinearGradient colors={["#000814", "#001D2E", "#003D35"]} style={styles.page}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.eclipseGlow} />
          <View style={styles.eclipseDark} />

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.overline}>CADASTRO TERRITORIAL</Text>
          <Text style={styles.title}>Nova Propriedade</Text>
          <Text style={styles.subtitle}>
            Registre uma área rural para monitoramento inteligente.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Nome da propriedade *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fazenda Aurora"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Cidade *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Campinas"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={cidade}
              onChangeText={setCidade}
            />

            <Text style={styles.label}>Estado *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: SP"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={estado}
              onChangeText={setEstado}
              maxLength={2}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>Área em hectares *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 120"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Tipo de solo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Argiloso"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={tipoSolo}
              onChangeText={setTipoSolo}
            />

            <TouchableOpacity activeOpacity={0.85} onPress={handleSalvar}>
              <LinearGradient
                colors={["#19D991", "#008B68", "#005C46"]}
                style={styles.saveButton}
              >
                <MaterialCommunityIcons name="content-save-outline" size={21} color="#FFFFFF" />
                <Text style={styles.saveText}>Salvar Propriedade</Text>
              </LinearGradient>
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
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 30,
  },
  eclipseGlow: {
    position: "absolute",
    top: -70,
    right: -90,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(0,117,216,0.26)",
  },
  eclipseDark: {
    position: "absolute",
    top: -36,
    right: -55,
    width: 235,
    height: 235,
    borderRadius: 117.5,
    backgroundColor: "rgba(0,12,22,0.9)",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  overline: {
    color: "#58C7FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.2,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.23)",
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 8,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});