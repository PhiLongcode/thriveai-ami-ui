
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useDragControls } from "framer-motion";
import AmiAvatar from "@/components/AmiAvatar";

const ChatButton = () => {
  const navigate = useNavigate();
  const controls = useDragControls();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Initialize position in bottom right corner
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPosition = localStorage.getItem("amiChatPosition");
      if (savedPosition) {
        setPosition(JSON.parse(savedPosition));
      } else {
        // Default position in bottom right
        setPosition({ 
          x: window.innerWidth - 100, 
          y: window.innerHeight - 140 
        });
      }
    }
  }, []);

  // Save position when it changes
  useEffect(() => {
    if (position.x !== 0 && position.y !== 0) {
      localStorage.setItem("amiChatPosition", JSON.stringify(position));
    }
  }, [position]);

  const handleDragEnd = (event: any, info: any) => {
    setPosition({ x: info.point.x, y: info.point.y });
  };

  const handleChatOpen = () => {
    navigate("/chat");
  };

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute pointer-events-auto cursor-move"
        drag
        dragControls={controls}
        dragMomentum={false}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        onDragEnd={handleDragEnd}
        initial={{ x: position.x, y: position.y }}
        animate={{ x: position.x, y: position.y }}
        whileTap={{ scale: 0.95 }}
        style={{ touchAction: "none" }}
      >
        <div 
          onClick={handleChatOpen}
          className="bg-white rounded-full p-2 shadow-lg"
        >
          <AmiAvatar 
            size="md" 
            animated={true} 
            withGlow={true}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ChatButton;
