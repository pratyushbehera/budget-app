import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProfile = async () => {
    setData(user);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, []);

  if (!data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    // <SafeAreaView style={styles.safeContainer}>
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.card}>
        <Text>Profile</Text>
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContainer: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    textAlign: "center",
    marginTop: 40,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});
