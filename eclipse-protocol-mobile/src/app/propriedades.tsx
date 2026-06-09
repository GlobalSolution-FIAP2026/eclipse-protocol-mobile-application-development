import { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getPropriedades, deletePropriedade, type Propriedade } from "../services/api";

export default function PropriedadesScreen() {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchPropriedades();
    }, [])
  );

  async function fetchPropriedades() {
    try {
      setLoading(true);
      setError(null);
      const data = await getPropriedades();
      setPropriedades(data);
    } catch {
      setError("Erro ao carregar propriedades.");
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: number, nome: string) {
    Alert.alert(
      "Excluir propriedade",
      `Deseja excluir "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePropriedade(id);
              setPropriedades((prev) => prev.filter((p) => p.id !== id));
            } catch (err: any) {
              const apiErr = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message ?? "Erro desconhecido";
              Alert.alert("Erro " + (err?.response?.status ?? ""), String(apiErr));
            }
          },
        },
      ]
    );
  }

  return (
    <LinearGradient colors={["#000814", "#001D2E", "#003D35"]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.eclipseGlow} />
        <View style={styles.eclipseDark} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.overline}>GESTÃO TERRITORIAL</Text>
        <Text style={styles.title}>Propriedades</Text>
        <Text style={styles.subtitle}>
          Gerencie áreas rurais monitoradas pelo Eclipse Protocol.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.newButton}
          onPress={() => router.push("/propriedade-form")}
        >
          <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Nova Propriedade</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#58C7FF" />
            <Text style={styles.loadingText}>Carregando propriedades...</Text>
          </View>
        )}

        {error && !loading && (
          <TouchableOpacity style={styles.errorBox} onPress={fetchPropriedades}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error} Toque para tentar novamente.</Text>
          </TouchableOpacity>
        )}

        {!loading && !error && propriedades.length === 0 && (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="home-city-outline" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>Nenhuma propriedade cadastrada.</Text>
          </View>
        )}

        <View style={styles.list}>
          {propriedades.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="home-city-outline"
                    size={28}
                    color="#58C7FF"
                  />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardLocation}>Proprietário: {item.proprietario}</Text>
                </View>
              </View>

              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="map-outline" size={18} color="#9DEBFF" />
                  <Text style={styles.detailText}>{item.areaTotal} ha</Text>
                </View>

                {item.tipoSolo && (
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="layers-outline" size={18} color="#9DEBFF" />
                    <Text style={styles.detailText}>{item.tipoSolo}</Text>
                  </View>
                )}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    router.push({
                      pathname: "/propriedade-form",
                      params: {
                        id: item.id,
                        idLocalizacao: item.idLocalizacao,
                        idUsuario: item.idUsuario,
                      },
                    })
                  }
                >
                  <MaterialCommunityIcons name="pencil-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id, item.nome)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.actionText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },

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
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
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
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(25,217,145,0.28)",
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(25,217,145,0.45)",
    marginBottom: 22,
  },

  newButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
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

  list: {
    gap: 16,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(88,199,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  cardLocation: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 4,
  },

  details: {
    marginTop: 16,
    gap: 10,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  editButton: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(88,199,255,0.20)",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(88,199,255,0.36)",
  },

  deleteButton: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,80,80,0.20)",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,120,120,0.36)",
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});