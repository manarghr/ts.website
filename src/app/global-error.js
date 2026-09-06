"use client";

// Last-resort error boundary
// File: src/app/global-error.js
//
// error.js sits inside the root layout, so it cannot catch a crash in the layout
// itself. This one replaces the whole document when that happens, which is why
// it has to render its own <html> and <body>.
//
// It should almost never appear. Everything here is inline-styled on purpose:
// if the layout failed, the stylesheet it imports may not have loaded either,
// and an unstyled apology is worse than a plain one.

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f3f5f4",
          color: "#354F52",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0 }}>
            TrainSight didn&apos;t load
          </h1>
          <p style={{ marginTop: "1rem", fontSize: "1.05rem", color: "#5b6b6a" }}>
            Something failed before the page could start. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              background: "#52796F",
              color: "#fff",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
          {error?.digest && (
            <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#9aa5a4" }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
