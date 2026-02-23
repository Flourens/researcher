import React from "react";
import * as fs from "fs";
import * as path from "path";
import {
  Document, Page, Text, View, StyleSheet, renderToFile, Font,
} from "@react-pdf/renderer";

Font.registerHyphenationCallback((word: string) => [word]);

const PRIMARY = "#1a3a5c";
const SECONDARY = "#2c5f8a";
const ACCENT_BG = "#e8f0fe";
const TEXT_LIGHT = "#555555";

const s = StyleSheet.create({
  page: {
    paddingTop: 50, paddingBottom: 55, paddingHorizontal: 50,
    fontFamily: "Helvetica", fontSize: 10, lineHeight: 1.45,
  },
  header: {
    position: "absolute", top: 15, left: 50, right: 50,
    flexDirection: "row", justifyContent: "space-between", paddingBottom: 4,
  },
  headerText: { fontSize: 7, color: TEXT_LIGHT },
  footer: {
    position: "absolute", bottom: 18, left: 50, right: 50,
    flexDirection: "row", justifyContent: "space-between", paddingTop: 4,
  },
  footerText: { fontSize: 7, color: TEXT_LIGHT },
  h1: { fontSize: 14, fontFamily: "Helvetica-Bold", color: PRIMARY, marginBottom: 6 },
  h2: { fontSize: 11, fontFamily: "Helvetica-Bold", color: SECONDARY, marginTop: 8, marginBottom: 4 },
  body: { fontSize: 10, lineHeight: 1.5, marginBottom: 4, textAlign: "justify" },
  bold: { fontFamily: "Helvetica-Bold" },
  listItem: { flexDirection: "row", marginBottom: 2, paddingLeft: 6 },
  bullet: { width: 10, fontSize: 10, color: SECONDARY },
  listText: { flex: 1, fontSize: 10, lineHeight: 1.4 },
  thr: { flexDirection: "row", backgroundColor: PRIMARY, paddingVertical: 3, paddingHorizontal: 2 },
  thc: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#fff", paddingHorizontal: 2 },
  tr: { flexDirection: "row", paddingVertical: 2, paddingHorizontal: 2 },
  trAlt: { flexDirection: "row", paddingVertical: 2, paddingHorizontal: 2, backgroundColor: "#f0f3f7" },
  tc: { fontSize: 7, paddingHorizontal: 2, lineHeight: 1.3 },
  bib: { fontSize: 7, lineHeight: 1.3, marginBottom: 2, color: TEXT_LIGHT },
  // Cover
  coverPage: { padding: 50, fontFamily: "Helvetica", justifyContent: "center" },
  coverBanner: { backgroundColor: PRIMARY, padding: 18, marginBottom: 30 },
  coverBannerText: { color: "#fff", fontSize: 8.5, textAlign: "center", letterSpacing: 1 },
  coverTitle: { fontSize: 30, fontFamily: "Helvetica-Bold", color: PRIMARY, textAlign: "center", marginTop: 35, marginBottom: 6 },
  coverSubtitle: { fontSize: 12, color: SECONDARY, textAlign: "center", marginBottom: 30, lineHeight: 1.5 },
  coverBox: { backgroundColor: ACCENT_BG, padding: 16, marginBottom: 12 },
  coverRow: { flexDirection: "row", marginBottom: 4 },
  coverLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: PRIMARY, width: 125 },
  coverValue: { fontSize: 9, flex: 1 },
});

