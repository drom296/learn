import { PlantlyButton } from "@/components/plantly-button";
import { useUserStore } from "@/store/userStore";
import { theme } from "@/theme";
import { StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const toggleHasOnboarded = useUserStore((state) => state.toggleHasOnboarded);

  return (
    <View style={styles.container}>
      <PlantlyButton title="Back to onboarding" onPress={toggleHasOnboarded} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
});
