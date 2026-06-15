import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const localizacoes = [
  {
    id: 1,
    nome: "Fazenda Aurora",
    cidade: "Campinas - SP",
    latitude: "-22.9056",
    longitude: "-47.0608",
    area: "120 hectares",
  },
  {
    id: 2,
    nome: "Sítio Horizonte",
    cidade: "Ribeirão Preto - SP",
    latitude: "-21.1775",
    longitude: "-47.8103",
    area: "350 hectares",
  },
  {
    id: 3,
    nome: "Estância Eclipse",
    cidade: "Londrina - PR",
    latitude: "-23.3045",
    longitude: "-51.1696",
    area: "210 hectares",
  },
];

export default function LocalizacaoScreen() {
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
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.cidade}>{item.cidade}</Text>
              </View>
            </View>

            <View style={styles.mapFake}>
              <MaterialCommunityIcons name="satellite-variant" size={38} color="#58C7FF" />
              <Text style={styles.mapText}>Área monitorada por telemetria</Text>
            </View>

            <View style={styles.coords}>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Latitude</Text>
                <Text style={styles.coordValue}>{item.latitude}</Text>
              </View>

              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Longitude</Text>
                <Text style={styles.coordValue}>{item.longitude}</Text>
              </View>
            </View>

            <View style={styles.areaBox}>
              <MaterialCommunityIcons name="map-outline" size={18} color="#9DEBFF" />
              <Text style={styles.areaText}>{item.area}</Text>
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

  mapFake: {
    height: 120,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(88,199,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  mapText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    marginTop: 8,
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

  areaBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },

  areaText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
  },
});