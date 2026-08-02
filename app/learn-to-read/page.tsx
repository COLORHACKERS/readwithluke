import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./learn-to-read.css";

export default function LearnToReadPage() {
  return (
    <div className="learnToReadPage">
      <Header />

      <main className="learnToReadMain">
        <div className="learnToReadGlow learnToReadGlowOne" />
        <div className="learnToReadGlow learnToReadGlowTwo" />

        <section className="learnToReadCard">
          <p className="learnToReadEyebrow">A NEW ADVENTURE IS COMING</p>

          <h1>Learn to Read with Luke</h1>

          <p className="learnToReadDescription">
            We are creating a playful new space where young readers can build
            confidence, practice words, and discover the joy of reading—one
            story at a time.
          </p>

          <div className="learnToReadBadge">COMING SOON</div>

          <Link href="/" className="learnToReadButton">
            Back to Home
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
