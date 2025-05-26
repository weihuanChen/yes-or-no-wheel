"use client";
import { usePrizeStore } from "@/store/prize-store";
import { useEffect, useRef, useState } from "react";

export default function WheelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationAngle = useRef(0);
  const [wheelSize, setWheelSize] = useState(300); // 默认值
  const { prizes, currentWinner, addPrize, removePrize, setWinner } =
    usePrizeStore();
  // 绘制转盘（修复尺寸问题）
  const drawWheel = (ctx: CanvasRenderingContext2D, angle: number = 0) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const displaySize = Math.min(ctx.canvas.width, ctx.canvas.height); // 统一尺寸基准
    const radius = displaySize / 2 - 10; // 保留10px边距

    // 清除画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 应用旋转
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // 绘制扇形
    prizes.forEach((prize, i) => {
      const startAngle = (i * Math.PI * 2) / prizes.length;
      const endAngle = ((i + 1) * Math.PI * 2) / prizes.length;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = i === 0 ? "#FF5252" : "#4CAF50";
      ctx.fill();

      // 绘制文字
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + Math.PI / prizes.length);
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = `bold ${radius * 0.15}px Arial`; // 动态字体大小
      ctx.fillText(prize.name, radius * 0.5, radius * 0.05);
      ctx.restore();
    });

    ctx.restore();
  };
  const handleSpin = () => {
    if (isSpinning || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    setIsSpinning(true);
    const startAngle = rotationAngle.current;
    const targetAngle = startAngle + 1800 + Math.random() * 360;

    let startTime: number | null = null;
    const duration = 3000;
    // 手动动画
    const animateFrame = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 弹性缓动
      const elasticProgress =
        progress < 0.5
          ? 0.5 * Math.pow(2, 20 * progress - 10)
          : 0.5 * (2 - Math.pow(2, -20 * progress + 10));

      rotationAngle.current =
        startAngle + (targetAngle - startAngle) * elasticProgress;
      drawWheel(ctx, rotationAngle.current);

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        // 转盘结束
        setIsSpinning(false);
        const prizeIndex = Math.floor(
          (((rotationAngle.current % 360) + 90) % 360) / 180
        );
        alert(`Result: ${["Yes", "No"][prizeIndex]}`);
      }
    };

    requestAnimationFrame(animateFrame);
  };

  // 初始化Canvas（关键修复）
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 逻辑尺寸（保持300x300的工作坐标）
    const logicalSize = wheelSize;
    canvas.width = wheelSize;
    canvas.height = wheelSize;

    // 显示尺寸（通过CSS控制）
    canvas.style.width = `${logicalSize}px`;
    canvas.style.height = `${logicalSize}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 初始化绘制
    drawWheel(ctx);
  }, []);

  return (
    <div className="text-center">
      <div className="relative" style={{width:`${wheelSize}px`,height:`${wheelSize}px`}}>
        <div className="absolute box-content inset-0 mx-auto my-auto w-[80px] h-[80px]">
          <div className="absolute  inset-0 w-[80px] h-[80px]  rotate-[-45deg] bg-black z-2"
          style={{borderRadius:"50% 0px 50% 50%"}}
          ></div>
          <div style={{textShadow:"rgb(0, 0, 0) 0px 1px 4px"}} className="absolute inset-0 w-[80px] h-[80px] rounded-[50%] z-3  size-[16px] font-bold block bg-transparent select-noen  tracking-[0.7px] leading-[80px] text-center">SPIN</div>
        </div>
      <canvas
        ref={canvasRef}
        className="mx-auto border rounded-full shadow-lg"
      />
      </div>
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isSpinning ? "spinning..." : "start spinning"}
      </button>
    </div>
  );
}
