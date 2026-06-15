import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atualizarPropriedade, criarPropriedade } from "../services/api";
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
import React from "react";

export default function PropriedadeFormScreen() {
  const params = useLocalSearchParams();

  const propriedadeId = params.id ? Number(params.id) : null;

  const [nome, setNome] = useState("");
  const [proprietario, setProprietario] = useState("");
  const [area, setArea] = useState("");
  const [tipoSolo, setTipoSolo] = useState("");
  const [loading, setLoading] = useState(false);

  const idLocalizacao = params.idLocalizacao ? Number(params.idLocalizacao) : 1;
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : 1;

  useEffect(() => {
    setNome(params.nome ? String(params.nome) : "");
    setProprietario(
      params.proprietario ? String(params.proprietario) : "Usuário Eclipse"
    );
    setArea(params.areaTotal ? String(params.areaTotal) : "");
    setTipoSolo(params.tipoSolo ? String(params.tipoSolo) : "");
  }, [
    params.nome,
    params.proprietario,
    params.areaTotal,
    params.tipoSolo,
  ]);

  async function handleSalvar() {
    if (!nome.trim() || !proprietario.trim() || !area.trim()) {
      Alert.alert("Atenção", "Preencha nome, proprietário e área total.");
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
        router.push("/login");
        return;
      }

      const payload = {
        nome: nome.trim(),
        proprietario: proprietario.trim(),
        areaTotal: areaConvertida,
        tipoSolo: tipoSolo.trim() || "Não informado",
        idLocalizacao,
        idUsuario,
      };

      if (propriedadeId) {
        await atualizarPropriedade(token, propriedadeId, payload);
        Alert.alert("Sucesso", "Propriedade atualizada com sucesso!");
      } else {
        await criarPropriedade(token, payload);
        Alert.alert("Sucesso", "Propriedade cadastrada com sucesso!");
      }

      router.replace("/propriedades");
    } catch (error) {
      console.log("ERRO AO SALVAR PROPRIEDADE:", error);
      Alert.alert("Erro", "Não foi possível salvar a propriedade.");
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
            onPress={() => router.push("/propriedades")}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.overline}>CADASTRO TERRITORIAL</Text>

          <Text style={styles.title}>
            {propriedadeId ? "Editar Propriedade" : "Nova Propriedade"}
          </Text>

          <Text style={styles.subtitle}>
            {propriedadeId
              ? "Atualize os dados da propriedade rural."
              : "Registre uma área rural para monitoramento inteligente."}
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Nome da propriedade *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fazenda Aurora"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={nome}
              onChangeText={(text) => setNome(text)}
              editable={!loading}
            />

            <Text style={styles.label}>Proprietário *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João Silva"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={proprietario}
              onChangeText={(text) => setProprietario(text)}
              editable={!loading}
            />

            <Text style={styles.label}>Área total em hectares *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 120"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={area}
              onChangeText={(text) => setArea(text)}
              keyboardType="numeric"
              editable={!loading}
            />

            <Text style={styles.label}>Tipo de solo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Argiloso"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={tipoSolo}
              onChangeText={(text) => setTipoSolo(text)}
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
                      name={propriedadeId ? "pencil-outline" : "content-save-outline"}
                      size={21}
                      color="#FFFFFF"
                    />
                    <Text style={styles.saveText}>
                      {propriedadeId ? "Atualizar Propriedade" : "Salvar Propriedade"}
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