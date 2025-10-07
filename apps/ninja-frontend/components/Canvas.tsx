import { useEffect, useRef, useState } from "react";
import {
  Pencil,
  Circle,
  Palette,
  RectangleHorizontal,
  Trash2,
} from "lucide-react";
import { Game } from "@/draw/Game";
import axios from "axios";
import { HTTP_URL } from "@/config";
import ShareButton from "./ShareButton";

export type Tool = "pencil" | "circle" | "rect";

export function Canvas({
  roomId,
  socket,
  authToken,
}: {
  roomId: string;
  socket: WebSocket;
  authToken: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [showColorPalette, setShowColorPalette] = useState(false);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    game?.setColor(selectedColor);
  }, [selectedColor, game]);

  useEffect(() => {
    // const canvas = canvasRef.current;
    // if(canvas == null) {
    // return
    // }
    // initDraw(canvas, socket, roomId)
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >

      <ShareButton roomId={Number(roomId)} authToken={authToken} />

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ display: "block" }}
      />
      <Toolbar
        authToken={authToken}
        roomId={roomId}
        game={game as Game}
        setSelectedTool={setSelectedTool}
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        showColorPalette={showColorPalette}
        setShowColorPalette={setShowColorPalette}
      />
    </div>
  );
}

function Toolbar({
  authToken,
  roomId,
  game,
  selectedTool,
  setSelectedTool,
  selectedColor,
  setSelectedColor,
  showColorPalette,
  setShowColorPalette,
}: {
  authToken: string;
  roomId: string;
  game: Game;
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  showColorPalette: boolean;
  setShowColorPalette: (show: boolean) => void;
}) {
  const colors = [
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
    "#008000",
    "#000080",
    "#800000",
    "#808000",
    "#008080",
    "#c0c0c0",
    "#808080",
  ];

  const rID: number = Number(roomId);
  const clearDrawings = async () => {
    if (game) {
      game.clearAll();
      const res = await axios.delete(`${HTTP_URL}/api/v1/chats/${rID}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(res);
    }
  };

  return (
    <>
      {showColorPalette && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-gray-900 backdrop-blur-lg border border-gray-700 rounded-2xl p-4 shadow-2xl">
          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setShowColorPalette(false);
                }}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  selectedColor === color
                    ? "border-blue-400 shadow-lg shadow-blue-400/50"
                    : "border-gray-600 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-2xl p-2 shadow-2xl">
          <div className="flex items-center gap-2">
            <IconButton
              onClick={() => setSelectedTool("pencil")}
              activated={selectedTool === "pencil"}
              icon={<Pencil size={20} />}
              tooltip="Pencil"
            />
            <IconButton
              onClick={() => setSelectedTool("rect")}
              activated={selectedTool === "rect"}
              icon={<RectangleHorizontal size={20} />}
              tooltip="Rectangle"
            />
            <IconButton
              onClick={() => setSelectedTool("circle")}
              activated={selectedTool === "circle"}
              icon={<Circle size={20} />}
              tooltip="Circle"
            />

            <div className="w-px h-8 bg-gray-600 mx-1" />

            <button
              onClick={() => setShowColorPalette(!showColorPalette)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-gray-800 border border-gray-700"
              title="Color Palette"
            >
              <div
                className="w-5 h-5 rounded-full border border-gray-500"
                style={{ backgroundColor: selectedColor }}
              />
              <Palette size={16} className="text-gray-300" />
            </button>

            <IconButton
              onClick={clearDrawings}
              activated={false}
              icon={<Trash2 size={20} />}
              tooltip="Clear Canvas"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function IconButton({
  onClick,
  activated,
  icon,
  tooltip,
}: {
  onClick: () => void;
  activated: boolean;
  icon: React.ReactNode;
  tooltip: string;
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-3 rounded-xl transition-all duration-200 border ${
        activated
          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30"
          : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600"
      }`}
    >
      {icon}
    </button>
  );
}