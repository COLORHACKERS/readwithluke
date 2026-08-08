"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminGate from "@/app/components/AdminGate";
import SeoFields from "@/app/admin/components/SeoFields";
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

  seo_title: string | null;
  seo_description: string | null;
  seo_image_url: string | null;
  seo_noindex: boolean | null;
};

type LearnPage = {
  page_number: number;
  text: string;
  image_url: string;
};

type LearnWorksheet = {
  id?: string;
  image_url: string;
  title: string;
  description: string;
  sort_order: number;
};

const createEmptyPages = (): LearnPage[] =>
  Array.from({ length: 20 }, (_, index) => ({
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

  const [pages, setPages] = useState<LearnPage[]>(createEmptyPages());
  const [worksheets, setWorksheets] = useState<LearnWorksheet[]>([]);
const [uploadingWorksheet, setUploadingWorksheet] = useState(false);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoImageUrl, setSeoImageUrl] = useState("");
  const [seoNoindex, setSeoNoindex] = useState(false);

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

  function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
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

    setItems((data as LearnItem[]) || []);
  }

  async function loadPages(learnItemId: string) {
    const { data, error } = await supabase
      .from("learn_pages")
      .select("page_number, text, image_url")
      .eq("learn_item_id", learnItemId)
      .order("page_number", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    const emptyPages = createEmptyPages();

    const mergedPages = emptyPages.map((emptyPage) => {
      const matchingPage = data?.find(
        (page) => page.page_number === emptyPage.page_number
      );

      return {
        page_number: emptyPage.page_number,
        text: matchingPage?.text || "",
        image_url: matchingPage?.image_url || "",
      };
    });

    setPages(mergedPages);
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

    setPages(createEmptyPages());
    setWorksheets([]);

    setSeoTitle("");
    setSeoDescription("");
    setSeoImageUrl("");
    setSeoNoindex(false);

    setMessage("");
  }

  async function loadWorksheets(learnItemId: string) {
  const { data, error } = await supabase
    .from("learn_worksheets")
    .select("id, image_url, title, description, sort_order")
    .eq("learn_item_id", learnItemId)
    .order("sort_order", { ascending: true });

  if (error) {
    alert(`Worksheet load error: ${error.message}`);
    return;
  }

  setWorksheets(
    (data || []).map((worksheet) => ({
      id: worksheet.id,
      image_url: worksheet.image_url || "",
      title: worksheet.title || "",
      description: worksheet.description || "",
      sort_order: worksheet.sort_order || 0,
    }))
  );
}

  async function uploadImage(file: File, folder: string) {
    const extension = file.name.split(".").pop() || "jpg";

    const filePath = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

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

    if (!url) {
      alert("Cover image upload failed.");
      return;
    }

    setCoverUrl(url);
    setMessage("Cover image uploaded. Click Save Draft or Publish Learn Item.");
  }

  async function handleLearnImageUpload(file: File) {
    const url = await uploadImage(file, "learn-images");

    if (!url) {
      alert("Gateway image upload failed.");
      return;
    }

    setImageUrl(url);
    setMessage(
      "Gateway image uploaded. Click Save Draft or Publish Learn Item."
    );
  }

  async function handlePageImageUpload(
    file: File,
    pageNumber: number
  ) {
    const url = await uploadImage(file, "learn-pages");

    if (!url) {
      alert("Page image upload failed.");
      return;
    }

    setPages((currentPages) =>
      currentPages.map((page) =>
        page.page_number === pageNumber
          ? {
              ...page,
              image_url: url,
            }
          : page
      )
    );
  }

  function updatePageText(pageNumber: number, text: string) {
    setPages((currentPages) =>
      currentPages.map((page) =>
        page.page_number === pageNumber
          ? {
              ...page,
              text,
            }
          : page
      )
    );
  }

  async function handleWorksheetUpload(file: File) {
  if (file.type !== "image/png") {
    alert("Please upload a PNG worksheet.");
    return;
  }

  setUploadingWorksheet(true);
  setMessage("");

  try {
    const extension = file.name.split(".").pop() || "png";

    const filePath = `worksheets/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error } = await supabase.storage
      .from("worksheet-images")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("worksheet-images")
      .getPublicUrl(filePath);

    const worksheet: LearnWorksheet = {
      image_url: data.publicUrl,
      title: "",
      description: "",
      sort_order: worksheets.length + 1,
    };

    setWorksheets((current) => [
      ...current,
      worksheet,
    ]);

    setMessage(
      "Worksheet uploaded. Add the title and description, then save the Learn Item."
    );
  } catch (error: unknown) {
    alert(getErrorMessage(error));
  } finally {
    setUploadingWorksheet(false);
  }
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

    setSeoTitle(item.seo_title || "");
    setSeoDescription(item.seo_description || "");
    setSeoImageUrl(item.seo_image_url || "");
    setSeoNoindex(item.seo_noindex === true);

    setMessage(`Editing "${item.title}"`);

    await Promise.all([
  loadPages(item.id),
  loadWorksheets(item.id),
]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteItem(item: LearnItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}" and all of its learning pages?`
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");

    const { error: pagesError } = await supabase
      .from("learn_pages")
      .delete()
      .eq("learn_item_id", item.id);

    if (pagesError) {
      alert(`Learning pages delete error: ${pagesError.message}`);
      setSaving(false);
      return;
    }

    const { error: itemError } = await supabase
      .from("learn_items")
      .delete()
      .eq("id", item.id);

    if (itemError) {
      alert(`Learn item delete error: ${itemError.message}`);
      setSaving(false);
      return;
    }

    setItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem.id !== item.id)
    );

    if (editingId === item.id) {
      resetForm();
    }

    setMessage(`Deleted "${item.title}"`);
    setSaving(false);

    await loadItems();
  }

  async function copyLearnPreviewLink(slug: string) {
  const previewUrl = `${window.location.origin}/learn/${slug}`;

  try {
    await navigator.clipboard.writeText(previewUrl);
    setMessage("Public learning preview link copied!");
  } catch {
    window.prompt("Copy this public preview link:", previewUrl);
  }
}

  async function savePages(learnItemId: string) {
    const filledPages = pages.filter(
      (page) => page.text.trim() || page.image_url.trim()
    );

    const emptyPageNumbers = pages
      .filter((page) => !page.text.trim() && !page.image_url.trim())
      .map((page) => page.page_number);

    if (filledPages.length > 0) {
      const pagePayload = filledPages.map((page) => ({
        learn_item_id: learnItemId,
        page_number: page.page_number,
        text: page.text.trim(),
        image_url: page.image_url.trim(),
      }));

      const { error } = await supabase
        .from("learn_pages")
        .upsert(pagePayload, {
          onConflict: "learn_item_id,page_number",
        });

      if (error) {
        throw error;
      }
    }

    if (emptyPageNumbers.length > 0) {
      const { error } = await supabase
        .from("learn_pages")
        .delete()
        .eq("learn_item_id", learnItemId)
        .in("page_number", emptyPageNumbers);

      if (error) {
        throw error;
      }
    }
  }
async function saveWorksheets(learnItemId: string) {
  const { error: deleteError } = await supabase
    .from("learn_worksheets")
    .delete()
    .eq("learn_item_id", learnItemId);

  if (deleteError) {
    throw deleteError;
  }

  if (worksheets.length === 0) {
    return;
  }

  const worksheetPayload = worksheets.map(
    (worksheet, index) => ({
      learn_item_id: learnItemId,
      image_url: worksheet.image_url,
      title: worksheet.title.trim() || null,
      description: worksheet.description.trim() || null,
      sort_order: index + 1,
    })
  );

  const { error } = await supabase
    .from("learn_worksheets")
    .insert(worksheetPayload);

  if (error) {
    throw error;
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
      description: description.trim() || null,
      cover_url: coverUrl.trim() || null,
      image_url: imageUrl.trim() || null,
      category,
      is_published: publishNow ? true : isPublished,

      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      seo_image_url: seoImageUrl.trim() || null,
      seo_noindex: seoNoindex,
    };

    try {
      let learnItemId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from("learn_items")
          .update(payload)
          .eq("id", editingId);

        if (error) {
          throw error;
        }
      } else {
        const { data, error } = await supabase
          .from("learn_items")
          .insert(payload)
          .select("id")
          .single();

        if (error) {
          throw error;
        }

        learnItemId = data.id;
        setEditingId(data.id);
      }

    if (learnItemId) {
  await savePages(learnItemId);
  await saveWorksheets(learnItemId);
}

      const publishedStatus = publishNow ? true : isPublished;

      setIsPublished(publishedStatus);

      setMessage(
        publishNow
          ? "Published successfully!"
          : "Saved successfully!"
      );

      await loadItems();
    } catch (error: unknown) {
      alert(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGate>
      <main className="adminPage">
        <section className="adminHeader">
          <p>READ WITH LUKE ADMIN</p>

          <h1>
            {editingId ? "Edit Learn Item" : "Add Learn Item"}
          </h1>

          {message && (
            <div className="successMessage">
              {message}
            </div>
          )}
        </section>

        <section className="bookList">
          <div className="bookListTop">
            <h2>Learn With Luke</h2>

            <button type="button" onClick={resetForm}>
              + New Learn Item
            </button>
          </div>

          {items.length === 0 && (
            <p>No learning posts have been added yet.</p>
          )}

          {items.map((item) => (
            <div className="bookRow" key={item.id}>
              <div>
                <strong>{item.title}</strong>

                <span>
                  {item.is_published ? "Published" : "Draft"}
                </span>

                <small>{item.category || "No category"}</small>
              </div>

      <div className="rowActions">
  <button
    type="button"
    onClick={() => editItem(item)}
  >
    Edit
  </button>

  <button
    type="button"
    className="copyPreviewButton"
    onClick={() => copyLearnPreviewLink(item.slug)}
  >
    Copy Preview Link
  </button>

  <button
    type="button"
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
          <label htmlFor="learn-title">Title</label>

          <input
            id="learn-title"
            value={title}
            onChange={(event) => {
              const value = event.target.value;

              setTitle(value);

              if (!editingId) {
                setSlug(createSlug(value));
              }
            }}
            placeholder="Why Do Astronauts Wear Space Suits?"
          />

          <label htmlFor="learn-slug">Slug</label>

     <input
  id="learn-slug"
  value={slug}
  onChange={(event) =>
    setSlug(createSlug(event.target.value))
  }
  placeholder="why-do-astronauts-wear-space-suits"
  readOnly={Boolean(editingId)}
/>

{editingId && (
  <p className="slugNotice">
    The public URL stays permanent. You can still edit the entire learning story.
  </p>
)}

          <label htmlFor="learn-description">
            Description
          </label>

          <textarea
            id="learn-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Write a short description of this learning post."
          />

          <label htmlFor="learn-category">Category</label>

          <select
            id="learn-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {learnCategories.map((categoryOption) => (
              <option
                key={categoryOption}
                value={categoryOption}
              >
                {categoryOption}
              </option>
            ))}
          </select>

          <label htmlFor="learn-cover">Cover Image</label>

          <input
            id="learn-cover"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                handleCoverUpload(file);
              }
            }}
          />

          {coverUrl && (
            <img
              src={coverUrl}
              alt="Cover preview"
              className="coverPreview"
            />
          )}

          <label htmlFor="learn-gateway">
            Full Screen Gateway Image
          </label>

          <input
            id="learn-gateway"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                handleLearnImageUpload(file);
              }
            }}
          />

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Gateway preview"
              className="gatewayPreview"
            />
          )}
        </section>

        <section className="adminCard">
          <h2>Learning Pages</h2>

          <p>
            Add 1 to 20 pages. Blank pages will not show in
            the reader.
          </p>

          {pages.map((page) => (
            <div
              className="pageEditor"
              key={page.page_number}
            >
              <h3>Page {page.page_number}</h3>

              <label
                htmlFor={`learn-page-image-${page.page_number}`}
              >
                Page Image
              </label>

              <input
                id={`learn-page-image-${page.page_number}`}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    handlePageImageUpload(
                      file,
                      page.page_number
                    );
                  }
                }}
              />

              {page.image_url && (
                <img
                  src={page.image_url}
                  alt={`Page ${page.page_number}`}
                  className="coverPreview"
                />
              )}

              <label
                htmlFor={`learn-page-text-${page.page_number}`}
              >
                Page Text
              </label>

              <textarea
                id={`learn-page-text-${page.page_number}`}
                value={page.text}
                onChange={(event) =>
                  updatePageText(
                    page.page_number,
                    event.target.value
                  )
                }
                placeholder={`Text for page ${page.page_number}`}
              />
            </div>
          ))}
        </section>

