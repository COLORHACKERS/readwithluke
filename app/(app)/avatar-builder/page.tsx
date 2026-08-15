"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabase";
import "./avatar-builder.css";

type AvatarConfig = {
  skin: string;
  hair: string;
  hairColor: string;
  shirt: string;
  pants: string;
  accessory: string;
};

type Category =
  | "skin"
  | "hair"
  | "hairColor"
  | "shirt"
  | "pants"
  | "accessory";

const DEFAULT_AVATAR: AvatarConfig = {
  skin: "medium",
  hair: "curly",
  hairColor: "black",
  shirt: "orange",
  pants: "jeans",
  accessory: "none",
};

const avatarOptions = {
  skin: [
    { value: "light", label: "Light" },
    { value: "medium-light", label: "Warm" },
    { value: "medium", label: "Medium" },
    { value: "medium-dark", label: "Deep" },
    { value: "dark", label: "Dark" },
  ],

  hair: [
    { value: "curly", label: "Curly" },
    { value: "waves", label: "Waves" },
    { value: "short", label: "Short" },
    { value: "coils", label: "Coils" },
    { value: "long", label: "Long" },
    { value: "ponytail", label: "Ponytail" },
  ],

  hairColor: [
    { value: "black", label: "Black" },
    { value: "brown", label: "Brown" },
    { value: "blonde", label: "Blonde" },
    { value: "auburn", label: "Auburn" },
  ],

  shirt: [
    { value: "orange", label: "Orange Tee" },
    { value: "blue", label: "Blue Tee" },
    { value: "green", label: "Green Tee" },
    { value: "space", label: "Space Shirt" },
    { value: "dino", label: "Dino Shirt" },
  ],

  pants: [
    { value: "jeans", label: "Jeans" },
    { value: "shorts", label: "Shorts" },
    { value: "cargo", label: "Cargo" },
  ],

  accessory: [
    { value: "none", label: "None" },
    { value: "glasses", label: "Glasses" },
    { value: "explorer", label: "Explorer Hat" },
    { value: "space", label: "Space Helmet" },
    { value: "science", label: "Science Goggles" },
  ],
};

const categoryLabels: {
  key: Category;
  label: string;
}[] = [
  {
    key: "skin",
    label: "FACE",
  },
  {
    key: "hair",
    label: "HAIR",
  },
  {
    key: "hairColor",
    label: "COLOR",
  },
  {
    key: "shirt",
    label: "SHIRT",
  },
  {
    key: "pants",
    label: "BOTTOMS",
  },
  {
    key: "accessory",
    label: "EXTRAS",
  },
];

function normalizeAvatarConfig(
  value: unknown
): AvatarConfig {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return DEFAULT_AVATAR;
  }

  const config =
    value as Partial<AvatarConfig>;

  return {
    skin:
      config.skin ||
      DEFAULT_AVATAR.skin,

    hair:
      config.hair ||
      DEFAULT_AVATAR.hair,

    hairColor:
      config.hairColor ||
      DEFAULT_AVATAR.hairColor,

    shirt:
      config.shirt ||
      DEFAULT_AVATAR.shirt,

    pants:
      config.pants ||
      DEFAULT_AVATAR.pants,

    accessory:
      config.accessory ||
      DEFAULT_AVATAR.accessory,
  };
}

