import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { Thread } from "../../im/components/assistant-ui";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Sidebar } from "@assistant-ui/react";
export default function Chat() {
  const runtime = useChatRuntime();
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1">
          {/* <Thread /> */}
        </main>
      </div>
    </AssistantRuntimeProvider>
  );
}