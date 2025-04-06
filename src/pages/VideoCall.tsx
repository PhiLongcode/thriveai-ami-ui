
import { useState } from "react";
import { Video, Users, User, Phone, PhoneOff, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AmiAvatar from "@/components/AmiAvatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const VideoCall = () => {
  const isMobile = useIsMobile();
  const [isInCall, setIsInCall] = useState(false);
  const [callWith, setCallWith] = useState<"ami" | "expert" | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [expertInfo, setExpertInfo] = useState<{ name: string; specialty: string } | null>(null);
  
  const handleStartCall = (type: "ami" | "expert") => {
    setCallWith(type);
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsInCall(true);
      
      if (type === "expert") {
        setExpertInfo({
          name: "Bác sĩ Nguyễn Thị An",
          specialty: "Tâm lý học lâm sàng",
        });
      }
    }, 2000);
  };
  
  const handleEndCall = () => {
    setIsInCall(false);
    setCallWith(null);
    setExpertInfo(null);
    setIsMicOn(true);
    setIsCameraOn(true);
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
              {callWith === "ami" ? (
                <div className="text-center">
                  <AmiAvatar size="xl" mood="happy" />
                  <p className="text-white mt-4 text-xl">Ami</p>
                </div>
              ) : (
                <>
                  {isCameraOn ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center mx-auto">
                          <User className="w-16 h-16" />
                        </div>
                        <p className="mt-4 text-xl">{expertInfo?.name}</p>
                        <p className="text-sm opacity-80">{expertInfo?.specialty}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center mx-auto">
                        <User className="w-16 h-16" />
                      </div>
                      <p className="mt-4 text-xl">{expertInfo?.name}</p>
                      <p className="text-sm opacity-80">{expertInfo?.specialty}</p>
                    </div>
                  )}
                </>
              )}
              
              {/* Self view */}
              {isCameraOn && (
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border border-white/20 overflow-hidden flex items-center justify-center">
                  <div className="text-white text-sm">Bạn</div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Call controls */}
        <div className="h-20 bg-background flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => setIsMicOn(!isMicOn)}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-red-500" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => setIsCameraOn(!isCameraOn)}
          >
            {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5 text-red-500" />}
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }
  
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
