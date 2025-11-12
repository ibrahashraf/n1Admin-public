import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register font for Arabic & English
Font.register({
  family: "Amiri",
  fonts: [
    { src: "/fonts/Amiri-Regular.ttf" },
    { src: "/fonts/Amiri-Bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Amiri", fontSize: 11, lineHeight: 1.6 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "2pt solid #1A1F2B",
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: { width: 80 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1A1F2B", alignSelf: "right" },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { fontWeight: "bold", color: "#1A1F2B" },
  value: { color: "#1A1F2B" },

  sectionTitle: { marginTop: 20, marginBottom: 8, fontSize: 13, fontWeight: "bold", textAlign: "right", color: "#1A1F2B" },

  table: { display: "table", width: "auto", marginTop: 10, border: "1pt solid #ccc" },
  row: { flexDirection: "row" },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#F8F5F0",
    color: "#1A1F2B",
    padding: 6,
    border: "1pt solid #ccc",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    fontSize: 11,
    padding: 6,
    border: "1pt solid #ccc",
    textAlign: "center",
  },

  totalsContainer: { marginTop: 20, alignSelf: "flex-end", width: "100%" },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottom: "1pt solid #ccc",
  },
  totalLabel: { fontWeight: "bold", color: "#1A1F2B" },
  totalValue: { fontWeight: "bold" },

  footer: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 10,
    color: "gray",
    borderTop: "1pt solid #ccc",
    paddingTop: 10,
  },
});

export default function InvoicePDF({ order }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image alt="logo" style={styles.logo} src="/assets/invoicelogo.png" />
          <Text style={styles.title}>إيصال الفاتورة</Text>
        </View>

        {/* Invoice Info */}
        <View>
          <View style={styles.infoRow}>
            <Text style={styles.value}>{order._id}</Text>
            <Text style={styles.label}>: فاتورة #</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.value}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.label}>: بـتـاريـخ</Text>
          </View>
        </View>

        {/* Customer Info */}
        <Text style={styles.sectionTitle}>معلومات العميل</Text>
        <View>
          <View style={styles.infoRow}>
            <Text style={styles.value}>{order.name}</Text>
            <Text style={styles.label}>: السيد\ة</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.value}>{order.phone}</Text>
            <Text style={styles.label}>: الرقم</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.value}>{order.city}</Text>
            <Text style={styles.label}>: المدينة</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.value}>{order.address}</Text>
            <Text style={styles.label}>: العنوان</Text>
          </View>
        </View>

        {/* Items Table */}
        <Text style={styles.sectionTitle}>المنتجات</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.headerCell}>السعر الكلي</Text>
            <Text style={styles.headerCell}>سعر الوحدة</Text>
            <Text style={styles.headerCell}>الكمية</Text>
            <Text style={styles.headerCell}> المنتج</Text>
          </View>
          {order.line_items.map((item, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={styles.cell}>
                جنية {(item.price * item.quantity).toFixed(2)}
              </Text>
              <Text style={styles.cell}>جنية {item.price.toFixed(2)}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={styles.cell}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalLine}>
            <Text>جنية {order.subtotal.toFixed(2)}</Text>
            <Text>اجمالي المنتجات</Text>
          </View>
          <View style={styles.totalLine}>
            <Text>جنية {order.shippingCost.toFixed(2)}</Text>
            <Text>تكلفة الشحن</Text>
          </View>
          <View style={[styles.totalLine, { borderBottom: "none" }]}>
            <Text style={styles.totalValue}>جنية {order.total.toFixed(2)}</Text>
            <Text style={styles.totalLabel}>اجمالي الفاتورة</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
         Venus Outlet! شكرا لك للتسوق مع {"\n"}
          للتواصل يمكنك الاتصال بنا على
           <Text>+20 11 47111094</Text>
        </Text>
      </Page>
    </Document>
  );
}
