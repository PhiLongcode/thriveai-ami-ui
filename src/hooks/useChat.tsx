
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Message, AmiMood } from "@/types/chat";
import { generateAmiResponse, handleBreathingExercise } from "@/utils/chatUtils";
import { useInactivity } from "@/hooks/useInactivity";

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

  // Suggested questions
  const suggestedQuestions = [
    "Bạn đang cảm thấy thế nào?",
    "Bạn có muốn thư giãn không?",
    "Chúng ta có thể làm gì để giúp bạn cảm thấy tốt hơn?",
    "Bạn có thể kể chuyện vui không?",
    "Hôm nay tôi cảm thấy không ổn",
  ];

  // Handle inactivity
  const handleInactiveMessage = (amiMessage: Message, mood: AmiMood) => {
    setMessages(prev => [...prev, amiMessage]);
    setAmiMood(mood);
  };

  const { setupInactivityTimer } = useInactivity({
    isEnabled: true,
    onInactiveMessage: handleInactiveMessage
  });

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
      const { responseText, newMood, showToast } = generateAmiResponse(inputText);
      
      const amiMessage: Message = {
        id: Date.now().toString(),
        type: "ami",
        text: responseText,
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setAmiMood(newMood);
      
      // Simulate Ami speaking
      setIsSpeaking(true);
      setMessages(prev => [...prev, amiMessage]);
      
      // Show toast if needed
      if (showToast) {
        showToast();
      }
      
      // Send a positive image for sad users
      if (newMood === "neutral") {
        setTimeout(() => {
          const encouragementMessage: Message = {
            id: Date.now().toString(),
            type: "ami",
            text: "Đây là hình ảnh có thể giúp bạn cảm thấy tốt hơn 🌈",
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, encouragementMessage]);
        }, 3000);
      }
      
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
