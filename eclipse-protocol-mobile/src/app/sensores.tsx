import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const sensores = [
  {
    id: 1,
    codigo: "TEMP-001",
    tipo: "Temperatura",
    local: "Soja Safra 2026",
    status: "Online",
    valor: "27.4°C",
  },
  {
    id: 2,
    codigo: "UMID-014",
    tipo: "Umidade do Solo",
    local: "Milho Segunda Safra",
    status: "Online",
    valor: "64%",
  },
  {
    id: 3,
    codigo: "NDVI-022",
    tipo: "Índice NDVI",
    local: "Café Premium",
    status: "Atenção",
    valor: "0.52",
  },
  {
    id: 4,
    codigo: "RAIN-009",
    tipo: "Precipitação",
    local: "Fazenda Aurora",
    status: "Offline",
    valor: "--",
  },
];

function getStatusColor(status: string) {
  if (status === "Online") return "#19D991";
  if (status === "Atenção") return "#FFD166";
  return "#FF6B6B";
}

export default function SensoresScreen() {
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

        <View style={styles.panel}>
          <MaterialCommunityIcons name="satellite-uplink" size={28} color="#58C7FF" />
          <View style={styles.panelTextBox}>
            <Text style={styles.panelTitle}>Conexão orbital simulada</Text>
            <Text style={styles.panelText}>
              Dados visuais temporários até a integração com a API Java.
            </Text>
          </View>
        </View>

        {sensores.map((sensor) => (
          <View key={sensor.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="access-point-network"
                  size={30}
                  color="#58C7FF"
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.codigo}>{sensor.codigo}</Text>
                <Text style={styles.tipo}>{sensor.tipo}</Text>
              </View>

              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(sensor.status) },
                ]}
              />
            </View>

            <View style={styles.readingBox}>
              <Text style={styles.readingLabel}>Última leitura</Text>
              <Text style={styles.readingValue}>{sensor.valor}</Text>
            </View>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="sprout-outline" size={18} color="#9DEBFF" />
                <Text style={styles.detailText}>{sensor.local}</Text>
              </View>

              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="signal-variant"
                  size={18}
                  color={getStatusColor(sensor.status)}
                />
                <Text style={styles.detailText}>Status: {sensor.status}</Text>
              </View>
            </View>
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
    marginBottom: 22,
  },

  panel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    marginBottom: 20,
  },

  panelTextBox: {
    flex: 1,
    marginLeft: 12,
  },

  panelTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  panelText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    marginBottom: 16,
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  info: {
    flex: 1,
  },

  codigo: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  tipo: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },

  statusDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
  },

  readingBox: {
    marginTop: 16,
    backgroundColor: "rgba(0,0,0,0.22)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
  },

  readingLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 12,
    fontWeight: "700",
  },

  readingValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 4,
  },

  details: {
    marginTop: 14,
    gap: 9,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
  },
});