// ─── Components ───
function P({ children }: { children: string }) {
  const parts = children.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={s.body}>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <Text key={i} style={s.bold}>{p.slice(2, -2)}</Text>
          : <Text key={i}>{p}</Text>
      )}
    </Text>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <View style={{ marginBottom: 4 }}>
      {items.map((item, i) => (
        <View key={i} style={s.listItem}>
          <Text style={s.bullet}>{"\u2022"}</Text>
          <Text style={s.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function MdTable({ lines }: { lines: string[] }) {
  const parse = (l: string) => l.split("|").slice(1, -1).map((c) => c.trim());
  const headers = parse(lines[0]);
  const data = lines.filter((l, i) => i > 0 && !l.match(/^\|[\s\-:|]+\|$/)).map(parse);
  const n = headers.length;
  const wMap: Record<number, number[]> = {
    2: [35, 65], 3: [25, 40, 35], 4: [18, 32, 18, 32],
    5: [14, 28, 14, 14, 30], 6: [10, 25, 12, 12, 12, 29],
    7: [5, 18, 13, 13, 13, 13, 25],
  };
  const w = (wMap[n] || headers.map(() => Math.floor(100 / n))).map((v) => `${v}%`);
  return (
    <View style={{ marginVertical: 4 }}>
      <View style={s.thr}>
        {headers.map((h, i) => <Text key={i} style={[s.thc, { width: w[i] }]}>{h}</Text>)}
      </View>
      {data.map((row, ri) => (
        <View key={ri} style={ri % 2 === 0 ? s.tr : s.trAlt}>
          {row.slice(0, n).map((c, ci) => <Text key={ci} style={[s.tc, { width: w[ci] }]}>{c}</Text>)}
        </View>
      ))}
    </View>
  );
}

function Section({ text }: { text: string }) {
  const lines = text.split("\n");
  const els: React.ReactElement[] = [];
  let k = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("## ")) continue;
    if (line.startsWith("### ")) { els.push(<Text key={k++} style={s.h2}>{line.replace("### ", "")}</Text>); continue; }
    if (line.startsWith("|") && line.endsWith("|")) {
      const tl: string[] = [line];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith("|")) { i++; tl.push(lines[i].trim()); }
      if (tl.length >= 3) els.push(<MdTable key={k++} lines={tl} />);
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [line.slice(2)];
      while (i + 1 < lines.length && (lines[i + 1].trim().startsWith("- ") || lines[i + 1].trim().startsWith("* "))) { i++; items.push(lines[i].trim().slice(2)); }
      els.push(<Bullets key={k++} items={items} />);
      continue;
    }
    els.push(<P key={k++}>{line}</P>);
  }
  return <View>{els}</View>;
}

// Header/Footer wrapper for content pages
function ContentPage({ children }: { children: React.ReactNode }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.header} fixed>
        <Text style={s.headerText}>CosTERRA — FFplus Call-2-Type-2</Text>
        <Text style={s.headerText}>Part B — Technical Description</Text>
      </View>
      <View style={s.footer} fixed>
        <Text style={s.footerText}>ALD Engineering & Construction LLC / ZNU</Text>
        <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
      {children}
    </Page>
  );
}

// ─── Load Data ───
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "results/scientific-proposal.json"), "utf-8")
);

// Detect schema: new (FFplus Part B) vs legacy
const isNewSchema = !!data.summary;

