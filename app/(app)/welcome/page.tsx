import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "../signup/signup.css";

export default function WelcomePage() {
  return (
    <>
      <Header />

      <main className="signupPage">
        <div className="signupCard">
          <h1>WELCOME!</h1>

          <p>
            Your Read With Luke account has been created.
            <br />
            Let's set up your reader profile.
          </p>

          <div style={{ marginTop: "40px" }}>
            <Link href="/profile">
              <button
                style={{
                  width: "100%",
                  height: "90px",
                  border: "0",
                  borderRadius: "999px",
                  background: "#C6542D",
                  color: "white",
                  fontFamily: '"Courier New", monospace',
                  fontSize: "24px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                CREATE PROFILE
              </button>
            </Link>
          </div>

          <p
            style={{
              marginTop: "28px",
              fontSize: "15px",
              lineHeight: "1.4",
            }}
          >
            You'll be able to save reading progress,
            earn rewards, track streaks, and access
            unlimited stories and learnings.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}