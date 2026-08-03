import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CategorySpendProgress({ data }) {
  const chartData = Object.entries(data).map(([key, value]) => {
    const planned = Number(value.plannedAmount || 0);
    const spent = Number(value.spentAmount || 0);
    let percentUsed =
      planned > 0 ? (spent / planned) * 100 : spent > 0 ? 100 : 0;
    return {
      category: key,
      planned,
      spent,
      percentUsed,
      isUnplanned: planned === 0 && spent > 0,
    };
  });

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Planned vs Actual Spend</Text>

      {chartData.map((item) => {
        // Compute dynamically colored status rules
        let barColor = ["#10b981", "#6366f1"]; // Green -> Indigo default
        if (item.isUnplanned) barColor = ["#be123c", "#fb7185"]; // Rose
        else if (item.percentUsed > 90) barColor = ["#f59e0b", "#f43f5e"]; // Danger

        return (
          <View key={item.category} style={styles.itemContainer}>
            <View style={styles.row}>
              <Text style={styles.categoryName}>{item.category}</Text>
              <Text
                style={[
                  styles.percentText,
                  { color: item.percentUsed > 100 ? "#f43f5e" : "#10b981" },
                ]}
              >
                {item.isUnplanned
                  ? "Unplanned"
                  : `${item.percentUsed.toFixed(0)}%`}
              </Text>
            </View>

            {/* Track Line */}
            <View style={styles.track}>
              <View
                style={[
                  styles.progress,
                  {
                    width: `${Math.min(item.percentUsed, 100)}%`,
                    backgroundColor: barColor[0],
                  },
                ]}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.subText}>
                Spent: ₹{item.spent.toLocaleString()}
              </Text>
              <Text style={styles.subText}>
                {item.planned > 0
                  ? `Goal: ₹${item.planned.toLocaleString()}`
                  : "(no plan)"}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    borderHorizontalWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  itemContainer: { marginBottom: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryName: { fontSize: 14, fontWeight: "600", color: "#334155" },
  percentText: { fontSize: 13, fontWeight: "700" },
  track: {
    height: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 2,
  },
  progress: { height: "100%", borderRadius: 5 },
  subText: { fontSize: 11, color: "#94a3b8", fontWeight: "500" },
});
