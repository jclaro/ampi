import { SavedLocationsList } from "@/components/SavedLocationsList";

export const metadata = { title: "Os meus locais — AMPI" };

export default function LocaisPage() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 py-8">
      <h1 className="px-4 text-2xl font-semibold tracking-tight">
        Os meus locais
      </h1>
      <SavedLocationsList />
    </main>
  );
}
