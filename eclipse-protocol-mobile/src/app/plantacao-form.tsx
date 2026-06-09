import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atualizarPlantacao, criarPlantacao } from "../services/api";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function PlantacaoFormScreen() {
  const params = useLocalSearchParams();

  const plantacaoId = params.id ? Number(params.id) : null;

  const [nome, setNome] = useState("");
  const [cultura, setCultura] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const idPropriedade = params.idPropriedade
    ? Number(params.idPropriedade)
    : 1;

  useEffect(() => {
    setNome(params.nome ? String(params.nome) : "");
    setCultura(params.cultura ? String(params.cultura) : "");
    setArea(params.areaHectares ? String(params.areaHectares) : "");
    setStatus(params.status ? String(params.status) : "");
  }, [params.nome, params.cultura, params.areaHectares, params.status]);

  async function handleSalvar() {
    if (!nome.trim() || !cultura.trim() || !area.trim() || !status.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    const areaConvertida = Number(area.replace(",", "."));

    if (Number.isNaN(areaConvertida) || areaConvertida <= 0) {
      Alert.alert("Atenção", "Informe uma área válida.");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("@eclipse:token");

      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        router.replace("/login");
        return;
      }

      const payload = {
        nome: nome.trim(),
        cultura: cultura.trim(),
        areaHectares: areaConvertida,
        status: status.trim(),
        idPropriedade,
      };

      if (plantacaoId) {
        await atualizarPlantacao(token, plantacaoId, payload);
        Alert.alert("Sucesso", "Plantação atualizada com sucesso!");
      } else {
        await criarPlantacao(token, payload);
        Alert.alert("Sucesso", "Plantação cadastrada com sucesso!");
      }

      router.replace("/plantacoes");
    } catch (error) {
      console.log("ERRO AO SALVAR PLANTAÇÃO:", error);
      Alert.alert("Erro", "Não foi possível salvar a plantação.");
    } finally {
      setLoading(false);
    }
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

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/plantacoes")}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.overline}>CADASTRO AGRÍCOLA</Text>

          <Text style={styles.title}>
            {plantacaoId ? "Editar Plantação" : "Nova Plantação"}
          </Text>

          <Text style={styles.subtitle}>
            {plantacaoId
              ? "Atualize os dados da plantação monitorada."
              : "Registre uma cultura agrícola vinculada a uma propriedade."}
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Nome da plantação *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Soja Safra 2026"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={nome}
              onChangeText={setNome}
              editable={!loading}
            />

            <Text style={styles.label}>Cultura *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Soja"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={cultura}
              onChangeText={setCultura}
              editable={!loading}
            />

            <Text style={styles.label}>Área em hectares *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 85"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
              editable={!loading}
            />

            <Text style={styles.label}>Status *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Em desenvolvimento"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={status}
              onChangeText={setStatus}
              editable={!loading}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSalvar}
              disabled={loading}
            >
              <LinearGradient
                colors={
                  loading
                    ? ["#6B7280", "#4B5563"]
                    : ["#19D991", "#008B68", "#005C46"]
                }
                style={styles.saveButton}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name={plantacaoId ? "pencil-outline" : "content-save-outline"}
                      size={21}
                      color="#FFFFFF"
                    />
                    <Text style={styles.saveText}>
                      {plantacaoId ? "Atualizar Plantação" : "Salvar Plantação"}
                    </Text>
                  </>
                )}
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
    minHeight: 54,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});