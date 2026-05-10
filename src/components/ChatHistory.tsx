type History= {
  id: number;
  name: string;
};

const ChatHistory = ({ history }: { history: History[] }) => {
  return (
    <div className="w-1/4 min-w-[220px] max-w-xs border-r border-gray-300 bg-gray-900 p-4 flex flex-col">
      <div className="space-y-2 flex-1 overflow-y-auto">
        {history.map((conversation: History) => (
          <div className="p-3 bg-gray-800 rounded-lg shadow" id={conversation.id.toString()}>
            {conversation.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;