
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Smile, PlusCircle, Loader, Volume, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AmiAvatar from "@/components/AmiAvatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";

type MessageType = "user" | "ami";
type AmiMood = "happy" | "neutral" | "thinking" | "sad" | "excited";

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
  const [amiMood, setAmiMood] = useState<AmiMood>("happy");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const suggestedQuestions = [
    "Bạn đang cảm thấy thế nào?",
    "Bạn có muốn thư giãn không?",
    "Chúng ta có thể làm gì để giúp bạn cảm thấy tốt hơn?",
  ];

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
    setIsTyping(true);
    
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
        responseText = "Mình hiểu cảm giác đó. Hãy chia sẻ thêm để mình có thể giúp bạn tốt hơn. Bạn có muốn thử một số bài tập thở để thư giãn không? 😊";
        setAmiMood("neutral");
        
        // Show breathing exercise suggestion
        setTimeout(() => {
          toast({
            title: "Hít thở sâu",
            description: "Bạn có muốn thực hiện bài tập thở để giảm căng thẳng?",
            action: (
              <Button variant="outline" size="sm" onClick={handleBreathingExercise}>
                Thử ngay
              </Button>
            ),
          });
        }, 1000);
      } else {
        responseText = "Cảm ơn bạn đã chia sẻ! Mình luôn ở đây để lắng nghe và hỗ trợ bạn. Bạn có điều gì khác muốn nói với mình không? 😊";
        setAmiMood("happy");
      }
      
      const amiMessage: Message = {
        id: Date.now().toString(),
        type: "ami",
        text: responseText,
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      
      // Simulate Ami speaking
      setIsSpeaking(true);
      setMessages(prev => [...prev, amiMessage]);
      
      // Stop speaking after a delay based on message length
      setTimeout(() => {
        setIsSpeaking(false);
      }, responseText.length * 50);
      
    }, 1500);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // In a real app, this would process the recording and convert to text
      toast({
        title: "Voice-to-Text",
        description: "Đã chuyển giọng nói thành văn bản"
      });
      // Simulate voice to text result
      setInputText("Hôm nay tôi cảm thấy có chút mệt mỏi, không biết làm sao để cảm thấy tốt hơn");
    } else {
      setIsRecording(true);
      toast({
        title: "Đang ghi âm",
        description: "Hãy nói điều bạn muốn chia sẻ...",
      });
    }
  };

  const handleBreathingExercise = () => {
    toast({
      title: "Bài tập hít thở",
      description: "Hít sâu trong 4 giây, giữ 4 giây, thở ra trong 6 giây. Lặp lại 5 lần.",
      duration: 10000,
    });
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
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
              {amiMood === "thinking" ? "Đang suy nghĩ..." : 
               isSpeaking ? "Đang nói..." : "Đang hoạt động"}
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
        
        {isTyping && (
          <div className="flex justify-start">
            <AmiAvatar size="sm" mood="thinking" className="mr-2 hidden md:block" />
            <div className="bg-muted rounded-3xl rounded-tl-none p-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      <div className="px-4 py-2 border-t flex overflow-x-auto space-x-2 no-scrollbar">
        {suggestedQuestions.map((question, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap"
            onClick={() => handleSuggestedQuestion(question)}
          >
            {question}
          </Button>
        ))}
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
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full",
              isSpeaking ? "bg-primary/20 text-primary" : "text-muted-foreground"
            )}
            onClick={() => setIsSpeaking(!isSpeaking)}
          >
            {isSpeaking ? (
              <Volume className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
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
