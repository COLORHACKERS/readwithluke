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

          <div className="profileSettings">
            <div className="profileTop">
              <div className="profileAvatar">LL</div>
              <div>
                <h1>Profile</h1>
                <p>Manage reader info, password, membership, and billing.</p>
              </div>
            </div>

            <div className="settingsGrid">
              <section className="settingsCard">
                <h2>Reader Info</h2>
                <label>First Name</label>
                <input defaultValue="Luke" />

                <label>Last Name</label>
                <input defaultValue="Lewis" />

                <label>Age</label>
                <input defaultValue="6" />

                <button>Save Reader Info</button>
              </section>

              <section className="settingsCard">
                <h2>Parent Account</h2>
                <label>Parent Name</label>
                <input defaultValue="Amanda" />

                <label>Email</label>
                <input defaultValue="parent@email.com" />

                <button>Save Account</button>
              </section>

              <section className="settingsCard">
                <h2>Change Password</h2>
                <label>Current Password</label>
                <input type="password" />

                <label>New Password</label>
                <input type="password" />

                <button>Update Password</button>
              </section>

              <section className="settingsCard">
                <h2>Membership & Billing</h2>
                <p className="planText">Current Plan: Free Trial</p>
                <button>Manage Billing</button>
                <button className="secondaryButton">Upgrade Membership</button>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}