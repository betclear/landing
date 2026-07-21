import { ImageResponse } from "next/og";

export const alt = "BetClear — Block gambling websites on iPhone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#081113",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#7ed6bc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#081113",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            B
          </div>
          <div style={{ color: "#f5f7f3", fontSize: 30, fontWeight: 600 }}>
            BetClear
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#f5f7f3",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 940,
            }}
          >
            Block gambling websites on iPhone.
          </div>
          <div style={{ color: "#a9bab6", fontSize: 30, maxWidth: 860 }}>
            Make the next bet harder to reach. 348,000+ gambling sites blocked,
            system-wide, updated automatically.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#7ed6bc",
            fontSize: 26,
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: "#7ed6bc",
            }}
          />
          Protection active · betclear.app
        </div>
      </div>
    ),
    { ...size },
  );
}
