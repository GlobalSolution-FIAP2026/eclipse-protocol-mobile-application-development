import { router, usePathname } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const items = [
  { label: "Home", icon: "view-dashboard-outline", route: "/dashboard" },
  { label: "Propriedades", icon: "home-city-outline", route: "/propriedades" },
  { label: "Sensores", icon: "access-point-network", route: "/sensores" },
  { label: "Alertas", icon: "alert-circle-outline", route: "/alertas" },
  { label: "Perfil", icon: "account-circle-outline", route: "/perfil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const active = pathname === item.route;

        return (
          <TouchableOpacity
            key={item.route}
            style={styles.item}
            onPress={() => router.push(item.route as never)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={24}
              color={active ? "#58C7FF" : "rgba(255,255,255,0.55)"}
            />

            <Text style={[styles.label, active && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 72,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  label: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },

  activeLabel: {
    color: "#58C7FF",
  },
});