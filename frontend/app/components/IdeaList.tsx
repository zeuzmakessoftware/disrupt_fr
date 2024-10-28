import React from 'react';

interface HackathonIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  websiteVariants: string[];
}

interface IdeaListProps {
  ideas: HackathonIdea[];
  onSelectIdea: (idea: HackathonIdea) => void;
}

export default function IdeaList({ ideas, onSelectIdea }: IdeaListProps) {
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{idea.title}</h2>
            <span className="px-2 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full">
              {idea.category}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{idea.description}</p>
          <div className="flex justify-between items-center">
            <span className={`px-2 py-1 text-sm font-medium rounded-full ${difficultyColor[idea.difficulty]}`}>
              {idea.difficulty}
            </span>
            <button
              onClick={() => onSelectIdea(idea)}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
