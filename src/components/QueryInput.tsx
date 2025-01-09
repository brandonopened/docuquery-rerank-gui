import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

export const QueryInput = ({ onSubmit, disabled }: QueryInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query..."
        className="flex-1"
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !query.trim()}>
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
};