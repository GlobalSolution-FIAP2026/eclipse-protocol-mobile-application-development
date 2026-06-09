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

export default function LeiturasScreen() {
  const leituras = [
    {
      titulo: "Temperatura",
      valor: "27.4°C",
      icon: "thermometer",
      color: "#FF9F43",
    },
    {
      titulo: "Umidade",
      valor: "64%",
      icon: "water-percent",
      color: "#58C7FF",
    },
    {
      titulo: "Precipitação",
      valor: "12 mm",
      icon: "weather-rainy",
      color: "#19D991",
    },
    {
      titulo: "NDVI",
      valor: "0.72",
      icon: "chart-line",
      color: "#B388FF",
    },
  ];

  return (
    <LinearGradient colors={["#000814", "#001D2E", "#003D35"]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.eclipseGlow} />
        <View style={styles.eclipseDark} />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.overline}>TELEMETRIA AMBIENTAL</Text>
        <Text style={styles.title}>Leituras</Text>

        <Text style={styles.subtitle}>
          Monitoramento em tempo real das condições ambientais.
        </Text>

        {leituras.map((item, index) => (
          <View key={index} style={styles.card}>
            <View
              style={[
                styles.iconContainer,
                { borderColor: item.color },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={34}
                color={item.color}
              />
            </View>

            <Text style={styles.cardTitle}>{item.titulo}</Text>

            <Text style={[styles.cardValue, { color: item.color }]}>
              {item.valor}
            </Text>
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
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 8,
  },

  subtitle: {
    color: "rgba(255,255,255,0.78)",
    marginTop: 10,
    marginBottom: 24,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  cardValue: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 10,
  },
});