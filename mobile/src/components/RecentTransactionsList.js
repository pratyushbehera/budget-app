import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecentTransactionsList({ transactions, navigation }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {transactions.map((tx) => {
        const isIncome = tx.type === "income";
        return (
          <View key={tx._id} style={styles.txRow}>
            <View style={styles.leftGroup}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: isIncome ? "#e6f4ea" : "#fce8e6" },
                ]}
              >
                <Text
                  style={{
                    color: isIncome ? "#137333" : "#c5221f",
                    fontWeight: "700",
                  }}
                >
                  {tx.category.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.txCategory}>{tx.category}</Text>
                <Text style={styles.txDate}>
                  {new Date(tx.date).toLocaleDateString("en-IN")}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.txAmount,
                { color: isIncome ? "#10b981" : "#f43f5e" },
              ]}
            >
              {isIncome ? "+" : "-"}₹{tx.amount.toLocaleString()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 24 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  viewAll: { fontSize: 12, fontWeight: "700", color: "#10b981" },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },
  leftGroup: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  txCategory: { fontSize: 14, fontWeight: "700", color: "#334155" },
  txDate: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: "700" },
});
