import { supabase } from "@/lib/supabase";

export default async function PreviewBook() {
  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("slug", "little-treehouse-mysteries")
    .single();

  if (!book) return <main>No book found</main>;

  const { data: pages } = await supabase
    .from("book_pages")
    .select("*")
    .eq("book_id", book.id)
    .order("page_number", { ascending: true });

  return (
    <main style={{ padding: 40, background: "#F8F1E6" }}>
      <h1>{book.title}</h1>

      {pages?.map((page) => (
        <section key={page.id} style={{ marginBottom: 40 }}>
          <h2>Page {page.page_number}</h2>

          <img
            src={page.page_image_url}
            alt=""
            style={{
              width: 700,
              maxWidth: "100%",
              borderRadius: 24,
              display: "block",
            }}
          />

          <p style={{ fontSize: 24, lineHeight: 1.5 }}>
            {page.page_text}
          </p>
        </section>
      ))}
    </main>
  );
}