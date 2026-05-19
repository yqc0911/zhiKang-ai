import { Thread } from "@assistant-ui/react";
import "@assistant-ui/react/styles.css";

export default function HealthAIPage() {
  return (
    <div className="h-screen w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#0d9488]">AI 健康问诊</h1>
      
      {/* 核心 AI 对话组件 */}
      <Thread className="border rounded-lg shadow-sm" />
    </div>
  );
}