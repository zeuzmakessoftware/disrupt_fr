import React from 'react';

interface HackathonIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface IdeaCardProps {
  idea: HackathonIdea;
  onClick: () => void;
}

export default function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  }[idea.difficulty];

  return (
    <div
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{idea.title}</h2>
        <span className="px-2 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full">
          {idea.category}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{idea.description}</p>
      <span className={`px-2 py-1 text-sm font-medium rounded-full ${difficultyColor}`}>
        {idea.difficulty}
      </span>
    </div>
  );
}
