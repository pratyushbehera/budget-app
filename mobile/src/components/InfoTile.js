import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const tileWidth = (width - 52) / 2; // Dynamically splits grid columns cleanly[cite: 8]

const styleMap = {
  Income: { bg: "#10b981", label: "Total Income" },
  Spend: { bg: "#f43f5e", label: "This Month's Spend" },
  Savings: { bg: "#8b5cf6", label: "Savings" },
  "Top Category": { bg: "#f59e0b", label: "Top Category" },
};

export default function InfoTile({ title, amount, helperText, isTextAmount }) {
  const config = styleMap[title] || { bg: "#64748b", label: title };

  return (
    <View style={[styles.tile, { backgroundColor: config.bg }]}>
      <Text style={styles.label}>{config.label}</Text>
      <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
        {isTextAmount ? amount : `₹${amount.toLocaleString("en-IN")}`}
      </Text>
      {helperText && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{helperText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: tileWidth,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    height: 120,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "700",
    uppercase: true,
  },
  amount: { color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 4 },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
