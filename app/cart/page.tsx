import Header from "../components/Header";
import Cart from "../components/Cart";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Cart />
      </main>
    </div>
  );
}

