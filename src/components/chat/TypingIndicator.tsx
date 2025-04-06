
import AmiAvatar from "@/components/AmiAvatar";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <AmiAvatar size="sm" mood="thinking" className="mr-2 hidden md:block" />
      <div className="bg-muted rounded-3xl rounded-tl-none p-4 flex items-center space-x-2">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
