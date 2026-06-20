import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "../../home.css";
import "./profile.css";

export default function ProfilePage() {
  return (
    <>
      <Header />

      <main className="profilePage">
        <section className="profileHero">
          <img src="/images/home-hero.png" alt="" className="profileBg" />

          <div className="profileCard">
            <div className="profileAvatar">LL</div>

            <h1>Luke Lewis</h1>
            <p>Reader • Adventurer • Story Explorer</p>

            <div className="profileStats">
              <div>
                <strong>12</strong>
                <span>Finished</span>
              </div>

              <div>
                <strong>🔥</strong>
                <span>Streak</span>
              </div>

              <div>
                <strong>3</strong>
                <span>Badges</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}