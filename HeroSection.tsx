import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import YouTubeVideoPlayer from "./YouTubeVideoPlayer";

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subscriptionMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/subscribe", {
        email,
        subscriptionType: "newsletter",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for subscribing to Wabuntu updates!",
      });
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscriptionMutation.mutate(email);
    }
  };

  return (
    <section id="homepage" className="min-h-screen flex items-center justify-center relative sacred-geometry">
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 text-glow">
              <span className="text-wabuntu-yellow">WABUNTU</span>
              <span className="text-wabuntu-green block">RISING</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Building a Decentralized Autonomous Society rooted in Ubuntu philosophy, 
              empowering the Pan-African diaspora through technology and collective wisdom.
            </p>
            
            <div className="bg-wabuntu-blue/30 p-6 rounded-lg sigil-border mb-8">
              <h3 className="text-lg font-semibold mb-4 text-wabuntu-yellow">Join the Wabuntu Vision</h3>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email to stay updated"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-wabuntu-black border-wabuntu-green text-wabuntu-white placeholder-gray-400"
                />
                <Button
                  type="submit"
                  disabled={subscriptionMutation.isPending}
                  className="bg-wabuntu-green hover:bg-wabuntu-green/80 px-6 py-3 font-semibold glow-button"
                >
                  {subscriptionMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                      </svg>
                      Subscribe
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="relative">
            <YouTubeVideoPlayer 
              mainVideoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
