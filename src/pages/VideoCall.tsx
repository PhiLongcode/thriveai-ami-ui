import { useState, useRef } from "react";
import { Video, Users, User, Phone, PhoneOff, Mic, MicOff, Camera, CameraOff, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AmiAvatar from "@/components/AmiAvatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const VideoCall = () => {
  const isMobile = useIsMobile();
  const [isInCall, setIsInCall] = useState(false);
  const [callWith, setCallWith] = useState<"ami" | "expert" | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [expertInfo, setExpertInfo] = useState<{ name: string; specialty: string } | null>(null);
  const [isLowConnection, setIsLowConnection] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{text: string, sender: "user" | "other"}[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  
  const handleStartCall = (type: "ami" | "expert") => {
    setCallWith(type);
    setIsConnecting(true);
    
    // Simulate connection delay and possibly low connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsInCall(true);
      
      if (type === "expert") {
        setExpertInfo({
          name: "Bác sĩ Nguyễn Thị An",
          specialty: "Tâm lý học lâm sàng",
        });

        // Simulate low connection scenario (25% chance)
        if (Math.random() < 0.25) {
          setTimeout(() => {
            setIsLowConnection(true);
            toast({
              title: "Kết nối không ổn định",
              description: "Đang tối ưu kết nối...",
              variant: "destructive",
            });

            // Simulate connection improvement after 5 seconds
            setTimeout(() => {
              setIsLowConnection(false);
              toast({
                title: "Kết nối đã ổn định",
                description: "Bạn có thể tiếp tục cuộc gọi",
              });
            }, 5000);
          }, 10000);
        }
      }
    }, 2000);
  };
  
  const handleEndCall = () => {
    setIsInCall(false);
    setCallWith(null);
    setExpertInfo(null);
    setIsMicOn(true);
    setIsCameraOn(true);
    setIsLowConnection(false);
    setChatMessages([]);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Add user message
    setChatMessages([...chatMessages, { text: chatMessage, sender: "user" }]);
    setChatMessage("");
    
    // Simulate response (only for demo)
    setTimeout(() => {
      const response = callWith === "ami" 
        ? "Ami hiểu cảm xúc của bạn. Hãy chia sẻ thêm nhé." 
        : "Tôi hiểu điều bạn đang trải qua. Hãy thử hít thở sâu.";
      
      setChatMessages(prev => [...prev, { text: response, sender: "other" }]);
      
      // Auto scroll to bottom
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 1000);
  };
  
  if (isInCall) {
    return (
      <div className="h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.12))] flex flex-col">
        {/* Video call area */}
        <div className="relative flex-1 bg-black flex items-center justify-center">
          {isConnecting ? (
            <div className="text-center text-white">
              <div className="spinner mb-4 mx-auto w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              <p className="text-xl">Đang kết nối {callWith === "expert" ? "chuyên gia" : "Ami"}...</p>
            </div>
          ) : (
            <>
              {/* Main video (other person) */}
              <div className="w-full h-full relative">
                {callWith === "ami" ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AmiAvatar size="xl" mood="happy" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    {isCameraOn ? (
                      <div className="text-center text-white">
                        <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center mx-auto">
                          <User className="w-16 h-16" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center mx-auto">
                          <User className="w-16 h-16" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Low connection overlay */}
                {isLowConnection && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="text-white text-center">
                      <div className="spinner mb-4 mx-auto w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                      <p className="text-xl">Đang tối ưu kết nối...</p>
                      <p className="mt-2 text-sm">Vui lòng đợi trong giây lát</p>
                    </div>
                  </div>
                )}
                
                {/* Expert info */}
                {callWith === "expert" && expertInfo && (
                  <div className="absolute top-4 left-4 bg-black/50 p-2 rounded-lg text-white z-20">
                    <p className="font-medium">{expertInfo.name}</p>
                    <p className="text-xs">{expertInfo.specialty}</p>
                  </div>
                )}
                
                {/* Self view */}
                {isCameraOn && (
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border border-white/20 overflow-hidden flex items-center justify-center z-20">
                    <div className="text-white text-sm">Bạn</div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Call controls */}
        <div className="h-20 bg-background flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12", 
              !isMicOn && "bg-red-100 text-red-500 border-red-200"
            )}
            onClick={() => setIsMicOn(!isMicOn)}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12",
              !isCameraOn && "bg-red-100 text-red-500 border-red-200"
            )}
            onClick={() => setIsCameraOn(!isCameraOn)}
          >
            {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          
          {/* Chat button and drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[70vh]">
              <div className="p-4 flex flex-col h-full">
                <h2 className="text-lg font-medium mb-2">Tin nhắn</h2>
                
                {/* Chat messages */}
                <div 
                  ref={chatRef}
                  className="flex-1 overflow-y-auto p-2 space-y-2 mb-2"
                >
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "max-w-[80%] rounded-3xl p-3",
                        msg.sender === "user" 
                          ? "bg-primary text-primary-foreground ml-auto rounded-tr-none" 
                          : "bg-muted mr-auto rounded-tl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
                
                {/* Chat input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>Gửi</Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        
        {/* Confirmation dialog when user tries to navigate away */}
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kết thúc cuộc gọi?</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn kết thúc cuộc gọi này?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Hủy</Button>
              <Button variant="destructive" onClick={handleEndCall}>Kết thúc</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  // Call selection screen
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gọi video</h1>
          <p className="text-muted-foreground">
            Kết nối trực tiếp với Ami hoặc chuyên gia tâm lý
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Gọi video với Ami</CardTitle>
            <CardDescription>
              Trò chuyện với người bạn AI của bạn qua video
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-2 flex justify-center">
            <AmiAvatar size="lg" mood="happy" />
          </CardContent>
          
          <CardFooter className="flex justify-center pt-6 pb-6">
            <Button className="thrive-button" onClick={() => handleStartCall("ami")}>
              <Video className="mr-2 h-4 w-4" /> Bắt đầu cuộc gọi
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Gọi video với chuyên gia</CardTitle>
            <CardDescription>
              Kết nối với chuyên gia tâm lý qua video call
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-2 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-6 pb-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="thrive-button">
                  <Phone className="mr-2 h-4 w-4" /> Liên hệ chuyên gia
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận cuộc gọi với chuyên gia</DialogTitle>
                  <DialogDescription>
                    Bạn sẽ được kết nối với chuyên gia tâm lý phù hợp để được hỗ trợ.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <p className="text-muted-foreground">
                    Lưu ý: Cuộc gọi sẽ được bảo mật. Thông tin của bạn sẽ chỉ được chia sẻ với chuyên gia để hỗ trợ tốt nhất.
                  </p>
                </div>
                
                <DialogFooter>
                  <Button variant="outline">Hủy</Button>
                  <Button onClick={() => handleStartCall("expert")}>Tiếp tục</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
      
      <div className="thrive-card p-6 border border-thrive-lavender">
        <h3 className="font-medium text-lg mb-2">Thông tin về cuộc gọi</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Cuộc gọi với Ami hoàn toàn miễn phí và không giới hạn thời gian.</li>
          <li>• Cuộc gọi với chuyên gia sẽ được kết nối với bác sĩ tâm lý chuyên nghiệp.</li>
          <li>• Mọi cuộc trò chuyện đều được bảo mật và tuân thủ quy định về riêng tư.</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoCall;
