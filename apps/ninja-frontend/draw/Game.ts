import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
      color: string;
    }
  | {
      type: "pencil";
      points: { x: string; y: string }[];
      color: string;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private isDrawing: boolean = false;
  private currentPath: { x: string; y: string }[] = [];
  private selectedColor: string = "#ffffff";

  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);

    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);

    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: "circle" | "pencil" | "rect") {
    this.selectedTool = tool;
  }

  setColor(color: string) {
    this.selectedColor = color;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearCanvas();
      } else if (message.type === "clear") {
        this.existingShapes = [];
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape) => {
      const color = shape.color || "#ffffff";
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";

      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.radius),
          0,
          Math.PI * 2,
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
        this.drawPencilShape(shape);
      }
    });
  }

  mouseDownHandler = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;

    if (this.selectedTool === "pencil") {
      this.isDrawing = true;
      this.currentPath = [{ x, y }];
    } else {
      this.clicked = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    }
  };

  mouseUpHandler = (e: any) => {
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;
    const selectedTool = this.selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === "pencil" && this.isDrawing) {
      this.isDrawing = false;

      if (this.currentPath.length > 1) {
        shape = {
          type: "pencil",
          points: [...this.currentPath],
          color: this.selectedColor,
        };
      }

      this.currentPath = [];
    } else if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
        color: this.selectedColor,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "circle",
        radius: radius,
        centerX: this.startX + radius,
        centerY: this.startY + radius,
        color: this.selectedColor,
      };
    }

    if (!shape) {
      return;
    }

    this.existingShapes.push(shape);

    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: this.roomId,
      }),
    );
  };

  clearAll() {
    this.existingShapes = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.socket.send(
      JSON.stringify({
        type: "clear",
        roomId: this.roomId,
      }),
    );
  }

  mouseMoveHandler = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;

    if (this.selectedTool === "pencil" && this.isDrawing) {
      this.currentPath.push({ x, y });
      this.clearCanvas();
      this.drawCurrentPath();
    } else if (this.clicked) {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      this.clearCanvas();
      this.ctx.strokeStyle = this.selectedColor;
      const selectedTool = this.selectedTool;
      this.ctx.lineWidth = 2;

      if (selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (selectedTool === "circle") {
        const radius = Math.max(width, height) / 2;
        const centerX = this.startX + radius;
        const centerY = this.startY + radius;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);

    this.canvas.addEventListener("mouseup", this.mouseUpHandler);

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private drawCurrentPath() {
    if (this.currentPath.length < 2) return;

    this.ctx.strokeStyle = this.selectedColor;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    this.ctx.beginPath();
    this.ctx.moveTo(
      Number(this.currentPath[0].x),
      Number(this.currentPath[0].y),
    );

    for (let i = 1; i < this.currentPath.length; i++) {
      this.ctx.lineTo(
        Number(this.currentPath[i].x),
        Number(this.currentPath[i].y),
      );
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }

  private drawPencilShape(shape: Shape & { type: "pencil" }) {
    if (shape.points.length < 2) return;

    this.ctx.strokeStyle = shape.color || "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    this.ctx.beginPath();
    this.ctx.moveTo(Number(shape.points[0].x), Number(shape.points[0].y));

    for (let i = 1; i < shape.points.length; i++) {
      this.ctx.lineTo(Number(shape.points[i].x), Number(shape.points[i].y));
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }
}
