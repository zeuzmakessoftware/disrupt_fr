import React from 'react';

interface HackathonIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface IdeaModalProps {
  idea: HackathonIdea;
  onClose: () => void;
}

export default function IdeaModal({ idea, onClose }: IdeaModalProps) {
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  }[idea.difficulty];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{idea.title}</h2>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="px-2 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full">
            {idea.category}
          </span>
          <span className={`px-2 py-1 text-sm font-medium rounded-full ${difficultyColor}`}>
            {idea.difficulty}
          </span>
        </div>
        <p className="text-gray-700">{idea.description}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
