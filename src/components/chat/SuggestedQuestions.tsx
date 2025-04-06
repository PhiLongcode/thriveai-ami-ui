
import { Button } from "@/components/ui/button";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

const SuggestedQuestions = ({ questions, onSelect }: SuggestedQuestionsProps) => {
  return (
    <div className="px-4 py-2 border-t flex overflow-x-auto space-x-2 no-scrollbar">
      {questions.map((question, index) => (
        <Button 
          key={index} 
          variant="outline" 
          size="sm" 
          className="whitespace-nowrap"
          onClick={() => onSelect(question)}
        >
          {question}
        </Button>
      ))}
    </div>
  );
};

export default SuggestedQuestions;
