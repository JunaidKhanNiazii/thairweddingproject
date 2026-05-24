import Header from '../components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">Welcome Home</h1>
        <p className="text-gray-500 text-lg">This is the public home page. No login required.</p>
      </main>
    </>
  );
}
