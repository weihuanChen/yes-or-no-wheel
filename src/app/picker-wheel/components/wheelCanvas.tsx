"use client";
import { AnimationConfig } from "@/lib/config";
import { usePrizeStore } from "@/store/prize-store";
import { useEffect, useRef, useState } from "react";
import { easingFunctions } from "../lib/AnimateMethods";
export default function WheelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationAngle = useRef(0);
  const [wheelSize, setWheelSize] = useState(300); // 默认值
  const EGG_ANGLE_START = 45; // 彩蛋开始角度
  const EGG_ANGLE_END = 180; // 彩蛋结束角度
  const CANVAS_EGG_START = (EGG_ANGLE_START + 90) % 360;
  const CANVAS_EGG_END = (EGG_ANGLE_END + 90) % 360;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { prizes } = usePrizeStore();
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
    // 测试：绘制彩蛋区域
    // ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
    // ctx.beginPath();
    // ctx.moveTo(centerX, centerY);
    // ctx.arc(
    //   centerX,
    //   centerY,
    //   radius,
    //   (CANVAS_EGG_START * Math.PI) / 180,
    //   (CANVAS_EGG_END * Math.PI) / 180
    // );
    ctx.fill();
    ctx.restore();
  };
  // 旋转代码
  const handleSpin = () => {
    if (isSpinning || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    if (audioRef.current && !isPlaying) {
      audioRef.current.play();
    }
    setIsSpinning(true);
    const startAngle = rotationAngle.current;
    //const targetAngle = startAngle + 5 * 360 + (EGG_ANGLE_START + 0.5);
    // 转五圈+随机角度
    const targetAngle = startAngle + 10800 + Math.random() * 360;

    let startTime: number | null = null;
    // 手动动画
    const animateFrame = (timestamp: number, config: AnimationConfig) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / config.duration, 1);
      let easeOutProgress = 0;
      // 弹性缓动 映射表
      const easingMap = {
        easeOutExpo: easingFunctions.easeOutExpo,
        easeOutElastic: easingFunctions.easeOutElastic,
        easeOutQuint: easingFunctions.easeOutQuint,
        easeAccelDecel: easingFunctions.easeAccelDecel,
        easeSineAccelDecel: easingFunctions.easeSineAccelDecel,
        easeExpAccelDecel: easingFunctions.easeExpAccelDecel,
        default: easingFunctions.default,
      };
      const easingType = config.easing || "default";

      // 执行动画
      easeOutProgress =
        easingMap[easingType]?.(progress) || easingMap["default"](progress);

      // 计算角度
      rotationAngle.current =
        startAngle + (targetAngle - startAngle) * easeOutProgress;
      drawWheel(ctx, rotationAngle.current);

      if (progress < 1) {
        requestAnimationFrame((ts) => animateFrame(ts, config));
      } else {
        // 转盘结束
        setIsSpinning(false);
        const physicalAngle = ((rotationAngle.current % 360) + 360) % 360;

        const prizeIndex = Math.floor(
          (((physicalAngle % 360) + 90) % 360) / 180
        );
        alert(`Result: ${["Yes", "No"][prizeIndex]}`);
      }
    };
    const animationConfig: AnimationConfig = {
      duration: 7000,

      easing: "easeSineAccelDecel", // 启动模式
      startVelocity: 50.0,
      decelerationFactor: 0.8,
    };
    requestAnimationFrame((timestamp) =>
      animateFrame(timestamp, animationConfig)
    );
  };

  // 初始化Canvas
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
      <div
        className="relative"
        style={{ width: `${wheelSize}px`, height: `${wheelSize}px` }}
      >
        <div className="absolute box-content inset-0 mx-auto my-auto w-[80px] h-[80px]">
          <div
            className="absolute  inset-0 w-[80px] h-[80px]  rotate-[-45deg] bg-black z-2"
            style={{ borderRadius: "50% 50% 50% 0" }}
          ></div>
          <div
            style={{ textShadow: "rgb(0, 0, 0) 0px 1px 4px" }}
            className="absolute inset-0 w-[80px] h-[80px] rounded-[50%] z-3  size-[16px] font-bold block bg-transparent select-noen  tracking-[0.7px] leading-[80px] text-center text-white"
          >
            SPIN
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="mx-auto border rounded-full shadow-lg"
        />
      </div>
      {/** 声音播放 */}
      <audio
        src="/sounds/wheel1.mp3"
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
      ></audio>
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
