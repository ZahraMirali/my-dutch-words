import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  StyleSheet,
} from "@react-pdf/renderer";
import { dutch } from "../duolingo";

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  wordCell: {
    width: "48%",
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  meaningCell: {
    width: "48%",
    paddingRight: 5,
    borderLeftWidth: 1,
    borderColor: "#000",
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export default function Pdf() {
  return (
    <PDFViewer style={{ width: "100vw", height: "100vh" }}>
      <Document>
        {dutch.map((category, index) => (
          <Page size="A4" key={index}>
            <View style={styles.categoryContainer}>
              {category.words.map((word, i) => (
                <View style={styles.row} key={i}>
                  <Text style={[styles.wordCell, { borderBottomWidth: 0 }]}>
                    {word.word}
                  </Text>
                  <Text style={[styles.meaningCell]}>{word.meaning}</Text>
                </View>
              ))}
            </View>
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
}
