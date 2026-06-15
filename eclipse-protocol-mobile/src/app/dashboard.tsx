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

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

function ModuleCard({
  title,
  description,
  icon,
  route,
  alert,
}: {
  title: string;
  description: string;
  icon: IconName;
  route: string;
  alert?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.moduleCard, alert && styles.alertCard]}
      onPress={() => router.push(route as never)}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons
          name={icon}
          size={34}
          color={alert ? "#FF8A8A" : "#58C7FF"}
        />
      </View>

      <Text style={styles.moduleTitle}>{title}</Text>
      <Text style={styles.moduleDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  return (
    <LinearGradient colors={["#000814", "#001D2E", "#003D35"]} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.eclipseGlow} />
        <View style={styles.eclipseDark} />

        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Painel Principal</Text>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/perfil")}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={30}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.overline}>ORBITAL FARM COMMAND</Text>
          <Text style={styles.title}>Eclipse Protocol</Text>
          <Text style={styles.subtitle}>
            Centro de comando para monitoramento agrícola com sensores IoT,
            leituras ambientais e alertas inteligentes.
          </Text>
        </View>

        <View style={styles.statusPanel}>
          <View style={styles.statusIcon}>
            <MaterialCommunityIcons
              name="satellite-variant"
              size={30}
              color="#58C7FF"
            />
          </View>

          <View style={styles.statusTextBox}>
            <Text style={styles.statusTitle}>Sistema em modo demonstração</Text>
            <Text style={styles.statusDescription}>
              Os dados reais serão carregados após a integração com a API Java.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Módulos operacionais</Text>

        <View style={styles.grid}>
          <ModuleCard
            title="Propriedades"
            description="Gerencie propriedades rurais e suas localizações."
            icon="home-city-outline"
            route="/propriedades"
          />

          <ModuleCard
            title="Plantações"
            description="Acompanhe cultivos, áreas produtivas e estágios."
            icon="sprout-outline"
            route="/plantacoes"
          />

          <ModuleCard
            title="Sensores IoT"
            description="Monitore dispositivos conectados em campo."
            icon="access-point-network"
            route="/sensores"
          />

          <ModuleCard
            title="Leituras"
            description="Visualize temperatura, umidade, chuva e NDVI."
            icon="chart-line"
            route="/leituras"
          />

          <ModuleCard
            title="Localização"
            description="Consulte coordenadas e regiões monitoradas."
            icon="map-marker-radius-outline"
            route="/localizacao"
          />

          <ModuleCard
            title="Alertas"
            description="Acompanhe condições críticas em tempo real."
            icon="alert-circle-outline"
            route="/alertas"
            alert
          />
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
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 30,
  },

  eclipseGlow: {
    position: "absolute",
    top: -64,
    right: -88,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(0,117,216,0.28)",
  },

  eclipseDark: {
    position: "absolute",
    top: -28,
    right: -52,
    width: 238,
    height: 238,
    borderRadius: 119,
    backgroundColor: "rgba(0,12,22,0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  topBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  topBarText: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },

  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
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
    fontSize: 35,
    fontWeight: "900",
  },

  subtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 350,
  },

  statusPanel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    marginBottom: 26,
  },

  statusIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(88,199,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  statusTextBox: {
    flex: 1,
  },

  statusTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  statusDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 18,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  moduleCard: {
    width: "47%",
    minHeight: 178,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.23)",
  },

  alertCard: {
    backgroundColor: "rgba(255,80,80,0.16)",
    borderColor: "rgba(255,120,120,0.36)",
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  moduleTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  moduleDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 18,
  },
});