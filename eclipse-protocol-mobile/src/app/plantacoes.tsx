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
  getPlantacoes,
  createPlantacao,
  updatePlantacao,
  deletePlantacao,
  type Plantacao,
} from "../services/api";

const STATUS_OPTIONS = ["ATIVO", "INATIVO", "EM_CRESCIMENTO", "COLHEITA"];

export default function PlantacoesScreen() {
  const [plantacoes, setPlantacoes] = useState<Plantacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Plantacao | null>(null);

  // Form state
  const [fNome, setFNome] = useState("");
  const [fCultura, setFCultura] = useState("");
  const [fArea, setFArea] = useState("");
  const [fStatus, setFStatus] = useState("ATIVO");
  const [fIdPropriedade, setFIdPropriedade] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchPlantacoes();
    }, [])
  );

  async function fetchPlantacoes() {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlantacoes();
      setPlantacoes(data);
    } catch {
      setError("Erro ao carregar plantações.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditItem(null);
    setFNome("");
    setFCultura("");
    setFArea("");
    setFStatus("ATIVO");
    setFIdPropriedade("");
    setModalVisible(true);
  }

  function openEdit(item: Plantacao) {
    setEditItem(item);
    setFNome(item.nome);
    setFCultura(item.cultura);
    setFArea(String(item.areaHectares));
    setFStatus(item.status);
    setFIdPropriedade(String(item.idPropriedade));
    setModalVisible(true);
  }

  async function handleSave() {
    if (!fNome || !fCultura || !fArea || !fIdPropriedade) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    const areaNum = parseFloat(fArea.replace(",", "."));
    if (isNaN(areaNum) || areaNum <= 0) {
      Alert.alert("Atenção", "Informe uma área válida.");
      return;
    }
    const idProp = parseInt(fIdPropriedade);
    if (isNaN(idProp)) {
      Alert.alert("Atenção", "Informe um ID de propriedade válido.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        nome: fNome.trim(),
        cultura: fCultura.trim(),
        areaHectares: areaNum,
        status: fStatus,
        idPropriedade: idProp,
      };
      if (editItem) {
        await updatePlantacao(editItem.id, payload);
        setPlantacoes((prev) =>
          prev.map((p) => (p.id === editItem.id ? { ...p, ...payload } : p))
        );
      } else {
        const created = await createPlantacao(payload);
        setPlantacoes((prev) => [...prev, created]);
      }
      setModalVisible(false);
    } catch (err: any) {
      const apiErr = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Erro desconhecido";
      Alert.alert("Erro " + (err?.response?.status ?? ""), String(apiErr));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: number, nome: string) {
    Alert.alert("Excluir plantação", `Deseja excluir "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePlantacao(id);
            setPlantacoes((prev) => prev.filter((p) => p.id !== id));
          } catch (err: any) {
            const apiErr = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Erro desconhecido";
            Alert.alert("Erro " + (err?.response?.status ?? ""), String(apiErr));
          }
        },
      },
    ]);
  }

  return (
    <LinearGradient
      colors={["#000814", "#001D2E", "#003D35"]}
      style={styles.page}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.eclipseGlow} />
        <View style={styles.eclipseDark} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.overline}>GESTÃO AGRÍCOLA</Text>
        <Text style={styles.title}>Plantações</Text>
        <Text style={styles.subtitle}>
          Gerencie culturas agrícolas monitoradas pelo Eclipse Protocol.
        </Text>

        <TouchableOpacity activeOpacity={0.85} style={styles.newButton} onPress={openCreate}>
          <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Nova Plantação</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#58C7FF" />
            <Text style={styles.loadingText}>Carregando plantações...</Text>
          </View>
        )}

        {error && !loading && (
          <TouchableOpacity style={styles.errorBox} onPress={fetchPlantacoes}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error} Toque para tentar novamente.</Text>
          </TouchableOpacity>
        )}

        {!loading && !error && plantacoes.length === 0 && (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="sprout-outline" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>Nenhuma plantação cadastrada.</Text>
          </View>
        )}

        {plantacoes.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name="sprout-outline" size={30} color="#58C7FF" />
              </View>
              <View style={styles.info}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.propriedade}>Cultura: {item.cultura}</Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="map-outline" size={18} color="#9DEBFF" />
                <Text style={styles.detailText}>{item.areaHectares} ha</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="chart-line" size={18} color="#9DEBFF" />
                <Text style={styles.detailText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => openEdit(item)}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id, item.nome)}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Create / Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editItem ? "Editar Plantação" : "Nova Plantação"}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            <Text style={styles.modalLabel}>Nome *</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: Soja Safra 2026" placeholderTextColor="rgba(255,255,255,0.45)" value={fNome} onChangeText={setFNome} />

            <Text style={styles.modalLabel}>Cultura *</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: Soja" placeholderTextColor="rgba(255,255,255,0.45)" value={fCultura} onChangeText={setFCultura} />

            <Text style={styles.modalLabel}>Área (ha) *</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: 85" placeholderTextColor="rgba(255,255,255,0.45)" value={fArea} onChangeText={setFArea} keyboardType="numeric" />

            <Text style={styles.modalLabel}>Status *</Text>
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusChip, fStatus === s && styles.statusChipActive]}
                  onPress={() => setFStatus(s)}
                >
                  <Text style={[styles.statusChipText, fStatus === s && styles.statusChipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>ID da Propriedade *</Text>
            <TextInput style={styles.modalInput} placeholder="Ex: 1" placeholderTextColor="rgba(255,255,255,0.45)" value={fIdPropriedade} onChangeText={setFIdPropriedade} keyboardType="numeric" />

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
  page: {
    flex: 1,
  },

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
    pointerEvents: "none",
  },

  eclipseDark: {
    position: "absolute",
    top: -36,
    right: -55,
    width: 235,
    height: 235,
    borderRadius: 117.5,
    backgroundColor: "rgba(0,12,22,0.9)",
    pointerEvents: "none",
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
    fontSize: 34,
    fontWeight: "900",
  },

  subtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
  },

  newButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(25,217,145,0.28)",
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(25,217,145,0.45)",
  },

  newButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  center: {
    alignItems: "center",
    paddingVertical: 40,
  },

  loadingText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 12,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,80,80,0.15)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  errorText: {
    color: "#FF8A8A",
    flex: 1,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 50,
  },

  emptyText: {
    color: "rgba(255,255,255,0.45)",
    marginTop: 12,
    fontSize: 15,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },

  modalBox: {
    backgroundColor: "#001D2E",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 18,
  },

  modalLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },

  modalInput: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 14,
  },

  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  statusChipActive: {
    backgroundColor: "rgba(25,217,145,0.3)",
    borderColor: "#19D991",
  },

  statusChipText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "700",
  },

  statusChipTextActive: {
    color: "#FFFFFF",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
  },

  cancelText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "800",
  },

  saveChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(25,217,145,0.35)",
    alignItems: "center",
  },

  saveChipText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(88,199,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  info: {
    flex: 1,
  },

  nome: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  propriedade: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },

  details: {
    marginTop: 16,
    gap: 10,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailText: {
    color: "rgba(255,255,255,0.8)",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(88,199,255,0.20)",
    paddingVertical: 12,
    borderRadius: 14,
  },

  deleteButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,80,80,0.20)",
    paddingVertical: 12,
    borderRadius: 14,
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});