export default function AvatarBuilderPage() {
  const router = useRouter();

  const [childId, setChildId] =
    useState("");

  const [readerName, setReaderName] =
    useState("Reader");

  const [activeCategory, setActiveCategory] =
    useState<Category>("skin");

  const [avatarConfig, setAvatarConfig] =
    useState<AvatarConfig>(
      DEFAULT_AVATAR
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    async function loadAvatar() {
      try {
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          router.push("/signup");
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("active_child_id")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          throw new Error(
            profileError.message
          );
        }

        const activeChildId =
          profile?.active_child_id;

        if (!activeChildId) {
          router.push(
            "/reader-setup"
          );
          return;
        }

        const {
          data: child,
          error: childError,
        } = await supabase
          .from("children")
          .select(
            "id, name, avatar_config"
          )
          .eq(
            "id",
            activeChildId
          )
          .eq(
            "user_id",
            user.id
          )
          .maybeSingle();

        if (childError) {
          throw new Error(
            childError.message
          );
        }

        if (!child) {
          router.push(
            "/reader-setup"
          );
          return;
        }

        setChildId(child.id);

        setReaderName(
          child.name ||
            "Reader"
        );

        setAvatarConfig(
          normalizeAvatarConfig(
            child.avatar_config
          )
        );
      } catch (error) {
        console.error(
          "Avatar load error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Could not load avatar."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAvatar();
  }, [router]);

  function updateAvatar(
    category: Category,
    value: string
  ) {
    setAvatarConfig(
      (current) => ({
        ...current,
        [category]: value,
      })
    );
  }

  async function saveAvatar() {
    if (!childId) {
      return;
    }

    setSaving(true);

    try {
      const {
        error,
      } = await supabase
        .from("children")
        .update({
          avatar_config:
            avatarConfig,
        })
        .eq(
          "id",
          childId
        );

      if (error) {
        throw new Error(
          error.message
        );
      }

      router.push(
        "/dashboard"
      );
    } catch (error) {
      console.error(
        "Avatar save error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Could not save avatar."
      );

      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />

        <main className="avatarBuilderLoading">
          Loading avatar...
        </main>

        <Footer />
      </>
    );
  }

  const options =
    avatarOptions[
      activeCategory
    ];

  return (
    <>
      <Header />

      <main className="avatarBuilderPage">
        <section className="avatarBuilderCard">
          <div className="avatarBuilderIntro">
            <p>
              CREATE YOUR READER
            </p>

            <h1>
              BUILD YOUR
              <span>AVATAR!</span>
            </h1>

            <p className="avatarBuilderDescription">
              Make your Read With Luke
              character look just the way
              you want.
            </p>
          </div>

          <div className="avatarBuilderWorkspace">
            {/* =========================
                AVATAR PREVIEW
            ========================== */}

            <section className="avatarPreviewPanel">
              <div className="avatarName">
                {readerName}
              </div>

              <div
                className="avatarPreview"
                data-skin={
                  avatarConfig.skin
                }
                data-hair={
                  avatarConfig.hair
                }
                data-hair-color={
                  avatarConfig.hairColor
                }
                data-shirt={
                  avatarConfig.shirt
                }
                data-pants={
                  avatarConfig.pants
                }
                data-accessory={
                  avatarConfig.accessory
                }
              >
                <div className="avatarPreviewGlow" />

                <div className="avatarCharacter">
                  <div className="avatarHair" />

                  <div className="avatarHead">
                    <div className="avatarEyes">
                      <span />
                      <span />
                    </div>

                    <div className="avatarSmile" />
                  </div>

                  <div className="avatarBody">
                    <div className="avatarShirt" />

                    <div className="avatarPants" />
                  </div>

                  <div className="avatarAccessory" />
                </div>
              </div>

              <p className="avatarPreviewHint">
                Your avatar will appear on
                your Reading Adventure
                dashboard.
              </p>
            </section>

            {/* =========================
                BUILDER
            ========================== */}

            <section className="avatarControls">
              <div className="avatarCategoryTabs">
                {categoryLabels.map(
                  (category) => (
                    <button
                      key={
                        category.key
                      }
                      type="button"
                      className={
                        activeCategory ===
                        category.key
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setActiveCategory(
                          category.key
                        )
                      }
                    >
                      {
                        category.label
                      }
                    </button>
                  )
                )}
              </div>

              <div className="avatarOptions">
                {options.map(
                  (option) => {
                    const selected =
                      avatarConfig[
                        activeCategory
                      ] ===
                      option.value;

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        className={
                          selected
                            ? "avatarOption selected"
                            : "avatarOption"
                        }
                        onClick={() =>
                          updateAvatar(
                            activeCategory,
                            option.value
                          )
                        }
                      >
                        <span className="avatarOptionPreview">
                          {
                            option.label
                          }
                        </span>

                        <strong>
                          {
                            option.label
                          }
                        </strong>

                        {selected && (
                          <span className="avatarSelectedCheck">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="avatarBuilderActions">
                <button
                  type="button"
                  className="avatarCancelButton"
                  onClick={() =>
                    router.push(
                      "/dashboard"
                    )
                  }
                >
                  BACK
                </button>

                <button
                  type="button"
                  className="avatarSaveButton"
                  onClick={
                    saveAvatar
                  }
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE MY AVATAR"}
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
