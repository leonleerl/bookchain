import Header from "./components/Header";
import BookList from "./components/BookList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to BookChain
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            A decentralized online bookstore built with Web3 technologies
          </p>
        </div>
        <BookList />
      </main>
    </div>
  );
}
