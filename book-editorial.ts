// Optional editorial content supplements the public synopsis. No database migration required.
// Add only details checked against the actual story; leave unverified levels, reviews and authors out.
export type BookEditorial = { subtitle: string; synopsis: string; themes: string[]; questions: string[]; seoTitle: string; seoDescription: string };
export const bookEditorial: Record<string, BookEditorial> = {
  "inside-what": {
    subtitle: "A funny adventure about friendship, creativity, and seeing things differently.",
    synopsis: "Zip and Dot meet a curious creature who does things differently from them. Convinced that something important is missing, they follow their silly ideas into an unexpected adventure. This story invites families to talk about friendship, creativity, and discovering that there is more than one way to feel at home.",
    themes: ["Friendship", "Creativity", "Seeing things differently"],
    questions: ["Why do you think Zip and Dot believe something is missing?", "Can two friends have different ideas and both feel at home?", "What would you ask someone who does things differently from you?"],
    seoTitle: "Inside What? — A Story About Friendship & Creativity",
    seoDescription: "Meet Zip and Dot in Inside What?, a funny illustrated children's story about friendship, creativity, and seeing things differently. Read with Luke online.",
  },
};
