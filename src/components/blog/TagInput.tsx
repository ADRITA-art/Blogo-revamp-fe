import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Add a tag...',
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click on container to focus the input
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', focusInput);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', focusInput);
      }
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
    
    // Remove last tag on Backspace if input is empty
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      onChange(newTags);
    }
  };

  const addTag = (tag: string) => {
    // Normalize tag (trim, lowercase)
    const normalizedTag = tag.trim().toLowerCase();
    
    // Don't add empty tags or duplicates
    if (normalizedTag && !tags.includes(normalizedTag)) {
      const newTags = [...tags, normalizedTag];
      onChange(newTags);
    }
    
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
    >
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1 focus:outline-none"
            aria-label={`Remove ${tag} tag`}
          >
            <X size={14} className="text-blue-600" />
          </button>
        </div>
      ))}
      
      <input
        ref={inputRef}
        type="text"
        className="flex-grow min-w-[120px] border-none outline-none p-1 bg-transparent"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
      />
    </div>
  );
};

export default TagInput;