// ─── Document ───
const Doc = () => (
  <Document
    title="CosTERRA - FFplus Innovation Study Proposal"
    author="ALD Engineering & Construction LLC"
    subject="FFplus Call-2-Type-2"
    language="en-US"
  >
    {/* Cover Page (excluded from page count) */}
    <Page size="A4" style={s.coverPage}>
      <View style={s.coverBanner}>
        <Text style={s.coverBannerText}>
          FFplus Call-2-Type-2 — Innovation Studies for Generative AI Models
        </Text>
        <Text style={[s.coverBannerText, { marginTop: 2, fontSize: 7 }]}>
          EuroHPC Project 101163317 — EuroHPC Joint Undertaking
        </Text>
      </View>

      <Text style={s.coverTitle}>CosTERRA</Text>
      <Text style={s.coverSubtitle}>
        Cognitive System for Technical Engineering,{"\n"}
        Research & Architectural Documentation
      </Text>
      <Text style={{ fontSize: 10, color: SECONDARY, textAlign: "center", marginBottom: 28, fontFamily: "Helvetica-Oblique" }}>
        A domain-specific generative AI model for automated{"\n"}
        generation of construction cost estimation documents
      </Text>

      <View style={s.coverBox}>
        {([
          ["CALL IDENTIFIER", "FFplus_Call-2-Type-2 (Innovation Studies)"],
          ["MAIN PARTICIPANT", "ALD Engineering & Construction LLC (SME, Ukraine)"],
          ["SUPPORTING PARTNER", "Zaporizhzhia National University — Lab of Parallel & Distributed Computing"],
          ["DURATION", "10 months (September 2026 — June 2027)"],
          ["TOTAL FUNDING", "\u20AC285,000 (ALD: \u20AC185,000 / ZNU: \u20AC100,000)"],
          ["DOCUMENT TYPE", "Part B — Technical Description"],
        ] as [string, string][]).map(([label, value], i) => (
          <View key={i} style={s.coverRow}>
            <Text style={s.coverLabel}>{label}</Text>
            <Text style={s.coverValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={[s.coverBox, { marginTop: 15 }]}>
        <Text style={{ fontSize: 7.5, color: TEXT_LIGHT, textAlign: "center", lineHeight: 1.4 }}>
          This cover page may not be extended. It will be ignored when the page count is checked.{"\n"}
          Confidential — for evaluation purposes only.
        </Text>
      </View>
    </Page>

    {isNewSchema ? (
      <>
        {/* Section 1: Summary */}
        <ContentPage>
          <Text style={s.h1}>Summary</Text>
          <Section text={data.summary} />
        </ContentPage>

        {/* Section 2: Industrial Relevance */}
        <ContentPage>
          <Text style={s.h1}>Industrial Relevance, Potential Impact and Exploitation Plans</Text>
          <Section text={data.industrialRelevance} />
        </ContentPage>

        {/* Section 3: Work Plan */}
        <ContentPage>
          <Text style={s.h1}>Description of the Work Plan, Technological/Algorithmic Approach and Software Development Strategy</Text>
          <Section text={data.workPlan} />
        </ContentPage>

        {/* Section 4: Consortium Quality */}
        <ContentPage>
          <Text style={s.h1}>Quality of the Consortium and Individual Proposers</Text>
          <Section text={data.consortiumQuality} />
        </ContentPage>

        {/* Section 5: Cost Justification + References */}
        <ContentPage>
          <Text style={s.h1}>Justification of Costs and Resources</Text>
          <Section text={data.costJustification} />
          <View style={{ marginTop: 12 }}>
            <Text style={s.h1}>References</Text>
            <View style={{ marginTop: 4 }}>
              {data.bibliography.map((ref: string, i: number) => (
                <Text key={i} style={s.bib}>{ref}</Text>
              ))}
            </View>
          </View>
        </ContentPage>
      </>
    ) : (
      <>
        {/* Legacy schema */}
        <ContentPage>
          <Text style={s.h1}>Abstract</Text>
          <P>{data.abstract}</P>
          <View style={{ marginTop: 12 }}>
            <Text style={s.h1}>1. Introduction</Text>
            <Section text={data.introduction} />
          </View>
        </ContentPage>
        <ContentPage>
          <Text style={s.h1}>2. State of the Art</Text>
          <Section text={data.stateOfTheArt} />
        </ContentPage>
        <ContentPage>
          <Text style={s.h1}>3. Methodology and Technical Approach</Text>
          <Section text={data.methodology} />
        </ContentPage>
        <ContentPage>
          <Text style={s.h1}>4. Work Plan and Implementation</Text>
          <Section text={data.workPlan} />
        </ContentPage>
        <ContentPage>
          <Text style={s.h1}>5. Expected Results and KPIs</Text>
          <Section text={data.expectedResults} />
        </ContentPage>
        <ContentPage>
          <Text style={s.h1}>6. Impact</Text>
          <Section text={data.impact} />
        </ContentPage>
        <ContentPage>
          <Text style={s.h1}>References</Text>
          <View style={{ marginTop: 4 }}>
            {data.bibliography.map((ref: string, i: number) => (
              <Text key={i} style={s.bib}>{ref}</Text>
            ))}
          </View>
        </ContentPage>
      </>
    )}
  </Document>
);

// ─── Render ───
const outPath = path.join(__dirname, "results/CosTERRA-Proposal-FFplus.pdf");

(async () => {
  console.log("Generating CosTERRA proposal PDF (preview)...");
  console.log(`Schema: ${isNewSchema ? "FFplus Part B (5 sections)" : "Legacy (7 sections)"}`);
  const t = Date.now();
  await renderToFile(<Doc />, outPath);
  const sec = Math.round((Date.now() - t) / 1000);
  const mb = (fs.statSync(outPath).size / 1048576).toFixed(2);
  console.log(`PDF saved: ${outPath}`);
  console.log(`Time: ${sec}s | Size: ${mb} MB (max allowed: 5.0 MB)`);
})();
