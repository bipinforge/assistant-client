import { useState } from 'react';

type HeaderProps = {
  setCurrentUserId: (id: string) => void;
};

const Header = ({ setCurrentUserId }: HeaderProps) => {
  const [savedUserId, setSavedUserId] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    if (inputValue.trim()) {
      setSavedUserId(inputValue);
      setCurrentUserId(inputValue);
      setInputValue('');
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3">
          <label htmlFor="userId" className="text-white font-medium">User ID:</label>
          <input
            id="userId"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            placeholder="Enter user ID"
            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Save
          </button>
        </div>
        {savedUserId && (
          <div className="text-sm text-gray-300">
            Current User ID: <span className="text-white font-semibold">{savedUserId}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
