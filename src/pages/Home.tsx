
import { Mic, Video, Headphones } from "lucide-react";
import AmiAvatar from "@/components/AmiAvatar";
import FeatureButton from "@/components/FeatureButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Home = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-8 py-4 md:py-8">
      {/* Hero section with Ami */}
      <section className="text-center space-y-6">
        <div className="flex flex-col items-center">
          <AmiAvatar 
            size={isMobile ? "lg" : "xl"} 
            mood="happy" 
            withGlow={true} 
          />
          
          <div className="mt-8 space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold">
              Xin chào! Mình là Ami
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Người bạn đồng hành giúp bạn cảm thấy khỏe mạnh hơn về tinh thần mỗi ngày.
            </p>
            
            <div className="pt-4">
              <Button className="thrive-button text-lg" asChild>
                <a href="/chat">
                  Trò chuyện với Ami
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main features */}
      <section className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <FeatureButton
            to="/chat"
            icon={<Mic />}
            label="Nói chuyện với Ami"
            description="Trò chuyện về cảm xúc và nhận hỗ trợ"
            className="bg-gradient-to-r from-thrive-lavender to-thrive-blue"
          />
          <FeatureButton
            to="/video-call"
            icon={<Video />}
            label="Gọi video"
            description="Kết nối trực tiếp với Ami hoặc chuyên gia"
            className="bg-gradient-to-r from-thrive-blue to-thrive-teal"
          />
          <FeatureButton
            to="/podcast"
            icon={<Headphones />}
            label="Podcast & Video"
            description="Nội dung động lực cho tinh thần"
            className="bg-gradient-to-r from-thrive-teal to-thrive-peach"
          />
        </div>
      </section>
      
      {/* Wellness tip of the day */}
      <section className="pt-6">
        <div className="thrive-card p-6 border border-thrive-lavender">
          <h3 className="font-medium text-lg mb-2">Lời khuyên hôm nay</h3>
          <p className="text-muted-foreground">
            "Hãy dành 5 phút mỗi ngày để nghỉ ngơi và thư giãn. Nhắm mắt, hít thở sâu và cảm nhận sự bình yên trong tâm hồn."
          </p>
        </div>
      </section>
      
      {/* Recent mood tracking */}
      {!isMobile && (
        <section className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tâm trạng gần đây</h2>
            <Button variant="link" className="font-medium" asChild>
              <a href="/mood-tracker">Xem đầy đủ</a>
            </Button>
          </div>
          
          <div className="thrive-card p-4">
            <div className="h-40 flex items-center justify-center">
              <p className="text-muted-foreground">
                Theo dõi tâm trạng để nhận những gợi ý phù hợp từ Ami
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
