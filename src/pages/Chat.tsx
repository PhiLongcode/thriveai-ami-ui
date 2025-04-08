
import { useState, useEffect } from "react";
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
  const [isChatExpanded, setIsChatExpanded] = useState(true); // Always expanded
  
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

  useEffect(() => {
    setupInactivityTimer();
  }, [setupInactivityTimer]);

  // Desktop view - Full width chat
  if (!isMobile) {
    return (
      <div className="h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.12))] flex">
        <div className="w-full flex flex-col bg-background">
          <ChatHeader 
            amiMood={amiMood} 
            isSpeaking={isSpeaking}
            onClose={() => {}}
          />
          
          <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-thrive-lavender/5 to-thrive-blue/5">
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
          </div>
        </div>
      </div>
    );
  }

  // Mobile view remains unchanged
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
      
      {/* No need for mobile chat icon anymore, it's in the Layout component */}
    </div>
  );
};

export default Chat;
