import { useState } from "react";
import axios from "axios";
import { HTTP_URL } from "@/config";

export default function ShareButton({ roomId, authToken }: { roomId: number, authToken: string }) {
  const [showCopied, setShowCopied] = useState(false);

  const shareRoom = async () => {
    try {

      const roomToken = await axios.post(`${HTTP_URL}/api/v1/room-detail`, {
        id: roomId
      }, {
        withCredentials: true,
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
      })
      if (navigator.share) {
        // Use native share API if available (mobile devices)
        await navigator.share({
          title: 'Join my drawing room',
          text: 'Come draw with me!',
          url: roomToken.data.joinCode,
        });
      } else if (navigator.clipboard) {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(roomToken.data.joinCode);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = roomToken.data.joinCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }

    if(!roomToken){
        console.error('Failed to fetch token')
    }

    console.log(roomToken)
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="fixed top-4 right-4">
      <button
        onClick={shareRoom}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 border border-blue-500 shadow-lg shadow-blue-600/30 flex items-center gap-2"
        title="Share Room"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        Share Room
      </button>
      
      {showCopied && (
        <div className="absolute top-12 right-0 bg-green-600 text-white px-3 py-1 rounded-lg text-sm animate-bounce">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}