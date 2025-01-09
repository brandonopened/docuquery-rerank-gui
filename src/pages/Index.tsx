import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { QueryInput } from "@/components/QueryInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";

interface RankedResult {
  text: string;
  score: number;
}

const COHERE_API_KEY = "VvImZNZXUXLfUq23reRIyTTlqI2SvRiQOBOwKK18"; // This should be moved to a secure location

const Index = () => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [results, setResults] = useState<RankedResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (text: string) => {
    const docs = text.split("\n").filter(doc => doc.trim().length > 0);
    setDocuments(docs);
    toast({
      title: "Document loaded successfully",
      description: `${docs.length} sections ready for querying`,
    });
  };

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.cohere.ai/v1/rerank", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "rerank-v3.5",
          query,
          documents,
          top_n: 3,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to rerank");

      setResults(data.results.map((r: any) => ({
        text: r.document.text,
        score: r.relevance_score,
      })));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process query",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ["Text", "Relevance Score"],
      ...results.map(r => [r.text, r.score.toString()]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rerank-results.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Document ReRanking</h1>
          <p className="text-gray-600">Upload a document, make queries, and export results</p>
        </div>

        <FileUpload onUpload={handleFileUpload} />
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <QueryInput onSubmit={handleQuery} disabled={documents.length === 0 || isLoading} />
          
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Results</h2>
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <ResultsDisplay results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;