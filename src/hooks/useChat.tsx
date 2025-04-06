
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type MessageType = "user" | "ami";
type AmiMood = "happy" | "neutral" | "thinking" | "sad" | "excited";

export interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
}

export function useChat() {
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
    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, []);

  const setupInactivityTimer = (isChatExpanded: boolean) => {
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current);
    }

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
  };

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
              <button
                className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground"
                onClick={handleBreathingExercise}
              >
                Thử ngay
              </button>
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
              <button
                className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground"
                onClick={() => window.location.href = "/video-call"}
              >
                Gọi ngay
              </button>
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

  return {
    messages,
    inputText,
    setInputText,
    amiMood,
    isRecording,
    isTyping,
    isSpeaking,
    setIsSpeaking,
    suggestedQuestions,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleToggleRecording,
    handleSuggestedQuestion,
    setupInactivityTimer,
  };
}
