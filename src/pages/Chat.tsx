
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Smile, PlusCircle, Loader, Volume, VolumeX, MessageSquare, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AmiAvatar from "@/components/AmiAvatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isChatExpanded, setIsChatExpanded] = useState(!isMobile);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Suggested questions
  const suggestedQuestions = [
    "Bạn đang cảm thấy thế nào?",
    "Bạn có muốn thư giãn không?",
    "Chúng ta có thể làm gì để giúp bạn cảm thấy tốt hơn?",
    "Bạn có thể kể chuyện vui không?",
    "Hôm nay tôi cảm thấy không ổn",
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update last interaction time when user interacts
  useEffect(() => {
    const updateLastInteractionTime = () => {
      lastInteractionTimeRef.current = Date.now();
    };

    // Listen for user interactions
    window.addEventListener("click", updateLastInteractionTime);
    window.addEventListener("keydown", updateLastInteractionTime);
    window.addEventListener("mousemove", updateLastInteractionTime);
    window.addEventListener("touchstart", updateLastInteractionTime);

    return () => {
      window.removeEventListener("click", updateLastInteractionTime);
      window.removeEventListener("keydown", updateLastInteractionTime);
      window.removeEventListener("mousemove", updateLastInteractionTime);
      window.removeEventListener("touchstart", updateLastInteractionTime);
    };
  }, []);

  // Check for inactivity and send a message
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastInteractionTimeRef.current;
      
      // If inactive for 5 minutes (300000 ms) and chat is expanded
      if (inactiveTime > 300000 && isChatExpanded) {
        const encouragementMessages = [
          "Bạn vẫn ở đó chứ? Mình luôn sẵn sàng trò chuyện nếu bạn cần.",
          "Đã một lúc rồi nhỉ? Hy vọng bạn vẫn ổn. Mình vẫn ở đây nếu bạn muốn chia sẻ điều gì.",
          "Hôm nay của bạn thế nào? Mình muốn biết thêm về cảm nhận của bạn.",
          "Bạn đang làm gì vậy? Mình rất muốn được trò chuyện cùng bạn!",
        ];
        
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        
        // Add encouragement message from Ami
        const amiMessage: Message = {
          id: Date.now().toString(),
          type: "ami",
          text: randomMessage,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, amiMessage]);
        setAmiMood("neutral");
        
        // Reset the timer
        lastInteractionTimeRef.current = now;
      }
    };
    
    // Set up the inactivity check timer (check every minute)
    inactivityTimerRef.current = setInterval(checkInactivity, 60000);
    
    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, [isChatExpanded]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Reset last interaction time
    lastInteractionTimeRef.current = Date.now();

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
                          lowerText.includes("khó khăn") ||
                          lowerText.includes("không ổn");
      
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
        
        // Send a positive image or GIF after detecting negative mood
        setTimeout(() => {
          const encouragementMessage: Message = {
            id: Date.now().toString(),
            type: "ami",
            text: "Đây là hình ảnh có thể giúp bạn cảm thấy tốt hơn 🌈",
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, encouragementMessage]);
          // Note: In a real implementation, we would send an actual image here
        }, 3000);
      } else if (lowerText.includes("chuyên gia") || lowerText.includes("tư vấn") || lowerText.includes("giúp đỡ")) {
        responseText = "Bạn muốn kết nối với chuyên gia tâm lý? Mình có thể giúp bạn kết nối ngay bây giờ nếu bạn muốn. Chỉ cần nhấn vào nút 'Gọi chuyên gia' bên dưới nhé.";
        setAmiMood("excited");
        
        setTimeout(() => {
          toast({
            title: "Kết nối chuyên gia",
            description: "Bạn có muốn gọi video với chuyên gia tâm lý?",
            action: (
              <Button variant="default" size="sm" onClick={() => window.location.href = "/video-call"}>
                Gọi ngay
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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleChat = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  // Desktop chat panel
  if (!isMobile) {
    return (
      <div className="h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.12))] flex">
        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-thrive-lavender/10 to-thrive-blue/10">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <AmiAvatar 
              size="xl" 
              mood={amiMood} 
              withGlow={true} 
              speakingAnimation={isSpeaking} 
              onClick={toggleChat}
            />
            <h1 className="text-3xl font-bold">Chào mừng đến với ThriveAI</h1>
            <p className="text-muted-foreground">
              Hãy trò chuyện với Ami, người bạn đồng hành về sức khỏe tinh thần của bạn.
            </p>
          </div>
        </div>
        
        {/* Chat panel - desktop */}
        <AnimatePresence>
          {isChatExpanded && (
            <motion.div 
              className="w-[400px] border-l flex flex-col bg-background shadow-lg"
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 30 }}
            >
              {/* Chat header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <AmiAvatar size="sm" mood={amiMood} className="mr-4" />
                  <div>
                    <h2 className="font-medium">Ami</h2>
                    <p className="text-xs text-muted-foreground">
                      {amiMood === "thinking" ? "Đang suy nghĩ..." : 
                      isSpeaking ? "Đang nói..." : "Đang hoạt động"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleChat}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
              
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
                    ref={inputRef}
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
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Floating button to open chat if closed */}
        {!isChatExpanded && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <Button 
              size="lg" 
              className="rounded-full h-16 w-16 shadow-lg"
              onClick={toggleChat}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  // Mobile view - Full page chat or drawer
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col">
      {/* Chat header on mobile */}
      <div className="flex items-center p-4 border-b">
        <AmiAvatar size="sm" mood={amiMood} className="mr-4" />
        <div>
          <h2 className="font-medium">Ami</h2>
          <p className="text-xs text-muted-foreground">
            {amiMood === "thinking" ? "Đang suy nghĩ..." : 
             isSpeaking ? "Đang nói..." : "Đang hoạt động"}
          </p>
        </div>
      </div>

      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={cn(
              "flex",
              message.type === "user" ? "justify-end" : "justify-start"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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
          </motion.div>
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
            ref={inputRef}
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
