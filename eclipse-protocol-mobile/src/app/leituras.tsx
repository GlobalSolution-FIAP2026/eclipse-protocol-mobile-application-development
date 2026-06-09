import { useCallback, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getLeituras,
  createLeitura,
  deleteLeitura,
  type Leitura,
} from "../services/api";

export default function LeiturasScreen() {
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fSensor, setFSensor] = useState("");
  const [fTemp, setFTemp] = useState("");
  const [fUmidade, setFUmidade] = useState("");
  const [fPrecipitacao, setFPrecipitacao] = useState("");
  const [fNdvi, setFNdvi] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchLeituras();
    }, [])
  );

  async function fetchLeituras() {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeituras();
      setLeituras(data);
    } catch {
      setError("Erro ao carregar leituras.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setFSensor("");
    setFTemp("");
    setFUmidade("");
    setFPrecipitacao("");
    setFNdvi("");
    setModalVisible(true);
  }

  async function handleSave() {
    if (!fSensor) {
      Alert.alert("Atenção", "Informe o ID do sensor.");
      return;
    }
    const sensorId = parseInt(fSensor);
    if (isNaN(sensorId)) {
      Alert.alert("Atenção", "ID do sensor inválido.");
      return;
    }
    try {
      setSaving(true);
      const created = await createLeitura({
        sensor: sensorId,
        temperatura: fTemp ? parseFloat(fTemp.replace(",", ".")) : undefined,
        umidade: fUmidade ? parseFloat(fUmidade.replace(",", ".")) : undefined,
        precipitacao: fPrecipitacao ? parseFloat(fPrecipitacao.replace(",", ".")) : undefined,
        ndvi: fNdvi ? parseFloat(fNdvi.replace(",", ".")) : undefined,
      });
      setLeituras((prev) => [created, ...prev]);
      setModalVisible(false);
    } catch (err: any) {
      const apiErr = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Erro desconhecido";
      Alert.alert("Erro " + (err?.response?.status ?? ""), String(apiErr));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: number) {
    Alert.alert("Excluir leitura", `Deseja excluir a leitura #${id}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLeitura(id);
            setLeituras((prev) => prev.filter((l) => l.id !== id));
          } catch {
            Alert.alert("Erro", "Não foi possível excluir a leitura.");
          }
        },
      },
    ]);
  }

  const metricItems = [
    { key: "temperatura", label: "Temperatura", icon: "thermometer", color: "#FF9F43", unit: "Â°C" },
    { key: "umidade", label: "Umidade", icon: "water-percent", color: "#58C7FF", unit: "%" },
    { key: "precipitacao", label: "Precipitação", icon: "weather-rainy", color: "#19D991", unit: " mm" },
    { key: "ndvi", label: "NDVI", icon: "chart-line", color: "#B388FF", unit: "" },
  ] as const;

  return (
    <LinearGradient colors={["#000814", "#001D2E", "#003D35"]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.eclipseGlow} />
        <View style={styles.eclipseDark} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.overline}>TELEMETRIA AMBIENTAL</Text>
        <Text style={styles.title}>Leituras</Text>
        <Text style={styles.subtitle}>
          Monitoramento em tempo real das condições ambientais.
        </Text>

        <TouchableOpacity activeOpacity={0.85} style={styles.newButton} onPress={openCreate}>
          <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Nova Leitura</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#58C7FF" />
            <Text style={styles.loadingText}>Carregando leituras...</Text>
          </View>
        )}

        {error && !loading && (
          <TouchableOpacity style={styles.errorBox} onPress={fetchLeituras}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error} Toque para tentar novamente.</Text>
          </TouchableOpacity>
        )}

        {!loading && !error && leituras.length === 0 && (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="chart-box-outline" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>Nenhuma leitura registrada.</Text>
          </View>
        )}

        {leituras.map((leitura) => (
          <View key={leitura.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardId}>Leitura #{leitura.id}</Text>
              <Text style={styles.cardSensor}>Sensor #{leitura.idSensor}</Text>
            </View>

            {leitura.dataLeitura && (
              <Text style={styles.cardDate}>{new Date(leitura.dataLeitura).toLocaleString("pt-BR")}</Text>
            )}

            <View style={styles.metricsGrid}>
              {metricItems.map((m) => {
                const val = leitura[m.key];
                if (val == null) return null;
                return (
                  <View key={m.key} style={styles.metricBox}>
                    <MaterialCommunityIcons name={m.icon as any} size={22} color={m.color} />
                    <Text style={styles.metricLabel}>{m.label}</Text>
                    <Text style={[styles.metricValue, { color: m.color }]}>
                    {val}{m.unit}
                    </Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(leitura.id)}>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nova Leitura</Text>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            <Text style={styles.modalLabel}>ID do Sensor *</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: 1" placeholderTextColor="rgba(255,255,255,0.45)" value={fSensor} onChangeText={setFSensor} keyboardType="numeric" />

            <Text style={styles.modalLabel}>Temperatura (°C)</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: 25.5" placeholderTextColor="rgba(255,255,255,0.45)" value={fTemp} onChangeText={setFTemp} keyboardType="decimal-pad" />

            <Text style={styles.modalLabel}>Umidade (%)</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: 70.0" placeholderTextColor="rgba(255,255,255,0.45)" value={fUmidade} onChangeText={setFUmidade} keyboardType="decimal-pad" />

            <Text style={styles.modalLabel}>Precipitação (mm)</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: 10.0" placeholderTextColor="rgba(255,255,255,0.45)" value={fPrecipitacao} onChangeText={setFPrecipitacao} keyboardType="decimal-pad" />

            <Text style={styles.modalLabel}>NDVI</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: 0.6" placeholderTextColor="rgba(255,255,255,0.45)" value={fNdvi} onChangeText={setFNdvi} keyboardType="decimal-pad" />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveChip} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveChipText}>Registrar</Text>}
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 54, paddingBottom: 30 },
  eclipseGlow: { position: "absolute", top: -70, right: -90, width: 300, height: 300, borderRadius: 150, backgroundColor: "rgba(0,117,216,0.26)", pointerEvents: "none" },
  eclipseDark: { position: "absolute", top: -36, right: -55, width: 235, height: 235, borderRadius: 117.5, backgroundColor: "rgba(0,12,22,0.9)", pointerEvents: "none" },
  backButton: { width: 44, height: 44, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  overline: { color: "#58C7FF", fontSize: 12, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", marginTop: 8 },
  subtitle: { color: "rgba(255,255,255,0.78)", marginTop: 10, marginBottom: 18, lineHeight: 22 },
  newButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "rgba(25,217,145,0.28)", paddingVertical: 16, borderRadius: 18, marginBottom: 20, borderWidth: 1, borderColor: "rgba(25,217,145,0.45)" },
  newButtonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  center: { alignItems: "center", paddingVertical: 40 },
  loadingText: { color: "rgba(255,255,255,0.7)", marginTop: 12 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,80,80,0.15)", borderRadius: 18, padding: 16, marginBottom: 16 },
  errorText: { color: "#FF8A8A", flex: 1 },
  emptyBox: { alignItems: "center", paddingVertical: 50 },
  emptyText: { color: "rgba(255,255,255,0.45)", marginTop: 12, fontSize: 15 },
  card: { backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 24, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.22)" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardId: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  cardSensor: { color: "#58C7FF", fontSize: 13, fontWeight: "700" },
  cardDate: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 4, marginBottom: 12 },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  metricBox: { flex: 1, minWidth: "44%", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 18, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  metricLabel: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "700", marginTop: 6 },
  metricValue: { fontSize: 22, fontWeight: "900", marginTop: 4 },
  deleteButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, backgroundColor: "rgba(255,80,80,0.20)", paddingVertical: 12, borderRadius: 14 },
  actionText: { color: "#FFFFFF", fontWeight: "800" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#001D2E", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  modalTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginBottom: 18 },
  modalLabel: { color: "#FFFFFF", fontSize: 13, fontWeight: "800", marginBottom: 6 },
  modalInput: { backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", paddingHorizontal: 14, paddingVertical: 12, color: "#FFFFFF", fontSize: 14, marginBottom: 14 },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 6 },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.10)", alignItems: "center" },
  cancelText: { color: "rgba(255,255,255,0.8)", fontWeight: "800" },
  saveChip: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: "rgba(25,217,145,0.35)", alignItems: "center" },
  saveChipText: { color: "#FFFFFF", fontWeight: "900" },
});
