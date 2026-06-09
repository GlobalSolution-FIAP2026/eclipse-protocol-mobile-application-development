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
  getAlertas,
  createAlerta,
  deleteAlerta,
  type Alerta,
} from "../services/api";

const TIPO_OPTIONS = ["TEMP_ALTA", "TEMP_BAIXA", "UMID_ALTA", "UMID_BAIXA", "NDVI_CRITICO", "PRECIPITACAO_EXCESSIVA"];
const SEV_OPTIONS = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];

function getSeveridadeColor(sev: string) {
  if (sev === "CRITICA") return "#FF4C4C";
  if (sev === "ALTA") return "#FF9F43";
  if (sev === "MEDIA") return "#FFD166";
  return "#58C7FF";
}

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fTipo, setFTipo] = useState("TEMP_ALTA");
  const [fSev, setFSev] = useState("MEDIA");
  const [fMensagem, setFMensagem] = useState("");
  const [fIdLeitura, setFIdLeitura] = useState("");
  const [fIdPlantacao, setFIdPlantacao] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchAlertas();
    }, [])
  );

  async function fetchAlertas() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAlertas();
      setAlertas(data);
    } catch {
      setError("Erro ao carregar alertas.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setFTipo("TEMP_ALTA");
    setFSev("MEDIA");
    setFMensagem("");
    setFIdLeitura("");
    setFIdPlantacao("");
    setModalVisible(true);
  }

  async function handleSave() {
    if (!fMensagem || !fIdLeitura || !fIdPlantacao) {
      Alert.alert("Atenção", "Preencha mensagem, ID da leitura e ID da plantação.");
      return;
    }
    const idLeitura = parseInt(fIdLeitura);
    const idPlantacao = parseInt(fIdPlantacao);
    if (isNaN(idLeitura) || isNaN(idPlantacao)) {
      Alert.alert("Atenção", "IDs inválidos.");
      return;
    }
    try {
      setSaving(true);
      const created = await createAlerta({
        idLeitura,
        idPlantacao,
        tipoAlerta: fTipo,
        severidade: fSev,
        mensagem: fMensagem.trim(),
      });
      setAlertas((prev) => [created, ...prev]);
      setModalVisible(false);
    } catch (err: any) {
      const apiErr = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Erro desconhecido";
      Alert.alert("Erro " + (err?.response?.status ?? ""), String(apiErr));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: number) {
    Alert.alert("Excluir alerta", `Deseja excluir o alerta #${id}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAlerta(id);
            setAlertas((prev) => prev.filter((a) => a.id !== id));
          } catch (err: any) {
            const apiErr = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Erro desconhecido";
            Alert.alert("Erro " + (err?.response?.status ?? ""), String(apiErr));
          }
        },
      },
    ]);
  }

  return (
    <LinearGradient colors={["#000814", "#001D2E", "#003D35"]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.eclipseGlow} />
        <View style={styles.eclipseDark} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.overline}>CENTRAL DE RISCO</Text>
        <Text style={styles.title}>Alertas</Text>
        <Text style={styles.subtitle}>
          Monitore ocorrências críticas geradas a partir das leituras ambientais.
        </Text>

        <TouchableOpacity activeOpacity={0.85} style={styles.newButton} onPress={openCreate}>
          <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Novo Alerta</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#58C7FF" />
            <Text style={styles.loadingText}>Carregando alertas...</Text>
          </View>
        )}

        {error && !loading && (
          <TouchableOpacity style={styles.errorBox} onPress={fetchAlertas}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error} Toque para tentar novamente.</Text>
          </TouchableOpacity>
        )}

        {!loading && !error && alertas.length === 0 && (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="bell-off-outline" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>Nenhum alerta registrado.</Text>
          </View>
        )}

        {alertas.map((alerta) => (
          <View key={alerta.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { borderColor: getSeveridadeColor(alerta.severidade) }]}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={30}
                  color={getSeveridadeColor(alerta.severidade)}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.alertTitle}>{alerta.tipoAlerta.replace(/_/g, " ")}</Text>
                <Text style={styles.local}>
                  {alerta.cultura ? `${alerta.cultura} · ` : ""}Plantação #{alerta.idPlantacao}
                </Text>
              </View>
              <Text style={[styles.badge, { color: getSeveridadeColor(alerta.severidade) }]}>
                {alerta.severidade}
              </Text>
            </View>

            <Text style={styles.description}>{alerta.mensagem}</Text>

            {alerta.dataCriacao && (
              <Text style={styles.date}>{new Date(alerta.dataCriacao).toLocaleString("pt-BR")}</Text>
            )}

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status: <Text style={styles.statusValue}>{alerta.status}</Text></Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(alerta.id)}>
                <MaterialCommunityIcons name="trash-can-outline" size={16} color="#FFFFFF" />
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Novo Alerta</Text>

              <Text style={styles.modalLabel}>Tipo de alerta *</Text>
              <View style={styles.chipRow}>
                {TIPO_OPTIONS.map((t) => (
                  <TouchableOpacity key={t} style={[styles.chip, fTipo === t && styles.chipActive]} onPress={() => setFTipo(t)}>
                    <Text style={[styles.chipText, fTipo === t && styles.chipTextActive]}>{t.replace(/_/g, " ")}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Severidade *</Text>
              <View style={styles.chipRow}>
                {SEV_OPTIONS.map((s) => (
                  <TouchableOpacity key={s} style={[styles.chip, fSev === s && styles.chipActive]} onPress={() => setFSev(s)}>
                    <Text style={[styles.chipText, fSev === s && styles.chipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Mensagem *</Text>
              <TextInput style={[styles.modalInput, { minHeight: 80 }]} placeholder="Descreva o alerta..." placeholderTextColor="rgba(255,255,255,0.45)" value={fMensagem} onChangeText={setFMensagem} multiline />

              <Text style={styles.modalLabel}>ID da Leitura *</Text>
              <TextInput style={styles.modalInput} placeholder="Ex: 1" placeholderTextColor="rgba(255,255,255,0.45)" value={fIdLeitura} onChangeText={setFIdLeitura} keyboardType="numeric" />

              <Text style={styles.modalLabel}>ID da Plantação *</Text>
              <TextInput style={styles.modalInput} placeholder="Ex: 1" placeholderTextColor="rgba(255,255,255,0.45)" value={fIdPlantacao} onChangeText={setFIdPlantacao} keyboardType="numeric" />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveChip} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveChipText}>Criar Alerta</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  backButton: { width: 44, height: 44, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center", marginBottom: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.22)" },
  overline: { color: "#58C7FF", fontSize: 12, fontWeight: "900", letterSpacing: 2.2, marginBottom: 10 },
  title: { color: "#FFFFFF", fontSize: 34, fontWeight: "900" },
  subtitle: { color: "rgba(255,255,255,0.78)", fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 22 },
  newButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "rgba(25,217,145,0.28)", paddingVertical: 16, borderRadius: 18, marginBottom: 20, borderWidth: 1, borderColor: "rgba(25,217,145,0.45)" },
  newButtonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  center: { alignItems: "center", paddingVertical: 40 },
  loadingText: { color: "rgba(255,255,255,0.7)", marginTop: 12 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,80,80,0.15)", borderRadius: 18, padding: 16, marginBottom: 16 },
  errorText: { color: "#FF8A8A", flex: 1 },
  emptyBox: { alignItems: "center", paddingVertical: 50 },
  emptyText: { color: "rgba(255,255,255,0.45)", marginTop: 12, fontSize: 15 },
  card: { backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 26, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.24)", marginBottom: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  iconBox: { width: 58, height: 58, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.10)", borderWidth: 1, alignItems: "center", justifyContent: "center", marginRight: 14 },
  info: { flex: 1 },
  alertTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  local: { color: "rgba(255,255,255,0.7)", marginTop: 4, fontSize: 13 },
  badge: { fontSize: 12, fontWeight: "900" },
  description: { color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 21, marginTop: 12 },
  date: { color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 8 },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  statusLabel: { color: "rgba(255,255,255,0.62)", fontSize: 12 },
  statusValue: { color: "#19D991", fontWeight: "800" },
  deleteButton: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,80,80,0.22)", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12 },
  deleteText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#001D2E", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" },
  modalTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginBottom: 18 },
  modalLabel: { color: "#FFFFFF", fontSize: 13, fontWeight: "800", marginBottom: 6 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  chipActive: { backgroundColor: "rgba(25,217,145,0.3)", borderColor: "#19D991" },
  chipText: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "700" },
  chipTextActive: { color: "#FFFFFF" },
  modalInput: { backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", paddingHorizontal: 14, paddingVertical: 12, color: "#FFFFFF", fontSize: 14, marginBottom: 14, textAlignVertical: "top" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 6 },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.10)", alignItems: "center" },
  cancelText: { color: "rgba(255,255,255,0.8)", fontWeight: "800" },
  saveChip: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: "rgba(25,217,145,0.35)", alignItems: "center" },
  saveChipText: { color: "#FFFFFF", fontWeight: "900" },
});