import { supabase } from "@/lib/supabase";

export default async function TestBook() {
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .limit(1);

  const book = books?.[0];

  if (!book) return <div>No book found</div>;

  const { data: pages } = await supabase
    .from("book_pages")
    .select("*")
    .eq("book_id", book.id)
    .order("page_number");

  return (
    <main className="p-10">
      <h1>{book.title}</h1>

      {pages?.map((page) => (
        <div
          key={page.id}
          style={{
            marginBottom: 50,
            border: "1px solid #ddd",
            padding: 20,
          }}
        >
          <h2>Page {page.page_number}</h2>

          {page.page_image_url && (
            <img
              src={page.page_image_url}
              alt=""
              style={{
                width: 400,
                display: "block",
                marginBottom: 20,
              }}
            />
          )}

          <p>{page.page_text}</p>
        </div>
      ))}
    </main>
  );
}