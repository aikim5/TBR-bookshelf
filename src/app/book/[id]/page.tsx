import { getBooks } from "@/lib/notion";
import { notFound } from "next/navigation";
import BookDetail from "@/components/BookDetail";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const books = await getBooks();
  const book = books.find((b) => b.id === id);

  if (!book) notFound();

  return <BookDetail book={book} />;
}
