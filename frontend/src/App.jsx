import { useState, useEffect } from 'react';
import { addDocument, getDocuments } from './firebase';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');

  const fetchItems = async () => {
    const data = await getDocuments('test');
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      await addDocument('test', { name: input, createdAt: new Date().toISOString() });
      setStatus('Saved to Firestore!');
      setInput('');
      fetchItems();
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-6 text-center">
          Firebase Firestore Test
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter something..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Save
          </button>
        </div>

        {status && (
          <p className="text-sm text-green-600 mb-4">{status}</p>
        )}

        <h2 className="text-lg font-semibold text-gray-700 mb-2">Stored Items:</h2>
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm">No items yet.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="bg-gray-100 rounded-lg px-4 py-2 text-gray-700 text-sm">
                {item.name} <span className="text-gray-400 text-xs ml-2">{item.createdAt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
