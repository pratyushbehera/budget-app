import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/system/Button";

export default function ChatWidget() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-8 right-24 z-20">
      <Button size="icon-md" onClick={() => navigate("/ai-chat")}>
        <Sparkles
          size={32}
          strokeWidth={1.5}
          className="hover:rotate-12 transition-transform duration-300"
        />
      </Button>
    </div>
  );
}
