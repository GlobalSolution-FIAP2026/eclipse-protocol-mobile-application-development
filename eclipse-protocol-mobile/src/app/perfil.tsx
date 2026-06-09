import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PerfilScreen() {
  function handleLogout() {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => router.push("/login") },
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

        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account-outline" size={46} color="#58C7FF" />
          </View>

          <Text style={styles.name}>Usuário Eclipse</Text>
          <Text style={styles.role}>Administrador da Plataforma</Text>
          <Text style={styles.email}>usuario@eclipseprotocol.com</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Conta e Segurança</Text>

          <View style={styles.option}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color="#58C7FF" />
            <Text style={styles.optionText}>Autenticação JWT ativa</Text>
          </View>

          <View style={styles.option}>
            <MaterialCommunityIcons name="github" size={24} color="#58C7FF" />
            <Text style={styles.optionText}>OAuth2 com GitHub</Text>
          </View>

          <View style={styles.option}>
            <MaterialCommunityIcons name="account-cog-outline" size={24} color="#58C7FF" />
            <Text style={styles.optionText}>Perfil de acesso: Admin</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={22} color="#FFFFFF" />
            <Text style={styles.logoutText}>Encerrar Sessão</Text>
          </TouchableOpacity>
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
  profileBox: {
    alignItems: "center",
    marginBottom: 26,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(88,199,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },
  role: {
    color: "#58C7FF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 6,
  },
  email: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    marginTop: 6,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 18,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
  },
  optionText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontWeight: "700",
  },
  logoutButton: {
    marginTop: 22,
    backgroundColor: "rgba(255,80,80,0.22)",
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,120,120,0.38)",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});