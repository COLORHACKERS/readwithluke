"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "../../admin.css";

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function uploadImage(file: File, folder: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("book-images")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage.from("book-images").getPublicUrl(fileName);

  return data.publicUrl;
}

export default function NewBookPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [ageLevel, setAgeLevel] = useState("");
  const [storyType, setStoryType] = useState("");
  const [characters, setCharacters] = useState("");
  const [tags, setTags] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    try {
      const finalSlug = slug || makeSlug(title);

      let coverUrl = "";
      let heroUrl = "";

      if (coverFile) {
        coverUrl = await uploadImage(coverFile, "covers");
      }

      if (heroFile) {
        heroUrl = await uploadImage(heroFile, "heroes");
      }

      const { data: book, error } = await supabase
        .from("books")
        .insert({
          title,
          slug: finalSlug,
          description,
          age_level: ageLevel,
          story_type: storyType,
          characters,
          tags,
          cover_url: coverUrl,
          hero_url: heroUrl,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/admin/books/${book.id}/pages`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong saving this story.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="adminFormPage">
      <div className="adminFormWrap">
        <div className="adminFormHeader">
          <p>READ WITH LUKE ADMIN</p>
          <h1>Create Story</h1>
          <span>
            Add the story info, upload cover and hero images, then continue to
            the page uploader.
          </span>
        </div>

        <form className="adminForm" onSubmit={handleSubmit}>
          <div className="adminFormGrid">
            <div className="adminField">
              <label>Story Title</label>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(makeSlug(e.target.value));
                }}
                placeholder="The Dragon Who Loved Pancakes"
                required
              />
            </div>

            <div className="adminField">
              <label>Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(makeSlug(e.target.value))}
                placeholder="the-dragon-who-loved-pancakes"
                required
              />
            </div>

            <div className="adminField full">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A fun bedtime adventure..."
              />
            </div>

            <div className="adminField">
              <label>Age Level</label>
              <input
                value={ageLevel}
                onChange={(e) => setAgeLevel(e.target.value)}
                placeholder="Ages 4-7"
              />
            </div>

            <div className="adminField">
              <label>Story Type</label>
              <input
                value={storyType}
                onChange={(e) => setStoryType(e.target.value)}
                placeholder="Adventure, Bedtime, Funny"
              />
            </div>

            <div className="adminField">
              <label>Characters</label>
              <input
                value={characters}
                onChange={(e) => setCharacters(e.target.value)}
                placeholder="Luke, Sammy, Zip"
              />
            </div>

            <div className="adminField">
              <label>Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="funny, dogs, adventure"
              />
            </div>
          </div>

          <div className="adminUploadGrid">
            <label className="adminUploadBox">
              <h3>Cover Image</h3>
              <p>{coverFile ? coverFile.name : "Click to upload"}</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />
            </label>

            <label className="adminUploadBox">
              <h3>Hero Image</h3>
              <p>{heroFile ? heroFile.name : "Click to upload"}</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button className="adminSubmitBtn" disabled={saving}>
            {saving ? "Saving Story..." : "Create Story + Upload Pages"}
          </button>
        </form>
      </div>
    </main>
  );
}