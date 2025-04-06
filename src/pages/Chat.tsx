
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Smile, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AmiAvatar from "@/components/AmiAvatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type MessageType = "user" | "ami";

interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
}

const Chat = () => {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ami",
      text: "Xin chào! Mình là Ami. Bạn cảm thấy thế nào hôm nay?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [amiMood, setAmiMood] = useState<"happy" | "neutral" | "thinking">("happy");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputText,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInputText("");
    
    // Simulate Ami thinking
    setAmiMood("thinking");
    
    // Simulate Ami response after a delay
    setTimeout(() => {
      // Analyze sentiment (simulated)
      const lowerText = inputText.toLowerCase();
      const hasSadWords = lowerText.includes("buồn") || 
                          lowerText.includes("mệt") || 
                          lowerText.includes("chán") ||
                          lowerText.includes("khó khăn");
      
      let responseText = "";
      
      if (hasSadWords) {
        responseText = "Mình hiểu cảm giác đó. Hãy chia sẻ thêm để mình có thể giúp bạn tốt hơn. Bạn có muốn thử một số bài tập thở để thư giãn không?";
        setAmiMood("neutral");
      } else {
        responseText = "Cảm ơn bạn đã chia sẻ! Mình luôn ở đây để lắng nghe và hỗ trợ bạn. Bạn có điều gì khác muốn nói với mình không?";
        setAmiMood("happy");
      }
      
      const amiMessage: Message = {
        id: Date.now().toString(),
        type: "ami",
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, amiMessage]);
    }, 1500);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you would implement voice recording functionality here
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.12))] flex flex-col">
      {/* Chat header on mobile */}
      {isMobile && (
        <div className="flex items-center p-4">
          <AmiAvatar size="sm" mood={amiMood} className="mr-4" />
          <div>
            <h2 className="font-medium">Ami</h2>
            <p className="text-xs text-muted-foreground">
              {amiMood === "thinking" ? "Đang suy nghĩ..." : "Đang hoạt động"}
            </p>
          </div>
        </div>
      )}

      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.type === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.type === "ami" && (
              <AmiAvatar size="sm" mood={amiMood} className="mr-2 hidden md:block" />
            )}
            
            <div
              className={cn(
                "max-w-[80%] md:max-w-[70%] rounded-3xl p-4",
                message.type === "user"
                  ? "bg-primary text-white rounded-tr-none"
                  : "bg-muted rounded-tl-none"
              )}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            {message.type === "user" && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ml-2 hidden md:flex">
                <span className="text-sm">Bạn</span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4 bg-background">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => {}}
          >
            <Smile className="h-5 w-5" />
          </Button>
          
          <Input
            className="flex-1 rounded-full bg-muted border-0"
            placeholder="Nhắn tin cho Ami..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full",
              isRecording && "bg-red-100 text-red-500 border-red-200"
            )}
            onClick={handleToggleRecording}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            size="icon"
            className="rounded-full"
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
