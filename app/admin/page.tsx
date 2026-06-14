import Link from "next/link";
import {
  Plus,
  Upload,
  BookOpen,
  FileText,
  ImageIcon,
  Eye,
  ShieldCheck,
  Pencil,
} from "lucide-react";

import "./admin.css";

export default function AdminPage() {
  return (
    <section className="libraryPage adminPage">
      <div className="libraryHero">
        <div>
          <p className="eyebrow">
            <ShieldCheck /> STORY BUILDER, UPLOADS, PUBLISHING
          </p>

          <h1>Admin</h1>

          <p className="sub">
            Create stories, upload pages, preview books, and publish to the
            library.
          </p>
        </div>

        <Link href="/admin/books/new" className="adminCreateBtn">
          <Plus /> New Story
        </Link>
      </div>

      <div className="adminGrid">
        <Link href="/admin/books/new" className="adminCard primary">
          <div className="adminIcon">
            <Plus />
          </div>
          <span>Create</span>
          <h2>New Story</h2>
          <p>
            Add title, description, age level, tags, cover image, and hero
            image.
          </p>
        </Link>

     <Link href="/admin/books" className="adminCard">
  <div className="adminIcon">
    <Pencil />
  </div>

  <span>Edit</span>

  <h2>Manage Stories</h2>

  <p>
    Edit published books, fix mistakes, update tags, and change images.
  </p>
</Link>

        <Link href="/admin/books" className="adminCard">
          <div className="adminIcon">
            <Upload />
          </div>
          <span>Upload</span>
          <h2>20 Pages</h2>
          <p>Upload story text pages and matching image pages for the reader.</p>
        </Link>
      </div>

      <div className="adminPanel">
        <div>
          <p className="eyebrow small">
            <BookOpen /> CURRENT WORKFLOW
          </p>

          <h2>Build a Read With Luke book</h2>

          <p>
            Each story should include a cover, hero image, age level, tags, 20
            text pages, and 20 image pages before publishing.
          </p>
        </div>

        <div className="workflow">
          <div>
            <FileText />
            <strong>Story Details</strong>
            <span>Title, slug, description, age, tags</span>
          </div>

          <div>
            <ImageIcon />
            <strong>Images</strong>
            <span>Cover, hero, and page illustrations</span>
          </div>

          <div>
            <Eye />
            <strong>Preview</strong>
            <span>Check the book before publishing</span>
          </div>

          <div>
            <ShieldCheck />
            <strong>Publish</strong>
            <span>Send story live to the library</span>
          </div>
        </div>
      </div>
    </section>
  );
}
