export interface AnimationConfig {
  duration: number;
  easing: 'easeOutQuint' | 'easeOutExpo' | 'easeOutElastic' | 'easeAccelDecel' | 'easeSineAccelDecel' | 'easeExpAccelDecel' | 'default';
  startVelocity?: number; // 初始加速度
  decelerationFactor?: number; // 中段减速度
}