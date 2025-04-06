
import { useState } from "react";
import { cn } from "@/lib/utils";

type AmiMood = "happy" | "neutral" | "thinking" | "sad" | "excited";

interface AmiAvatarProps {
  mood?: AmiMood;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  withGlow?: boolean;
  className?: string;
}

const AmiAvatar = ({
  mood = "happy",
  size = "md",
  animated = true,
  withGlow = true,
  className,
}: AmiAvatarProps) => {
  // For a real app, you'd use actual character images
  // This is a placeholder using emoji and styling
  
  const getMoodEmoji = (mood: AmiMood) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "neutral":
        return "😐";
      case "thinking":
        return "🤔";
      case "sad":
        return "😢";
      case "excited":
        return "😄";
      default:
        return "😊";
    }
  };
  
  const sizeClasses = {
    sm: "w-16 h-16 text-3xl",
    md: "w-24 h-24 text-4xl",
    lg: "w-32 h-32 text-5xl",
    xl: "w-40 h-40 text-6xl",
  };
  
  const glowSizes = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
    xl: "w-48 h-48",
  };

  return (
    <div className={cn("ami-container", className)}>
      {withGlow && (
        <div className={cn("ami-glow", glowSizes[size])}></div>
      )}
      <div 
        className={cn(
          "ami-avatar bg-white rounded-full flex items-center justify-center text-center shadow-lg border-4 border-thrive-lavender",
          sizeClasses[size],
          animated && "animate-float"
        )}
      >
        {getMoodEmoji(mood)}
      </div>
    </div>
  );
};

export default AmiAvatar;