<section className="adminCard">
  <h2>Printable Worksheets</h2>

  <p>
    Upload PNG activity sheets for this Learn With Luke story.
    These will appear on the final Printable Activities page.
  </p>

  <label htmlFor="worksheet-upload">
    Add Worksheet PNG
  </label>

  <input
    id="worksheet-upload"
    type="file"
    accept="image/png,.png"
    disabled={uploadingWorksheet}
    onChange={async (event) => {
      const file = event.target.files?.[0];

      if (file) {
        await handleWorksheetUpload(file);
      }

      event.currentTarget.value = "";
    }}
  />

  {uploadingWorksheet && (
    <p>Uploading worksheet...</p>
  )}

  {worksheets.length === 0 && (
    <p>No worksheets added yet.</p>
  )}

  {worksheets.map((worksheet, index) => (
    <div
      className="pageEditor worksheetEditor"
      key={`${worksheet.image_url}-${index}`}
    >
      <h3>Worksheet {index + 1}</h3>

      {worksheet.image_url && (
        <img
          src={worksheet.image_url}
          alt={
            worksheet.title ||
            `Worksheet ${index + 1}`
          }
          className="coverPreview worksheetPreview"
        />
      )}

      <label htmlFor={`worksheet-title-${index}`}>
        Worksheet Title
      </label>

      <input
        id={`worksheet-title-${index}`}
        value={worksheet.title}
        onChange={(event) =>
          updateWorksheet(
            index,
            "title",
            event.target.value
          )
        }
        placeholder="WRITE ABOUT RAINBOWS!"
      />

      <label
        htmlFor={`worksheet-description-${index}`}
      >
        First Question / Description
      </label>

      <textarea
        id={`worksheet-description-${index}`}
        value={worksheet.description}
        onChange={(event) =>
          updateWorksheet(
            index,
            "description",
            event.target.value
          )
        }
        placeholder="What is white sunlight made of?"
      />

      <button
        type="button"
        className="deleteButton"
        onClick={() => removeWorksheet(index)}
      >
        Remove Worksheet
      </button>
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
          <button
            type="button"
            onClick={() => saveItem(false)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            className="publishButton"
            onClick={() => saveItem(true)}
            disabled={saving}
          >
            {saving ? "Publishing..." : "Publish Learn Item"}
          </button>
        </div>
      </main>
    </AdminGate>
  );
}
