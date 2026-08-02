"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "./admin.css";
import AdminGate from "@/app/components/AdminGate";
import SeoFields from "@/app/admin/components/SeoFields";

type Book = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  hero_url: string | null;
  hero_image_url: string | null;
  age_range: string | null;
  category: string | null;
  is_published: boolean;

  seo_title: string | null;
  seo_description: string | null;
  seo_image_url: string | null;
  seo_noindex: boolean;
};

type BookPage = {
  page_number: number;
  text: string;
  image_url: string;
};

const emptyPages: BookPage[] = Array.from({ length: 21 }, (_, index) => ({
  page_number: index + 1,
  text: "",
  image_url: "",
}));

const bookCategories = [
  "Adventure",
  "Mystery",
  "Animals",
  "Places",
  "Friends",
  "Bedtime",
];

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [gatewayUrl, setGatewayUrl] = useState("");

  const [ageRange, setAgeRange] = useState("Ages 5–8");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Adventure",
  ]);
  const [isPublished, setIsPublished] = useState(false);
  const [pages, setPages] = useState<BookPage[]>(emptyPages);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
const [seoDescription, setSeoDescription] = useState("");
const [seoImageUrl, setSeoImageUrl] = useState("");
const [seoNoindex, setSeoNoindex] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  function parseCategories(value: string | null) {
    if (!value) return ["Adventure"];

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function loadBooks() {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setBooks(data || []);
  }

 function resetForm() {
  setEditingId(null);
  setTitle("");
  setSlug("");
  setDescription("");
  setCoverUrl("");
  setGatewayUrl("");
  setAgeRange("Ages 5–8");
  setSelectedCategories(["Adventure"]);
  setIsPublished(false);
  setPages(emptyPages);

  setSeoTitle("");
  setSeoDescription("");
  setSeoImageUrl("");
  setSeoNoindex(false);

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

  async function editBook(book: Book) {
    setEditingId(book.id);
    setTitle(book.title);
    setSlug(book.slug);
    setDescription(book.description || "");
    setCoverUrl(book.cover_url || "");
    setGatewayUrl(book.hero_url || book.hero_image_url || "");
    setAgeRange(book.age_range || "Ages 5–8");
    setSelectedCategories(parseCategories(book.category));
    setIsPublished(book.is_published);
    setSeoTitle(book.seo_title || "");
setSeoDescription(book.seo_description || "");
setSeoImageUrl(book.seo_image_url || "");
setSeoNoindex(book.seo_noindex === true);

    const { data, error } = await supabase
      .from("book_pages")
      .select("*")
      .eq("book_id", book.id)
      .order("page_number", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    const loadedPages = emptyPages.map((emptyPage) => {
      const match = data?.find((p) => p.page_number === emptyPage.page_number);

      return {
        page_number: emptyPage.page_number,
        text: match?.text || "",
        image_url: match?.image_url || "",
      };
    });

    setPages(loadedPages);
    setMessage(`Editing "${book.title}"`);
  }

  async function deleteBook(book: Book) {
    const confirmed = window.confirm(
      `Delete "${book.title}" and all of its pages?`
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");

    const { error: pagesError } = await supabase
      .from("book_pages")
      .delete()
      .eq("book_id", book.id);

    if (pagesError) {
      alert(`Pages delete error: ${pagesError.message}`);
      setSaving(false);
      return;
    }

    const { error: bookError } = await supabase
      .from("books")
      .delete()
      .eq("id", book.id);

    if (bookError) {
      alert(`Book delete error: ${bookError.message}`);
      setSaving(false);
      return;
    }

    setBooks((current) => current.filter((item) => item.id !== book.id));

    if (editingId === book.id) {
      resetForm();
    }

    setMessage(`Deleted "${book.title}"`);
    setSaving(false);
    loadBooks();
  }
  async function copyBookPreviewLink(slug: string) {
  const previewUrl = `${window.location.origin}/books/${slug}`;

  try {
    await navigator.clipboard.writeText(previewUrl);
    setMessage("Public preview link copied!");
  } catch {
    window.prompt("Copy this public preview link:", previewUrl);
  }
}

  async function handleCoverUpload(file: File) {
    const url = await uploadImage(file, "covers");

    if (!url) {
      alert("Cover image upload failed.");
      return;
    }

    setCoverUrl(url);
    setMessage("Cover image uploaded. Click Save Draft or Publish Book.");
  }

 async function handleGatewayUpload(file: File) {
  const uploadedUrl = await uploadImage(file, "gateway");

  if (!uploadedUrl) {
    alert("Gateway image upload failed.");
    return;
  }

  setGatewayUrl(uploadedUrl);
  setMessage("Gateway image uploaded. Now click Save Draft or Publish Book.");
}
  async function handlePageImageUpload(file: File, index: number) {
    const url = await uploadImage(file, "pages");

    if (!url) {
      alert("Page image upload failed.");
      return;
    }

    setPages((current) =>
      current.map((page, i) =>
        i === index ? { ...page, image_url: url } : page
      )
    );
  }

  async function saveBook(publishNow = false) {
    if (!title.trim() || !slug.trim()) {
      alert("Please add a title and slug.");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Please choose at least one category.");
      return;
    }

    setSaving(true);
    setMessage("");

    const bookPayload = {
  title: title.trim(),
  slug: slug.trim(),
  description: description.trim() || null,
  cover_url: coverUrl || null,
  hero_url: gatewayUrl || null,
  hero_image_url: gatewayUrl || null,
  age_range: ageRange,
  category: selectedCategories.join(", "),
  is_published: publishNow ? true : isPublished,

  seo_title: seoTitle.trim() || null,
  seo_description: seoDescription.trim() || null,
  seo_image_url: seoImageUrl.trim() || null,
  seo_noindex: seoNoindex,
};
    let bookId = editingId;

    if (editingId) {
      const { error } = await supabase
        .from("books")
        .update(bookPayload)
        .eq("id", editingId);

      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("books")
        .insert(bookPayload)
        .select()
        .single();

      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }

      bookId = data.id;
      setEditingId(data.id);
    }

    const pagesToSave = pages
      .filter((page) => page.text.trim() || page.image_url.trim())
      .map((page) => ({
        book_id: bookId,
        page_number: page.page_number,
        text: page.text || "",
        image_url: page.image_url || "",
      }));

    if (pagesToSave.length > 0) {
      const { error: pagesError } = await supabase
        .from("book_pages")
        .upsert(pagesToSave, {
          onConflict: "book_id,page_number",
        });

      if (pagesError) {
        alert(pagesError.message);
        setSaving(false);
        return;
      }
    }

    setIsPublished(publishNow ? true : isPublished);
    setMessage(publishNow ? "Published successfully!" : "Saved successfully!");
    setSaving(false);
    loadBooks();
  }

  return (
    <AdminGate>
      <main className="adminPage">
        <section className="adminHeader">
          <p>READ WITH LUKE ADMIN</p>
          <h1>{editingId ? "Edit Book" : "Add New Book"}</h1>
          {message && <div className="successMessage">{message}</div>}
        </section>

        <section className="bookList">
          <div className="bookListTop">
            <h2>Books</h2>
            <button onClick={resetForm}>+ New Book</button>
          </div>

          {books.map((book) => (
            <div className="bookRow" key={book.id}>
              <div>
                <strong>{book.title}</strong>
                <span>{book.is_published ? "Published" : "Draft"}</span>
                <small>{book.category || "No category"}</small>
              </div>

             <div className="rowActions">
  <button
    type="button"
    onClick={() => editBook(book)}
  >
    Edit
  </button>

  <button
    type="button"
    className="copyPreviewButton"
    onClick={() => copyBookPreviewLink(book.slug)}
  >
    Copy Preview Link
  </button>

  <button
    type="button"
    className="deleteButton"
    onClick={() => deleteBook(book)}
    disabled={saving}
  >
    Delete
  </button>
</div>
            </div>
          ))}
        </section>

        <section className="adminCard">
          <label>Book Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!editingId) setSlug(createSlug(e.target.value));
            }}
            placeholder="Treehouse Mysteries"
          />

      <label>Slug</label>
<input
  value={slug}
  onChange={(e) => setSlug(createSlug(e.target.value))}
  readOnly={Boolean(editingId)}
/>

{editingId && (
  <p className="slugNotice">
    This public URL is permanent and cannot be changed while editing.
  </p>
)}

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Age Range</label>
          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
          >
            <option>Ages 3–6</option>
            <option>Ages 5–8</option>
            <option>Ages 6+</option>
          </select>

          <label>Categories</label>
          <div className="checkboxGrid">
            {bookCategories.map((category) => (
              <label className="checkboxPill" key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

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
            <img
              src={coverUrl}
              alt="Cover preview"
              className="coverPreview"
            />
          )}

          <label>Gateway Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleGatewayUpload(file);
            }}
          />

          {gatewayUrl && (
            <img
              src={gatewayUrl}
              alt="Gateway preview"
              className="gatewayPreview"
            />
          )}
        </section>

        <section className="pagesGrid">
          {pages.map((page, index) => (
            <div className="pageCard" key={page.page_number}>
             <h2>
  {page.page_number === 21
    ? "⭐ Bonus Page (Optional)"
    : `Page ${page.page_number}`}
</h2>

              <label>Page Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePageImageUpload(file, index);
                }}
              />

              {page.image_url && (
                <img src={page.image_url} alt="" className="pagePreview" />
              )}

              <label>Page Text</label>
              <textarea
                value={page.text}
                onChange={(e) => {
                  const value = e.target.value;

                  setPages((current) =>
                    current.map((item, i) =>
                      i === index ? { ...item, text: value } : item
                    )
                  );
                }}
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
          <button onClick={() => saveBook(false)} disabled={saving}>
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            className="publishButton"
            onClick={() => saveBook(true)}
            disabled={saving}
          >
            Publish Book
          </button>
        </div>
      </main>
    </AdminGate>
  );
}
