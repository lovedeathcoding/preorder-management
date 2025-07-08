import React, { useState, useRef } from 'react';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, placeholder }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div
      className="w-full flex flex-wrap items-center gap-1 px-2 py-2 border border-pink-200 rounded-md focus-within:ring-2 focus-within:ring-pink-500 bg-white min-h-[42px]"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, idx) => (
        <span
          key={tag + idx}
          className="flex items-center bg-pink-200 text-pink-700 px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
        >
          {tag}
          <button
            type="button"
            className="ml-1 text-pink-500 hover:text-red-600 focus:outline-none"
            onClick={() => handleRemoveTag(idx)}
            tabIndex={-1}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="flex-1 min-w-[120px] border-none outline-none bg-white text-sm"
        placeholder={placeholder || 'พิมพ์แท็กแล้วกด Enter หรือ ,'}
      />
    </div>
  );
};

export default TagInput; 