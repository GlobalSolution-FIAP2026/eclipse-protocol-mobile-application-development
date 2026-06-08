import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DashboardScreen() {
  return (
    <LinearGradient colors={["#000814", "#001D2E", "#003D35"]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.eclipseGlow} />
        <View style={styles.eclipseDark} />

        <Text style={styles.overline}>CENTRO DE COMANDO AGRÍCOLA</Text>
        <Text style={styles.title}>Eclipse Protocol</Text>
        <Text style={styles.subtitle}>
          Monitoramento orbital, sensores IoT e alertas inteligentes para o campo.
        </Text>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardNumber}>12</Text>
            <Text style={styles.cardLabel}>Propriedades</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardNumber}>48</Text>
            <Text style={styles.cardLabel}>Plantações</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardNumber}>128</Text>
            <Text style={styles.cardLabel}>Sensores</Text>
          </View>

          <View style={styles.cardAlert}>
            <Text style={styles.cardNumber}>03</Text>
            <Text style={styles.cardLabel}>Alertas críticos</Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Módulos do Sistema</Text>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/propriedades")}
          >
            <Text style={styles.menuText}>Gerenciar Propriedades</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/plantacoes")}
          >
            <Text style={styles.menuText}>Monitorar Plantações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/sensores")}
          >
            <Text style={styles.menuText}>Sensores IoT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.alertButton}
            onPress={() => router.push("/alertas")}
          >
            <Text style={styles.menuText}>Alertas Ambientais</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 58,
  },
  eclipseGlow: {
    position: "absolute",
    top: -50,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(0,117,216,0.25)",
  },
  eclipseDark: {
    position: "absolute",
    top: -18,
    right: -48,
    width: 225,
    height: 225,
    borderRadius: 112.5,
    backgroundColor: "rgba(0,12,22,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  overline: {
    color: "#58C7FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
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
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 24,
  },
  card: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  cardAlert: {
    width: "47%",
    backgroundColor: "rgba(255,80,80,0.18)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,120,120,0.35)",
  },
  cardNumber: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },
  cardLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginTop: 6,
  },
  panel: {
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  panelTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },
  menuButton: {
    backgroundColor: "rgba(255,255,255,0.13)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  alertButton: {
    backgroundColor: "rgba(255,80,80,0.22)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,120,120,0.34)",
  },
  menuText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});