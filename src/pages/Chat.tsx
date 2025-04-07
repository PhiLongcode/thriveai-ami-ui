
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import AmiAvatar from "@/components/AmiAvatar";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";

// Chat components
import ChatHeader from "@/components/chat/ChatHeader";
import MobileHeader from "@/components/chat/MobileHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import SuggestedQuestions from "@/components/chat/SuggestedQuestions";
import ChatInput from "@/components/chat/ChatInput";

const Chat = () => {
  const isMobile = useIsMobile();
  const [isChatExpanded, setIsChatExpanded] = useState(!isMobile);
  
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

  // Set up inactivity timer when chat expanded state changes
  useState(() => {
    setupInactivityTimer(isChatExpanded);
  });

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
              <ChatHeader 
                amiMood={amiMood} 
                isSpeaking={isSpeaking} 
                onClose={toggleChat} 
              />
              
              <ChatMessages 
                messages={messages} 
                amiMood={amiMood} 
                isTyping={isTyping} 
                messagesEndRef={messagesEndRef} 
              />

              <SuggestedQuestions 
                questions={suggestedQuestions} 
                onSelect={handleSuggestedQuestion} 
              />

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
          )}
        </AnimatePresence>
        
        {/* Floating button to open chat if closed - always visible */}
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

  // Mobile view - Full page chat
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col">
      <MobileHeader amiMood={amiMood} isSpeaking={isSpeaking} />

      <ChatMessages 
        messages={messages} 
        amiMood={amiMood} 
        isTyping={isTyping} 
        messagesEndRef={messagesEndRef} 
      />

      <SuggestedQuestions 
        questions={suggestedQuestions} 
        onSelect={handleSuggestedQuestion} 
      />

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
      
      {/* Always visible chat icon for mobile - positioned at bottom right */}
      <motion.div 
        className="fixed bottom-20 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <Button 
          size="icon" 
          className="rounded-full h-12 w-12 shadow-lg bg-primary"
          onClick={() => window.location.href = "/chat"}
        >
          <MessageSquare className="h-5 w-5 text-white" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Chat;
