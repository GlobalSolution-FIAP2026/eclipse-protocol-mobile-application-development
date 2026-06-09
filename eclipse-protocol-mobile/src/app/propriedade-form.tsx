import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
import {
  getStoredUserId,
  createLocalizacao,
  createPropriedade,
  updatePropriedade,
  getPropriedade,
} from "../services/api";

export default function PropriedadeFormScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    idLocalizacao?: string;
    idUsuario?: string;
  }>();
  const isEdit = !!params.id;

  const [nome, setNome] = useState("");
  const [proprietario, setProprietario] = useState("");
  const [area, setArea] = useState("");
  const [tipoSolo, setTipoSolo] = useState("");
  // Localização fields (used only for create)
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("Brasil");
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadPropriedade();
    }
  }, []);

  async function loadPropriedade() {
    try {
      setLoadingData(true);
      const prop = await getPropriedade(Number(params.id));
      setNome(prop.nome);
      setProprietario(prop.proprietario);
      setArea(String(prop.areaTotal));
      setTipoSolo(prop.tipoSolo ?? "");
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados da propriedade.");
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSalvar() {
    if (!nome || !proprietario || !area) {
      Alert.alert("Atenção", "Preencha nome, proprietário e área.");
      return;
    }
    if (!isEdit && (!cidade || !estado || !cep)) {
      Alert.alert("Atenção", "Preencha cidade, estado e CEP para a localização.");
      return;
    }

    const areaNum = parseFloat(area.replace(",", "."));
    if (isNaN(areaNum) || areaNum <= 0) {
      Alert.alert("Atenção", "Informe uma área válida em hectares.");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        const idLoc = Number(params.idLocalizacao);
        const idUsu = Number(params.idUsuario);
        if (!idLoc || !idUsu) {
          Alert.alert("Erro", "Dados de localização inválidos. Volte e abra a propriedade novamente.");
          return;
        }
        await updatePropriedade(Number(params.id), {
          nome: nome.trim(),
          proprietario: proprietario.trim(),
          areaTotal: areaNum,
          tipoSolo: tipoSolo.trim() || undefined,
          idLocalizacao: idLoc,
          idUsuario: idUsu,
        });
        Alert.alert("Sucesso", "Propriedade atualizada com sucesso!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        const userId = await getStoredUserId();
        if (!userId) {
          Alert.alert("Erro", "Usuário não autenticado.");
          return;
        }
        const loc = await createLocalizacao({
          cidade: cidade.trim(),
          estado: estado.trim().toUpperCase().slice(0, 2),
          pais: pais.trim(),
          cep: cep.trim(),
          latitude: 0,
          longitude: 0,
        });
        await createPropriedade({
          nome: nome.trim(),
          proprietario: proprietario.trim(),
          areaTotal: areaNum,
          tipoSolo: tipoSolo.trim() || undefined,
          idLocalizacao: loc.id,
          idUsuario: userId,
        });
        Alert.alert("Sucesso", "Propriedade criada com sucesso!", [
          { text: "OK", onPress: () => router.replace("/propriedades") },
        ]);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Erro desconhecido";
      Alert.alert("Erro " + (err?.response?.status ?? ""), String(msg));
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <LinearGradient colors={["#000814", "#001D2E", "#003D35"]} style={styles.page}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#58C7FF" />
        </View>
      </LinearGradient>
    );
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
          <Text style={styles.title}>{isEdit ? "Editar Propriedade" : "Nova Propriedade"}</Text>
          <Text style={styles.subtitle}>
            {isEdit
              ? "Atualize os dados da área rural."
              : "Registre uma área rural para monitoramento inteligente."}
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

            <Text style={styles.label}>Proprietário *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: João Silva"
              placeholderTextColor="rgba(255,255,255,0.55)"
              value={proprietario}
              onChangeText={setProprietario}
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

            {!isEdit && (
              <>
                <Text style={styles.sectionLabel}>Localização</Text>

                <Text style={styles.label}>Cidade *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Campinas"
                  placeholderTextColor="rgba(255,255,255,0.55)"
                  value={cidade}
                  onChangeText={setCidade}
                />

                <Text style={styles.label}>Estado * (2 letras)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: SP"
                  placeholderTextColor="rgba(255,255,255,0.55)"
                  value={estado}
                  onChangeText={setEstado}
                  maxLength={2}
                  autoCapitalize="characters"
                />

                <Text style={styles.label}>País *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Brasil"
                  placeholderTextColor="rgba(255,255,255,0.55)"
                  value={pais}
                  onChangeText={setPais}
                />

                <Text style={styles.label}>CEP *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 13000-000"
                  placeholderTextColor="rgba(255,255,255,0.55)"
                  value={cep}
                  onChangeText={setCep}
                  keyboardType="numeric"
                />
              </>
            )}

            <TouchableOpacity activeOpacity={0.85} onPress={handleSalvar} disabled={loading}>
              <LinearGradient
                colors={["#19D991", "#008B68", "#005C46"]}
                style={styles.saveButton}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="content-save-outline" size={21} color="#FFFFFF" />
                    <Text style={styles.saveText}>{isEdit ? "Atualizar" : "Salvar Propriedade"}</Text>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    color: "#58C7FF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 14,
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