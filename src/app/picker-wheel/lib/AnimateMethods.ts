export const easingFunctions = {
  // 基础缓出函数
  easeOutExpo(progress: number): number {
    return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
  },

  easeOutElastic(progress: number): number {
    const c4 = (2 * Math.PI) / 3;
    return progress === 0
      ? 0
      : progress === 1
      ? 1
      : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;
  },

  easeOutQuint(progress: number): number {
    return 1 - Math.pow(1 - progress, 5);
  }, // 您需要的加速-减速函数
  easeAccelDecel(progress: number): number {
    if (progress <= 0.5) {
      // 前半段加速 (0-0.5)
      return 2 * Math.pow(progress, 2);
    } else {
      // 后半段减速 (0.5-1)
      return 1 - 2 * Math.pow(progress - 1, 2);
    }
  },
  // 正弦加速-减速（备选方案）
  easeSineAccelDecel(progress: number): number {
    return -(Math.cos(Math.PI * progress) - 1) / 2;
  },

  // 指数加速-减速
  easeExpAccelDecel(progress: number): number {
    if (progress < 0.5) {
      return Math.pow(2, 10 * (progress * 2 - 1)) / 2;
    } else {
      return 1 - Math.pow(2, -10 * ((progress - 0.5) * 2)) / 2;
    }
  },

  // 默认（使用easeOutQuint）
  default(progress: number): number {
    return 1 - Math.pow(1 - progress, 5);
  },
};
