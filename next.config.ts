import type { NextConfig } from "next";

const privateNoIndexHeaders = [
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive",
  },
];

const duplicateNoIndexHeaders = [
  {
    key: "X-Robots-Tag",
    value: "noindex, follow",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // ADMIN
      {
        source: "/admin/:path*",
        headers: privateNoIndexHeaders,
      },

      // ACCOUNT
      {
        source: "/account/:path*",
        headers: privateNoIndexHeaders,
      },

      // LOGIN
      {
        source: "/login",
        headers: privateNoIndexHeaders,
      },
      {
        source: "/login/:path*",
        headers: privateNoIndexHeaders,
      },

      // CHECKOUT
      {
        source: "/checkout",
        headers: privateNoIndexHeaders,
      },
      {
        source: "/checkout/:path*",
        headers: privateNoIndexHeaders,
      },

      // PASSWORD RESET
      {
        source: "/password-reset",
        headers: privateNoIndexHeaders,
      },
      {
        source: "/password-reset/:path*",
        headers: privateNoIndexHeaders,
      },

      // PRIVATE CHILD PAGES
      // Change "private-child" if your actual route has a different name.
      {
        source: "/private-child/:path*",
        headers: privateNoIndexHeaders,
      },

      // INTERNAL READER STATE
      {
        source: "/reader-state/:path*",
        headers: privateNoIndexHeaders,
      },

      // ALL INTERNAL API ROUTES
      {
        source: "/api/:path*",
        headers: privateNoIndexHeaders,
      },

      // FULL BOOK READERS
      // Public previews at /books/story-slug remain indexable.
      {
        source: "/books/:bookSlug/read",
        headers: privateNoIndexHeaders,
      },
      {
        source: "/books/:bookSlug/read/:path*",
        headers: privateNoIndexHeaders,
      },

      // FULL LEARNING READERS
      // Public previews at /learn/learning-slug remain indexable.
      {
        source: "/learn/:learnSlug/read",
        headers: privateNoIndexHeaders,
      },
      {
        source: "/learn/:learnSlug/read/:path*",
        headers: privateNoIndexHeaders,
      },

      // FILTERED OR PAGINATED BOOK LIBRARY
      {
        source: "/library",
        has: [{ type: "query", key: "category" }],
        headers: duplicateNoIndexHeaders,
      },
      {
        source: "/library",
        has: [{ type: "query", key: "page" }],
        headers: duplicateNoIndexHeaders,
      },
      {
        source: "/library",
        has: [{ type: "query", key: "search" }],
        headers: duplicateNoIndexHeaders,
      },
      {
        source: "/library",
        has: [{ type: "query", key: "sort" }],
        headers: duplicateNoIndexHeaders,
      },

      // FILTERED OR PAGINATED LEARN LIBRARY
      {
        source: "/learn",
        has: [{ type: "query", key: "category" }],
        headers: duplicateNoIndexHeaders,
      },
      {
        source: "/learn",
        has: [{ type: "query", key: "page" }],
        headers: duplicateNoIndexHeaders,
      },
      {
        source: "/learn",
        has: [{ type: "query", key: "search" }],
        headers: duplicateNoIndexHeaders,
      },
      {
        source: "/learn",
        has: [{ type: "query", key: "sort" }],
        headers: duplicateNoIndexHeaders,
      },
    ];
  },
};

export default nextConfig;
