import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4 tracking-tight">
          Hello, World!
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Welcome to your React and Tailwind CSS template. Click the button below to test your state.
        </p>
        <div className="flex flex-col items-center">
          <span className="text-6xl font-bold text-gray-800 mb-6 transition-all duration-300">
            {count}
          </span>
          <button
            onClick={() => setCount(count + 1)}
            className="w-full py-3 px-6 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Increment Count
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
