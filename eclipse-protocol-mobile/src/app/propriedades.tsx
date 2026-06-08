import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const propriedades = [
  {
    id: 1,
    nome: "Fazenda Aurora",
    local: "Campinas - SP",
    area: "120 hectares",
    status: "Monitoramento ativo",
  },
  {
    id: 2,
    nome: "Sítio Horizonte",
    local: "Ribeirão Preto - SP",
    area: "350 hectares",
    status: "Sensores conectados",
  },
  {
    id: 3,
    nome: "Estância Eclipse",
    local: "Londrina - PR",
    area: "210 hectares",
    status: "Alerta climático moderado",
  },
];

export default function PropriedadesScreen() {
  function handleDelete(nome: string) {
    Alert.alert(
      "Excluir propriedade",
      `Deseja excluir ${nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive" },
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
                  <Text style={styles.cardLocation}>{item.local}</Text>
                </View>
              </View>

              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="map-outline" size={18} color="#9DEBFF" />
                  <Text style={styles.detailText}>{item.area}</Text>
                </View>

                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="satellite-uplink"
                    size={18}
                    color="#9DEBFF"
                  />
                  <Text style={styles.detailText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push("/propriedade-form")}
                >
                  <MaterialCommunityIcons name="pencil-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.nome)}
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