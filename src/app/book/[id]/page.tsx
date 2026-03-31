import { books } from "@/data/books";
import { notFound } from "next/navigation";
import BookDetail from "@/components/BookDetail";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return books.map((book) => ({ id: book.id }));
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = books.find((b) => b.id === id);

  if (!book) notFound();

  return <BookDetail book={book} />;
}
