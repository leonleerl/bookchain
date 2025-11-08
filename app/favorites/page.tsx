import Header from "../components/Header";
import Favorites from "../components/Favorites";

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Favorites />
      </main>
    </div>
  );
}

