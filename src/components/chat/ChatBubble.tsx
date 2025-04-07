
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useDragControls } from "framer-motion";
import { MessageCircleX, ChevronDown, ArrowUp } from "lucide-react";
import AmiAvatar from "@/components/AmiAvatar";
import { useChat } from "@/hooks/useChat";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const controls = useDragControls();
  const hideZoneRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useChat();

  // Load saved position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("amiBubblePosition");
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      // Default position at bottom right
      setPosition({ 
        x: window.innerWidth - 80, 
        y: window.innerHeight - 100 
      });
    }
    
    // Check if Ami was previously hidden
    const amiHidden = localStorage.getItem("amiHidden") === "true";
    setIsHidden(amiHidden);
  }, []);

  // Save position when it changes
  useEffect(() => {
    if (position.x !== 0 && position.y !== 0) {
      localStorage.setItem("amiBubblePosition", JSON.stringify(position));
    }
  }, [position]);

  // Set up inactivity timer when chat state changes
  useEffect(() => {
    setupInactivityTimer();
  }, [isOpen, setupInactivityTimer]);

  // Handle drag end - check if in hide zone
  const handleDragEnd = (event: any, info: any) => {
    if (!hideZoneRef.current || !bubbleRef.current) return;
    
    const hideZoneRect = hideZoneRef.current.getBoundingClientRect();
    const bubbleRect = bubbleRef.current.getBoundingClientRect();
    
    // Check if bubble is in the hide zone (bottom of screen)
    if (
      bubbleRect.bottom > hideZoneRect.top &&
      bubbleRect.left < hideZoneRect.right &&
      bubbleRect.right > hideZoneRect.left
    ) {
      // Hide the bubble
      setIsHidden(true);
      localStorage.setItem("amiHidden", "true");
      toast({
        title: "Ami đã ẩn",
        description: "Vuốt từ dưới lên để hiện lại Ami hoặc bấm vào góc dưới bên phải",
        duration: 3000,
      });
    } else {
      // Update position
      setPosition({ 
        x: info.point.x - bubbleRect.width / 2, 
        y: info.point.y - bubbleRect.height / 2 
      });
    }
    
    setIsDragging(false);
  };

  const toggleChat = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  const restoreAmi = () => {
    setIsHidden(false);
    localStorage.setItem("amiHidden", "false");
  };

  // Handle swipe up from bottom gesture
  useEffect(() => {
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isHidden && startY - e.touches[0].clientY > 100) {
        // If swipe up more than 100px from bottom of screen, restore Ami
        if (startY > window.innerHeight - 50) {
          restoreAmi();
        }
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isHidden]);

  // Restore button for minimized state
  const RestoreButton = () => (
    <motion.div 
      className="fixed bottom-4 right-4 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <button 
        onClick={restoreAmi}
        className="bg-primary text-white rounded-full p-2 shadow-md"
      >
        <MessageCircleX size={20} />
      </button>
    </motion.div>
  );

  return (
    <>
      {/* Hide zone indicator at bottom of screen */}
      <div 
        ref={hideZoneRef}
        className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-200/50 to-transparent pointer-events-none z-40"
      />
      
      {/* Restore button when Ami is hidden */}
      {isHidden && <RestoreButton />}
      
      {/* Main bubble */}
      {!isHidden && (
        <motion.div
          ref={bubbleRef}
          className="fixed z-50"
          drag
          dragControls={controls}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 10 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          initial={{ x: position.x, y: position.y }}
          animate={{ 
            x: position.x, 
            y: position.y,
            scale: isOpen ? 0.8 : 1 
          }}
          transition={{ 
            type: 'spring', 
            damping: 20, 
            stiffness: 300 
          }}
          style={{ touchAction: "none" }}
        >
          <div 
            onClick={toggleChat}
            className="bg-white rounded-full shadow-lg cursor-pointer"
          >
            <AmiAvatar 
              size="sm" 
              mood={amiMood} 
              animated={true} 
              withGlow={!isOpen}
              speakingAnimation={isSpeaking && isOpen}
            />
          </div>
        </motion.div>
      )}
      
      {/* Chat panel */}
      <motion.div 
        className={cn(
          "fixed bottom-20 right-4 w-[90vw] max-w-[350px] bg-background rounded-lg shadow-xl z-40 flex flex-col",
          "border overflow-hidden"
        )}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          scale: isOpen ? 1 : 0.8,
          y: isOpen ? 0 : 20,
          pointerEvents: isOpen ? "auto" : "none"
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{ height: isOpen ? "70vh" : 0 }}
      >
        {/* Chat header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center">
            <AmiAvatar 
              size="xs" 
              mood={amiMood}
              speakingAnimation={isSpeaking} 
            />
            <span className="ml-2 font-medium">Ami</span>
          </div>
          <button onClick={toggleChat}>
            <ChevronDown size={20} />
          </button>
        </div>
        
        {/* Messages */}
        <ChatMessages 
          messages={messages} 
          amiMood={amiMood} 
          isTyping={isTyping} 
          messagesEndRef={messagesEndRef}
        />
        
        {/* Suggested questions */}
        <SuggestedQuestions
          questions={suggestedQuestions}
          onSelect={handleSuggestedQuestion}
        />
        
        {/* Input area */}
        <ChatInput 
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
          handleToggleRecording={handleToggleRecording}
          isRecording={isRecording}
          isSpeaking={isSpeaking}
          setIsSpeaking={setIsSpeaking}
          inputRef={inputRef}
        />
      </motion.div>
    </>
  );
};

export default ChatBubble;
