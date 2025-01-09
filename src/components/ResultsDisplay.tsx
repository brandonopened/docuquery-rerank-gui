import { Progress } from "@/components/ui/progress";

interface Result {
  text: string;
  score: number;
}

interface ResultsDisplayProps {
  results: Result[];
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">
              Relevance Score: {result.score.toFixed(3)}
            </span>
            <Progress value={result.score * 100} className="w-32" />
          </div>
          <p className="text-gray-900">{result.text}</p>
        </div>
      ))}
    </div>
  );
};