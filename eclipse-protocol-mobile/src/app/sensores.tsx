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
  getSensores,
  createSensor,
  updateSensor,
  deleteSensor,
  type Sensor,
} from "../services/api";

export default function SensoresScreen() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Sensor | null>(null);

  const [fNome, setFNome] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [fIdPlantacao, setFIdPlantacao] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchSensores();
    }, [])
  );

  async function fetchSensores() {
    try {
      setLoading(true);
      setError(null);
      const data = await getSensores();
      setSensores(data);
    } catch {
      setError("Erro ao carregar sensores.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditItem(null);
    setFNome("");
    setFTipo("");
    setFIdPlantacao("");
    setModalVisible(true);
  }

  function openEdit(item: Sensor) {
    setEditItem(item);
    setFNome(item.nome ?? "");
    setFTipo(item.tipo);
    setFIdPlantacao(String(item.idPlantacao));
    setModalVisible(true);
  }

  async function handleSave() {
    if (!fTipo || !fIdPlantacao) {
      Alert.alert("Atenção", "Preencha o tipo e ID da plantação.");
      return;
    }
    const idPl = parseInt(fIdPlantacao);
    if (isNaN(idPl)) {
      Alert.alert("Atenção", "Informe um ID de plantação válido.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        nome: fNome.trim() || undefined,
        tipo: fTipo.trim(),
        idPlantacao: idPl,
      };
      if (editItem) {
        await updateSensor(editItem.id, payload);
        setSensores((prev) =>
          prev.map((s) => (s.id === editItem.id ? { ...s, ...payload } : s))
        );
      } else {
        const created = await createSensor(payload);
        setSensores((prev) => [...prev, created]);
      }
      setModalVisible(false);
    } catch (err: any) {
      const apiErr = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Erro desconhecido";
      Alert.alert("Erro " + (err?.response?.status ?? ""), String(apiErr));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: number, tipo: string) {
    Alert.alert("Excluir sensor", `Deseja excluir o sensor "${tipo}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSensor(id);
            setSensores((prev) => prev.filter((s) => s.id !== id));
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o sensor.");
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

        <Text style={styles.overline}>REDE DE TELEMETRIA</Text>
        <Text style={styles.title}>Sensores IoT</Text>
        <Text style={styles.subtitle}>
          Acompanhe dispositivos conectados em campo e suas leituras mais recentes.
        </Text>

        <TouchableOpacity activeOpacity={0.85} style={styles.newButton} onPress={openCreate}>
          <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Novo Sensor</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#58C7FF" />
            <Text style={styles.loadingText}>Carregando sensores...</Text>
          </View>
        )}

        {error && !loading && (
          <TouchableOpacity style={styles.errorBox} onPress={fetchSensores}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error} Toque para tentar novamente.</Text>
          </TouchableOpacity>
        )}

        {!loading && !error && sensores.length === 0 && (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="access-point-network-off" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>Nenhum sensor cadastrado.</Text>
          </View>
        )}

        {sensores.map((sensor) => (
          <View key={sensor.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="access-point-network" size={30} color="#58C7FF" />
              </View>
              <View style={styles.info}>
                <Text style={styles.codigo}>{sensor.nome ?? `Sensor #${sensor.id}`}</Text>
                <Text style={styles.tipo}>{sensor.tipo}</Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="sprout-outline" size={18} color="#9DEBFF" />
                <Text style={styles.detailText}>Plantação ID: {sensor.idPlantacao}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => openEdit(sensor)}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(sensor.id, sensor.tipo)}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionText}>Excluir</Text>
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
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editItem ? "Editar Sensor" : "Novo Sensor"}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            <Text style={styles.modalLabel}>Nome (opcional)</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: TEMP-001" placeholderTextColor="rgba(255,255,255,0.45)" value={fNome} onChangeText={setFNome} />

            <Text style={styles.modalLabel}>Tipo *</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: TEMPERATURA" placeholderTextColor="rgba(255,255,255,0.45)" value={fTipo} onChangeText={setFTipo} />

            <Text style={styles.modalLabel}>ID da Plantação *</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: 1" placeholderTextColor="rgba(255,255,255,0.45)" value={fIdPlantacao} onChangeText={setFIdPlantacao} keyboardType="numeric" />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveChip} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveChipText}>Salvar</Text>}
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
  iconBox: { width: 58, height: 58, borderRadius: 20, backgroundColor: "rgba(88,199,255,0.14)", justifyContent: "center", alignItems: "center", marginRight: 14 },
  info: { flex: 1 },
  codigo: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  tipo: { color: "rgba(255,255,255,0.7)", marginTop: 4 },
  details: { marginTop: 14, gap: 9 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { color: "rgba(255,255,255,0.78)", fontSize: 13 },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  editButton: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, backgroundColor: "rgba(88,199,255,0.20)", paddingVertical: 12, borderRadius: 14 },
  deleteButton: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, backgroundColor: "rgba(255,80,80,0.20)", paddingVertical: 12, borderRadius: 14 },
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

