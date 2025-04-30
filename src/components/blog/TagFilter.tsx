import React, { useState } from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onSelectTag }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Sort tags alphabetically
  const sortedTags = [...tags].sort();
  
  // Show only first 10 tags initially
  const visibleTags = showAll ? sortedTags : sortedTags.slice(0, 10);
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        Filter by topic
      </h3>
      
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedTag === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onSelectTag(null)}
        >
          All
        </button>
        
        {visibleTags.map((tag) => (
          <button
            key={tag}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSelectTag(tag)}
          >
            {tag}
          </button>
        ))}
        
        {sortedTags.length > 10 && (
          <button
            className="text-blue-600 text-sm font-medium underline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : `Show ${sortedTags.length - 10} more`}
          </button>
        )}
      </div>
    </div>
  );
};

export default TagFilter;