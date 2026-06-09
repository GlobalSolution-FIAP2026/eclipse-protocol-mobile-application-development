import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getLocalizacoes, type Localizacao } from "../services/api";

export default function LocalizacaoScreen() {
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocalizacoes();
  }, []);

  async function fetchLocalizacoes() {
    try {
      setLoading(true);
      setError(null);
      const data = await getLocalizacoes();
      setLocalizacoes(data);
    } catch {
      setError("Erro ao carregar localizações.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#000814", "#001D2E", "#003D35"]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.eclipseGlow} />
        <View style={styles.eclipseDark} />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.overline}>MAPEAMENTO ORBITAL</Text>
        <Text style={styles.title}>Localização</Text>

        <Text style={styles.subtitle}>
          Visualize as propriedades monitoradas e suas coordenadas geográficas.
        </Text>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#58C7FF" />
            <Text style={styles.loadingText}>Carregando localizações...</Text>
          </View>
        )}

        {error && !loading && (
          <TouchableOpacity style={styles.errorBox} onPress={fetchLocalizacoes}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FF6B6B" />
            <Text style={styles.errorText}>{error} Toque para tentar novamente.</Text>
          </TouchableOpacity>
        )}

        {!loading && !error && localizacoes.length === 0 && (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="map-marker-off-outline" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>Nenhuma localização cadastrada.</Text>
          </View>
        )}

        {localizacoes.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  size={30}
                  color="#58C7FF"
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.nome}>{item.cidade} - {item.estado}</Text>
                <Text style={styles.cidade}>{item.pais} · CEP {item.cep}</Text>
              </View>
            </View>

            {(item.latitude != null || item.longitude != null) && (
              <View style={styles.coords}>
                <View style={styles.coordBox}>
                  <Text style={styles.coordLabel}>Latitude</Text>
                  <Text style={styles.coordValue}>{item.latitude ?? "—"}</Text>
                </View>
                <View style={styles.coordBox}>
                  <Text style={styles.coordLabel}>Longitude</Text>
                  <Text style={styles.coordValue}>{item.longitude ?? "—"}</Text>
                </View>
              </View>
            )}
          </View>
        ))}
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
    marginBottom: 22,
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
    marginBottom: 16,
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

  cidade: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },

  coords: {
    flexDirection: "row",
    gap: 10,
  },

  coordBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  coordLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 12,
    fontWeight: "700",
  },

  coordValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
  },
});
   