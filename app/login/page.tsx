"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 

      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "rgba(15, 16, 32, 0.7)",
      border: "1px solid var(--border)",
      boxShadow: "0 0 40px rgba(0, 0, 0, 0.5), 0 0 0 1px inset rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
      width: "100%",
      padding: "1rem"
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "400px", 
        background: "#fff", 
        borderRadius: "8px", 
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="logo-textadm">Aegis<span>Guard</span></div>
            <p style={{ fontSize: "0.85rem", color: "#666" }}>Admin Control Panel</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.5rem", color: "#333", textTransform: "uppercase" }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.5rem", color: "#333", textTransform: "uppercase" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
            </div>

            {error && (
              <div style={{ 
                padding: "0.75rem", 
                background: "#fef2f2", 
                border: "1px solid #fca5a5", 
                borderRadius: "4px", 
                color: "#991b1b", 
                fontSize: "0.82rem", 
                marginBottom: "1.5rem" 
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#00ffcc",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.9rem",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "background 0.2s"
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <div style={{ 
          padding: "1rem", 
          background: "#fafafa", 
          borderTop: "1px solid #f0f0f0", 
          textAlign: "center"
        }}>
          <Link href="/" style={{ fontSize: "0.8rem", color: "#555", textDecoration: "none" }}>
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}

// Simple internal Link for local navigation within the form footer
function Link({ href, children, style }: { href: string, children: React.ReactNode, style?: any }) {
  return <a href={href} style={style}>{children}</a>;
}
