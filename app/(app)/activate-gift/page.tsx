"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./activate-gift.css";

type ActivationStage =
  | "loading"
  | "setup"
  | "child"
  | "report"
  | "complete"
  | "existing-account"
  | "already-activated"
  | "error";

type GiftInfo = {
  guardianEmail: string;
  gifterName: string;
  relationship: string;
  progressReportRequested: boolean;
  alreadyActivated: boolean;
};

type Child = {
  id: string;
  name: string;
  age_range: string | null;
  avatar: string | null;
  favorite_theme: string | null;
};

function EyeIcon({
  hidden,
}: {
  hidden: boolean;
}) {
  return hidden ? (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a2 2 0 002.7 2.7" />
      <path d="M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9.5 5 9.5 5a15.6 15.6 0 01-3.1 3.8" />
      <path d="M6.6 6.6C4 8.3 2.5 11 2.5 11S6.5 16 12 16c1.2 0 2.3-.2 3.3-.6" />
    </svg>
  ) : (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12S6.5 7 12 7s9.5 5 9.5 5-4 5-9.5 5-9.5-5-9.5-5z" />
      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

export default function ActivateGiftPage() {
  const [token, setToken] =
    useState("");

  const [giftInfo, setGiftInfo] =
    useState<GiftInfo | null>(null);

  const [stage, setStage] =
    useState<ActivationStage>("loading");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  /* ACCOUNT */

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  /* CHILD */

  const [children, setChildren] =
    useState<Child[]>([]);

  const [
    selectedChildId,
    setSelectedChildId,
  ] = useState("");

  const [
    createNewReader,
    setCreateNewReader,
  ] = useState(false);

  const [childName, setChildName] =
    useState("");

  const [ageRange, setAgeRange] =
    useState("5-6");

  const [avatar, setAvatar] =
    useState("🐸");

  const [
    favoriteTheme,
    setFavoriteTheme,
  ] = useState("Adventure");

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  /* =========================================================
     LOAD GIFT
  ========================================================= */

  useEffect(() => {
    async function loadGift() {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const giftToken =
        params.get("token") || "";

      const claim =
  params.get("claim") === "1";

      setToken(giftToken);

      if (!giftToken) {
        setMessage(
          "This gift activation link is missing its token."
        );

        setStage("error");
        return;
      }

      try {
        const response = await fetch(
          `/api/activate-gift?token=${encodeURIComponent(
            giftToken
          )}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Could not load this gift."
          );
        }

        setGiftInfo({
          guardianEmail:
            data.guardianEmail,

          gifterName:
            data.gifterName,

          relationship:
            data.relationship,

          progressReportRequested:
            Boolean(
              data.progressReportRequested
            ),

          alreadyActivated:
            Boolean(
              data.alreadyActivated
            ),
        });

        if (claim) {
  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  if (!session) {
    setStage(
      "existing-account"
    );
    return;
  }

  try {
    const response =
      await fetch(
        "/api/claim-existing-gift",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            token: giftToken,
          }),
        }
      );

    const claimData =
      await response.json();

    if (!response.ok) {
      throw new Error(
        claimData.error ||
          "Could not claim this gift."
      );
    }

    await loadChildren();

    return;
  } catch (error) {
    console.error(
      "Existing gift claim error:",
      error
    );

    setMessage(
      error instanceof Error
        ? error.message
        : "Could not claim this gift."
    );

    setStage("error");

    return;
  }
}

        if (data.alreadyActivated) {
          setStage(
            "already-activated"
          );
          return;
        }

        setStage("setup");
      } catch (error) {
        console.error(
          "Gift lookup error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Could not load this gift."
        );

        setStage("error");
      }
    }

    loadGift();
  }, []);

  /* =========================================================
     CREATE GUARDIAN ACCOUNT
  ========================================================= */

  async function handleActivation(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!token) {
      setMessage(
        "This gift activation link is invalid."
      );
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Your password must contain at least 6 characters."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setMessage(
        "Your passwords do not match."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/activate-gift",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (
        response.status === 409 &&
        data.accountExists
      ) {
        setMessage(
          data.message ||
            "An account already exists for this email."
        );

        setStage(
          "existing-account"
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not activate this gift."
        );
      }

      const guardianEmail =
        data.email ||
        giftInfo?.guardianEmail;

      if (!guardianEmail) {
        throw new Error(
          "Guardian email could not be found."
        );
      }

      const {
        error: signInError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email:
              guardianEmail,
            password,
          }
        );

      if (signInError) {
        throw new Error(
          "Your gift was activated, but automatic sign in failed. Please sign in with your new password."
        );
      }

      await loadChildren();
    } catch (error) {
      console.error(
        "Gift activation error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not activate this gift."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     LOAD GUARDIAN CHILDREN
  ========================================================= */

  async function loadChildren() {
    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {
      throw new Error(
        "Your login session could not be found."
      );
    }

    const response = await fetch(
      `/api/gift-child?token=${encodeURIComponent(
        token
      )}`,
      {
        headers: {
          Authorization:
            `Bearer ${session.access_token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Could not load readers."
      );
    }

    const childRows =
      (data.children ||
        []) as Child[];

    setChildren(childRows);

    if (
      data.selectedChildId
    ) {
      setSelectedChildId(
        data.selectedChildId
      );
    }

    /*
     * If guardian has no children,
     * immediately show New Reader.
     */
    if (
      childRows.length === 0
    ) {
      setCreateNewReader(true);
    }

    setStage("child");
  }

  /* =========================================================
     ASSIGN CHILD TO GIFT
  ========================================================= */

  async function saveGiftChild() {
    if (
      !createNewReader &&
      !selectedChildId
    ) {
      setMessage(
        "Please choose who this gift is for."
      );
      return;
    }

    if (
      createNewReader &&
      !childName.trim()
    ) {
      setMessage(
        "Please enter the reader's name."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "Your login session could not be found."
        );
      }

      const response = await fetch(
        "/api/gift-child",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            token,

            childId:
              createNewReader
                ? ""
                : selectedChildId,

            name:
              createNewReader
                ? childName.trim()
                : "",

            ageRange,
            avatar,
            favoriteTheme,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not save the reader."
        );
      }

      setSelectedChildId(
        data.childId
      );

      if (
        giftInfo?.progressReportRequested
      ) {
        setStage("report");
      } else {
        setStage("complete");
      }
    } catch (error) {
      console.error(
        "Gift child error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save the reader."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     REPORT CARD CONSENT
  ========================================================= */

  async function handleReportChoice(
    approved: boolean
  ) {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "Your login session could not be found."
        );
      }

      const response = await fetch(
        "/api/gift-report-consent",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            token,
            approved,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not save your choice."
        );
      }

      setStage("complete");
    } catch (error) {
      console.error(
        "Report consent error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save your choice."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="activateGiftPage">
        <section className="activateGiftCard">

          {/* LOADING */}

          {stage === "loading" && (
            <div className="activateGiftLoading">
              Checking your gift...
            </div>
          )}

          {/* ERROR */}

          {stage === "error" && (
            <>
              <div className="activateGiftIcon">
                🎁
              </div>

              <p className="activateGiftEyebrow">
                GIFT INVITATION
              </p>

              <h1>OH NO!</h1>

              <p className="activateGiftDescription">
                {message}
              </p>

              <Link
                href="/"
                className="activateGiftButton"
              >
                GO HOME
              </Link>
            </>
          )}

          {/* ACCOUNT SETUP */}

          {stage === "setup" &&
            giftInfo && (
              <>
                <div className="activateGiftIcon">
                  🎁
                </div>

                <p className="activateGiftEyebrow">
                  A SPECIAL GIFT
                </p>

                <h1>
                  YOUR READING
                  <br />
                  ADVENTURE
                  <br />
                  IS WAITING!
                </h1>

                <p className="activateGiftDescription">
                  <strong>
                    {giftInfo.gifterName}
                  </strong>{" "}
                  gifted your child
                  3 months of Read With
                  Luke!
                </p>

                <p className="activateGiftDescription">
                  Create your password
                  to activate the gift.
                  No payment information
                  is required.
                </p>

                <form
                  className="activateGiftForm"
                  onSubmit={
                    handleActivation
                  }
                >
                  <label>
                    Parent or Guardian Email
                  </label>

                  <input
                    type="email"
                    value={
                      giftInfo.guardianEmail
                    }
                    readOnly
                  />

                  <label>
                    Create Password
                  </label>

                  <div className="activateGiftPasswordField">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Create a password"
                      minLength={6}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                    >
                      <EyeIcon
                        hidden={
                          showPassword
                        }
                      />
                    </button>
                  </div>

                  <label>
                    Confirm Password
                  </label>

                  <div className="activateGiftPasswordField">
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        confirmPassword
                      }
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm password"
                      minLength={6}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) =>
                            !current
                        )
                      }
                    >
                      <EyeIcon
                        hidden={
                          showConfirmPassword
                        }
                      />
                    </button>
                  </div>

                  {passwordsMatch && (
                    <p className="activateGiftPasswordMatch activateGiftPasswordSuccess">
                      ✓ Passwords match
                    </p>
                  )}

                  {passwordsDoNotMatch && (
                    <p className="activateGiftPasswordMatch activateGiftPasswordError">
                      ✕ Passwords do not match
                    </p>
                  )}

                  {message && (
                    <p className="activateGiftMessage">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="activateGiftButton"
                    disabled={
                      loading ||
                      password.length < 6 ||
                      password !==
                        confirmPassword
                    }
                  >
                    {loading
                      ? "ACTIVATING..."
                      : "CREATE ACCOUNT & CONTINUE"}
                  </button>
                </form>
              </>
            )}

          {/* CHILD SELECTION */}

          {stage === "child" && (
            <>
              <div className="activateGiftIcon">
                📚
              </div>

              <p className="activateGiftEyebrow">
                YOUR READER
              </p>

              <h1>
                WHO IS THIS
                <br />
                GIFT FOR?
              </h1>

              {children.length >
                0 &&
                !createNewReader && (
                  <>
                    <p className="activateGiftDescription">
                      Choose the reader who
                      received this gift.
                    </p>

                    <div className="giftChildOptions">
                      {children.map(
                        (child) => (
                          <button
                            key={
                              child.id
                            }
                            type="button"
                            className={
                              selectedChildId ===
                              child.id
                                ? "giftChildOption active"
                                : "giftChildOption"
                            }
                            onClick={() =>
                              setSelectedChildId(
                                child.id
                              )
                            }
                          >
                            <span>
                              {child.avatar ||
                                "📚"}
                            </span>

                            <strong>
                              {child.name}
                            </strong>
                          </button>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      className="activateGiftSecondaryButton"
                      onClick={() => {
                        setCreateNewReader(
                          true
                        );
                        setSelectedChildId(
                          ""
                        );
                        setMessage("");
                      }}
                    >
                      + CREATE A NEW READER
                    </button>
                  </>
                )}

              {createNewReader && (
                <div className="giftNewReaderForm">
                  <p className="activateGiftDescription">
                    Create the reader who
                    received this gift.
                  </p>

                  <label>
                    Reader Name
                  </label>

                  <input
                    type="text"
                    value={childName}
                    onChange={(event) =>
                      setChildName(
                        event.target.value
                      )
                    }
                    placeholder="Reader name"
                  />

                  <label>
                    Age
                  </label>

                  <select
                    value={ageRange}
                    onChange={(event) =>
                      setAgeRange(
                        event.target.value
                      )
                    }
                  >
                    <option value="3-4">
                      Age 3-4
                    </option>

                    <option value="5-6">
                      Age 5-6
                    </option>

                    <option value="7-8">
                      Age 7-8
                    </option>

                    <option value="9+">
                      Age 9+
                    </option>
                  </select>

                  <label>
                    Pick an Avatar
                  </label>

                  <select
                    value={avatar}
                    onChange={(event) =>
                      setAvatar(
                        event.target.value
                      )
                    }
                  >
                    <option value="🐸">
                      🐸 Frog
                    </option>

                    <option value="🦊">
                      🦊 Fox
                    </option>

                    <option value="🦖">
                      🦖 Dinosaur
                    </option>

                    <option value="🚀">
                      🚀 Rocket
                    </option>
                  </select>

                  <label>
                    Favorite Type of Book
                  </label>

                  <select
                    value={
                      favoriteTheme
                    }
                    onChange={(event) =>
                      setFavoriteTheme(
                        event.target.value
                      )
                    }
                  >
                    <option value="Adventure">
                      Adventure
                    </option>

                    <option value="Magic">
                      Magic
                    </option>

                    <option value="Animals">
                      Animals
                    </option>

                    <option value="Space">
                      Space
                    </option>

                    <option value="Ocean">
                      Ocean
                    </option>
                  </select>

                  {children.length >
                    0 && (
                    <button
                      type="button"
                      className="activateGiftTextButton"
                      onClick={() => {
                        setCreateNewReader(
                          false
                        );
                        setMessage("");
                      }}
                    >
                      ← Choose an existing reader
                    </button>
                  )}
                </div>
              )}

              {message && (
                <p className="activateGiftMessage">
                  {message}
                </p>
              )}

              <button
                type="button"
                className="activateGiftButton"
                onClick={
                  saveGiftChild
                }
                disabled={
                  loading ||
                  (createNewReader
                    ? !childName.trim()
                    : !selectedChildId)
                }
              >
                {loading
                  ? "SAVING..."
                  : "CONTINUE"}
              </button>
            </>
          )}

          {/* REPORT APPROVAL */}

          {stage === "report" &&
            giftInfo && (
              <>
                <div className="activateGiftIcon">
                  💌
                </div>

                <p className="activateGiftEyebrow">
                  ONE MORE THING
                </p>

                <h1>
                  SHARE THE
                  <br />
                  ADVENTURE?
                </h1>

                <p className="activateGiftDescription">
                  <strong>
                    {giftInfo.gifterName}
                  </strong>{" "}
                  requested a monthly
                  Read With Luke report
                  card.
                </p>

                <p className="activateGiftDescription">
                  With your permission,
                  we&apos;ll email them a
                  monthly summary of this
                  reader&apos;s reading and
                  learning progress.
                </p>

                <div className="activateGiftPrivacyBox">
                  <strong>
                    You&apos;re in control.
                  </strong>

                  <p>
                    Nothing will be shared
                    unless you choose Yes.
                  </p>
                </div>

                {message && (
                  <p className="activateGiftMessage">
                    {message}
                  </p>
                )}

                <button
                  type="button"
                  className="activateGiftButton"
                  onClick={() =>
                    handleReportChoice(
                      true
                    )
                  }
                  disabled={loading}
                >
                  {loading
                    ? "SAVING..."
                    : "YES, SHARE MONTHLY REPORT CARDS"}
                </button>

                <button
                  type="button"
                  className="activateGiftSecondaryButton"
                  onClick={() =>
                    handleReportChoice(
                      false
                    )
                  }
                  disabled={loading}
                >
                  NO THANKS
                </button>
              </>
            )}

          {/* COMPLETE */}

          {stage === "complete" && (
            <>
              <div className="activateGiftIcon">
                🎁
              </div>

              <p className="activateGiftEyebrow">
                GIFT ACTIVATED
              </p>

              <h1>
                LET&apos;S START
                <br />
                READING!
              </h1>

              <p className="activateGiftDescription">
                Your reader&apos;s
                3-month Read With Luke
                gift is ready.
              </p>

              <Link
                href="/library"
                className="activateGiftButton"
              >
                GO TO THE LIBRARY
              </Link>
            </>
          )}

          {/* EXISTING ACCOUNT */}

          {stage ===
            "existing-account" && (
            <>
              <div className="activateGiftIcon">
                👋
              </div>

              <p className="activateGiftEyebrow">
                WELCOME BACK
              </p>

              <h1>
                YOU ALREADY
                <br />
                HAVE AN ACCOUNT
              </h1>

              <p className="activateGiftDescription">
                {message}
              </p>

             <Link
  href={`/login?next=${encodeURIComponent(
    `/activate-gift?token=${token}&claim=1`
  )}`}
  className="activateGiftButton"
>
  SIGN IN TO CLAIM GIFT
</Link>
            </>
          )}

          {/* ALREADY ACTIVATED */}

          {stage ===
            "already-activated" && (
            <>
              <div className="activateGiftIcon">
                🎁
              </div>

              <p className="activateGiftEyebrow">
                YOUR GIFT
              </p>

              <h1>
                ALREADY
                <br />
                ACTIVATED!
              </h1>

              <p className="activateGiftDescription">
                This gift has already
                been connected to a
                reader.
              </p>

              <Link
                href="/login"
                className="activateGiftButton"
              >
                SIGN IN
              </Link>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
