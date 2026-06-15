import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const alertas = [
  { id: 1, titulo: "Umidade crítica", local: "Milho Segunda Safra", nivel: "Alto", descricao: "Umidade do solo abaixo do recomendado." },
  { id: 2, titulo: "Sensor offline", local: "Fazenda Aurora", nivel: "Médio", descricao: "Sensor RAIN-009 sem comunicação." },
  { id: 3, titulo: "NDVI em atenção", local: "Café Premium", nivel: "Moderado", descricao: "Índice vegetativo abaixo da média esperada." },
];

function getNivelColor(nivel: string) {
  if (nivel === "Alto") return "#FF6B6B";
  if (nivel === "Médio") return "#FFD166";
  return "#58C7FF";
}

export default function AlertasScreen() {
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

        {alertas.map((alerta) => (
          <View key={alerta.id} style={styles.card}>
            <View style={styles.header}>
              <View style={[styles.iconBox, { borderColor: getNivelColor(alerta.nivel) }]}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={30}
                  color={getNivelColor(alerta.nivel)}
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.alertTitle}>{alerta.titulo}</Text>
                <Text style={styles.local}>{alerta.local}</Text>
              </View>

              <Text style={[styles.badge, { color: getNivelColor(alerta.nivel) }]}>
                {alerta.nivel}
              </Text>
            </View>

            <Text style={styles.description}>{alerta.descricao}</Text>
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
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  alertTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  local: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  badge: {
    fontSize: 12,
    fontWeight: "900",
  },
  description: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
  },
});