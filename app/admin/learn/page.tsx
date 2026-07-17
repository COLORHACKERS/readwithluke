"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminGate from "@/app/components/AdminGate";
import "../admin.css";
import SeoFields from "@/app/admin/components/SeoFields";

type Book = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  age_range: string | null;
  category: string | null;
  is_published: boolean;

  seo_title: string | null;
  seo_description: string | null;
  seo_image_url: string | null;
  seo_noindex: boolean;
};

type LearnPage = {
  page_number: number;
  text: string;
  image_url: string;
};

const emptyPages: LearnPage[] = Array.from({ length: 20 }, (_, index) => ({
  page_number: index + 1,
  text: "",
  image_url: "",
}));

const learnCategories = [
  "Learning",
  "Space",
  "Science",
  "Animals",
  "Nature",
  "History",
  "Ocean",
  "Dinosaurs",
  "How Things Work",
];

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
  const [pages, setPages] = useState<LearnPage[]>(emptyPages);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
const [seoDescription, setSeoDescription] = useState("");
const [seoImageUrl, setSeoImageUrl] = useState("");
const [seoNoindex, setSeoNoindex] = useState(false);

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

  async function loadPages(learnItemId: string) {
    const { data, error } = await supabase
      .from("learn_pages")
      .select("*")
      .eq("learn_item_id", learnItemId)
      .order("page_number", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    const merged = emptyPages.map((emptyPage) => {
      const found = data?.find(
        (page) => page.page_number === emptyPage.page_number
      );

      return {
        page_number: emptyPage.page_number,
        text: found?.text || "",
        image_url: found?.image_url || "",
      };
    });

    setPages(merged);
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
    setPages(emptyPages);
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

    const { data } = supabase.storage
      .from("book-images")
      .getPublicUrl(filePath);

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

  async function handlePageImageUpload(file: File, pageNumber: number) {
    const url = await uploadImage(file, "learn-pages");

    if (!url) return;

    setPages((current) =>
      current.map((page) =>
        page.page_number === pageNumber
          ? { ...page, image_url: url }
          : page
      )
    );
  }

  function updatePageText(pageNumber: number, text: string) {
    setPages((current) =>
      current.map((page) =>
        page.page_number === pageNumber ? { ...page, text } : page
      )
    );
  }

  async function editItem(item: LearnItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setDescription(item.description || "");
    setCoverUrl(item.cover_url || "");
    setImageUrl(item.image_url || "");
    setCategory(item.category || "Learning");
    setIsPublished(item.is_published);
    setMessage(`Editing "${item.title}"`);

    await loadPages(item.id);
  }

  async function deleteItem(item: LearnItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}" from Learn With Luke?`
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("learn_items")
      .delete()
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    if (editingId === item.id) resetForm();

    setMessage(`Deleted "${item.title}"`);
    setSaving(false);
    loadItems();
  }

  async function savePages(learnItemId: string) {
    const filledPages = pages.filter(
      (page) => page.text.trim() || page.image_url.trim()
    );

    const emptyPageNumbers = pages
      .filter((page) => !page.text.trim() && !page.image_url.trim())
      .map((page) => page.page_number);

    if (filledPages.length > 0) {
      const payload = filledPages.map((page) => ({
        learn_item_id: learnItemId,
        page_number: page.page_number,
        text: page.text,
        image_url: page.image_url,
      }));

      const { error } = await supabase
        .from("learn_pages")
        .upsert(payload, {
          onConflict: "learn_item_id,page_number",
        });

      if (error) throw error;
    }

    if (emptyPageNumbers.length > 0) {
      const { error } = await supabase
        .from("learn_pages")
        .delete()
        .eq("learn_item_id", learnItemId)
        .in("page_number", emptyPageNumbers);

      if (error) throw error;
    }
  }

  async function saveItem(publishNow = false) {
    if (!title.trim() || !slug.trim()) {
      alert("Please add a title and slug.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description,
      cover_url: coverUrl,
      image_url: imageUrl,
      category,
      is_published: publishNow ? true : isPublished,
    };

    try {
      let learnItemId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from("learn_items")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("learn_items")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        learnItemId = data.id;
        setEditingId(data.id);
      }

      if (learnItemId) {
        await savePages(learnItemId);
      }

      setIsPublished(publishNow ? true : isPublished);
      setMessage(publishNow ? "Published successfully!" : "Saved successfully!");
      await loadItems();
    } catch (error: any) {
      alert(error.message);
    }

    setSaving(false);
  }

  return (
    <AdminGate>
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
                <small>{item.category || "No category"}</small>
              </div>

              <div className="rowActions">
                <button onClick={() => editItem(item)}>Edit</button>

                <button
                  className="deleteButton"
                  onClick={() => deleteItem(item)}
                  disabled={saving}
                >
                  Delete
                </button>
              </div>
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
            placeholder="Why Do Astronauts Wear Space Suits?"
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
            {learnCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
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

       <label>Full Screen Gateway Image</label>
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleLearnImageUpload(file);
  }}
/>

{imageUrl && (
  <img src={imageUrl} alt="Gateway preview" className="gatewayPreview" />
)}
        </section>

        <section className="adminCard">
          <h2>Learning Pages</h2>
          <p>Add 1 to 20 pages. Blank pages will not show in the reader.</p>

          {pages.map((page) => (
            <div className="pageEditor" key={page.page_number}>
              <h3>Page {page.page_number}</h3>

              <label>Page Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePageImageUpload(file, page.page_number);
                }}
              />

              {page.image_url && (
                <img
                  src={page.image_url}
                  alt={`Page ${page.page_number}`}
                  className="coverPreview"
                />
              )}

              <label>Page Text</label>
              <textarea
                value={page.text}
                onChange={(e) =>
                  updatePageText(page.page_number, e.target.value)
                }
                placeholder={`Text for page ${page.page_number}`}
              />
            </div>
          ))}
           </section>

      <SeoFields
        seoTitle={seoTitle}
        setSeoTitle={setSeoTitle}
        seoDescription={seoDescription}
        setSeoDescription={setSeoDescription}
        seoImageUrl={seoImageUrl}
        setSeoImageUrl={setSeoImageUrl}
        seoNoindex={seoNoindex}
        setSeoNoindex={setSeoNoindex}
        fallbackTitle={title}
        fallbackDescription={description}
        fallbackImage={coverUrl}
      />

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
    </AdminGate>
  );
}
