"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "../admin.css";

type LearnItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  image_url: string | null;
  category: string | null;
  is_published: boolean;
};

export default function LearnAdminPage() {
  const [items, setItems] = useState<LearnItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("Learning");
  const [isPublished, setIsPublished] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function loadItems() {
    const { data, error } = await supabase
      .from("learn_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setItems(data || []);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setCoverUrl("");
    setImageUrl("");
    setCategory("Learning");
    setIsPublished(false);
    setMessage("");
  }

  async function uploadImage(file: File, folder: string) {
    const ext = file.name.split(".").pop();
    const filePath = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("book-images")
      .upload(filePath, file);

    if (error) {
      alert(error.message);
      return "";
    }

    const { data } = supabase.storage.from("book-images").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleCoverUpload(file: File) {
    const url = await uploadImage(file, "learn-covers");
    if (url) setCoverUrl(url);
  }

  async function handleLearnImageUpload(file: File) {
    const url = await uploadImage(file, "learn-images");
    if (url) setImageUrl(url);
  }

  function editItem(item: LearnItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setDescription(item.description || "");
    setCoverUrl(item.cover_url || "");
    setImageUrl(item.image_url || "");
    setCategory(item.category || "Learning");
    setIsPublished(item.is_published);
    setMessage(`Editing "${item.title}"`);
  }

  async function saveItem(publishNow = false) {
    if (!title.trim() || !slug.trim()) {
      alert("Please add a title and slug.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      title,
      slug,
      description,
      cover_url: coverUrl,
      image_url: imageUrl,
      category,
      is_published: publishNow ? true : isPublished,
    };

    if (editingId) {
      const { error } = await supabase
        .from("learn_items")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("learn_items")
        .insert(payload)
        .select()
        .single();

      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }

      setEditingId(data.id);
    }

    setIsPublished(publishNow ? true : isPublished);
    setMessage(publishNow ? "Published successfully!" : "Saved successfully!");
    setSaving(false);
    loadItems();
  }

  return (
    <main className="adminPage">
      <section className="adminHeader">
        <p>READ WITH LUKE ADMIN</p>
        <h1>{editingId ? "Edit Learn Item" : "Add Learn Item"}</h1>
        {message && <div className="successMessage">{message}</div>}
      </section>

      <section className="bookList">
        <div className="bookListTop">
          <h2>Learn With Luke</h2>
          <button onClick={resetForm}>+ New Learn Item</button>
        </div>

        {items.map((item) => (
          <div className="bookRow" key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.is_published ? "Published" : "Draft"}</span>
            </div>

            <button onClick={() => editItem(item)}>Edit</button>
          </div>
        ))}
      </section>

      <section className="adminCard">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!editingId) setSlug(createSlug(e.target.value));
          }}
          placeholder="Letter Sounds"
        />

        <label>Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(createSlug(e.target.value))}
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Learning</option>
          <option>Letters</option>
          <option>Numbers</option>
          <option>Phonics</option>
          <option>Colors</option>
          <option>Shapes</option>
          <option>Animals</option>
        </select>

        <label>Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverUpload(file);
          }}
        />

        {coverUrl && (
          <img src={coverUrl} alt="Cover preview" className="coverPreview" />
        )}

        <label>Learn Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleLearnImageUpload(file);
          }}
        />

        {imageUrl && (
          <img src={imageUrl} alt="Learn preview" className="coverPreview" />
        )}
      </section>

      <div className="adminActions">
        <button onClick={() => saveItem(false)} disabled={saving}>
          {saving ? "Saving..." : "Save Draft"}
        </button>

        <button
          className="publishButton"
          onClick={() => saveItem(true)}
          disabled={saving}
        >
          Publish Learn Item
        </button>
      </div>
    </main>
  );
}