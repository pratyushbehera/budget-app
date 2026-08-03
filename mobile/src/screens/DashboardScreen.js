import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategorySpendProgress from "../components/CategorySpendProgress";
import InfoTile from "../components/InfoTile";
import RecentTransactionsList from "../components/RecentTransactionsList";
import { AuthContext } from "../context/AuthContext";

// Mock data mirroring your web backend dashboard structure
const MOCK_DASHBOARD_DATA = {
  overview: {
    totalIncome: 54000,
    totalExpense: 21500,
    savings: 32500,
    topCategory: "Food",
  },
  categoryPlanUsage: {
    Food: { plannedAmount: 5000, spentAmount: 4200 },
    Rent: { plannedAmount: 15000, spentAmount: 15000 },
    Entertainment: { plannedAmount: 2000, spentAmount: 2500 },
    Shopping: { plannedAmount: 0, spentAmount: 1200 }, // Unplanned example
  },
  recentTransactions: [
    {
      _id: "1",
      category: "Salary",
      amount: 54000,
      type: "income",
      date: "2026-03-01T10:00:00Z",
    },
    {
      _id: "2",
      category: "Rent",
      amount: 15000,
      type: "expense",
      date: "2026-03-02T11:00:00Z",
    },
    {
      _id: "3",
      category: "Food",
      amount: 4200,
      type: "expense",
      date: "2026-03-03T12:00:00Z",
    },
  ],
};

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchDashboardData = async () => {
    // Mimic API payload matching dashboardData hook[cite: 8]
    setData(MOCK_DASHBOARD_DATA);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  if (!data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  const hasData =
    data.overview.totalIncome > 0 || data.overview.totalExpense > 0;
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi {user?.firstName} 👋</Text>
          <Text style={styles.subGreeting}>Here’s your financial pulse.</Text>
        </View>

        {hasData ? (
          <View style={styles.contentGap}>
            {/* Info Tiles Grid */}
            <View style={styles.tileGrid}>
              <InfoTile title="Income" amount={data.overview.totalIncome} />
              <InfoTile title="Spend" amount={data.overview.totalExpense} />
              <InfoTile
                title="Savings"
                amount={data.overview.savings}
                helperText={`${(
                  (data.overview.savings / data.overview.totalIncome) *
                  100
                ).toFixed(1)}%`}
              />
              <InfoTile
                title="Top Category"
                amount={data.overview.topCategory}
                isTextAmount
              />
            </View>

            {/* Category Spend Chart/Progress Bars */}
            <CategorySpendProgress data={data.categoryPlanUsage} />

            {/* Recent Transactions Section */}
            <RecentTransactionsList
              transactions={data.recentTransactions}
              navigation={navigation}
            />
          </View>
        ) : (
          /* Empty State */
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              Your financial story starts here
            </Text>
            <Text style={styles.emptySub}>
              Once you start adding transactions, this space will fill up.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate("Transactions")}
            >
              <Text style={styles.ctaText}>Start Adding Transactions</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContainer: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 24 },
  greeting: { fontSize: 28, fontWeight: "800", color: "#0f172a" },
  subGreeting: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
  },
  contentGap: { gap: 24 },
  tileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -6,
  },
  emptyCard: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    textAlign: "center",
    marginTop: 40,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
