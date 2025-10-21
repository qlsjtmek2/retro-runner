import Phaser from 'phaser';

export const GameConfig = {
  // 게임 설정
  WIDTH: 800,
  HEIGHT: 600,

  // Rainbow Neon 색상 팔레트
  COLORS: {
    PLAYER: 0xFFFF00,      // Neon Yellow (최고 가시성)
    OBSTACLE: 0xA855F7,    // Neon Purple (위험한 느낌)
    GROUND: 0xFF8800,      // Neon Orange (안정감)
    BACKGROUND: 0x0f0f23,  // Deep Purple (어두운 배경)
    PARTICLE: 0x00FF88,    // Neon Green (생동감)
    TEXT: 0xffffff,        // White
    FLASH: 0xFF1493,       // Hot Pink (강렬한 경고)
  },

  // 플레이어 설정
  PLAYER: {
    WIDTH: 40,
    HEIGHT: 40,
    SPEED: 300,        // 좌우 이동 속도
    JUMP_VELOCITY: -500, // 점프 속도 (음수 = 위로)
    FAST_FALL_VELOCITY: 800, // 빠른 하강 속도
    MAX_JUMPS: 2,      // 최대 점프 횟수 (더블점프)
    DUCK_HEIGHT: 20,   // 숙일 때 높이 (기본 40의 절반)
    COLOR: 0x00ffff,   // Cyan
  },

  // 장애물 설정
  OBSTACLE: {
    WIDTH: 30,
    HEIGHT: 50,
    SPEED: 400,        // 초기 속도 (300 → 400, 즉시 긴장감)
    SPAWN_INTERVAL: 1500, // 초기 생성 간격 (2000 → 1500, 더 빠름)
    COLOR: 0xff00ff,   // Magenta
  },

  // 애니메이션 설정
  ANIMATION: {
    SQUASH_DURATION: 100,     // Squash & Stretch 지속 시간
    SQUASH_SCALE_Y: 0.7,      // 착지 시 세로 압축
    SQUASH_SCALE_X: 1.3,      // 착지 시 가로 확장
    STRETCH_SCALE_Y: 1.3,     // 점프 시 세로 확장
    STRETCH_SCALE_X: 0.8,     // 점프 시 가로 압축
    DUCK_SCALE_Y: 0.5,        // 숙일 때 세로 압축
    DUCK_SCALE_X: 1.3,        // 숙일 때 가로 확장
    DUCK_DURATION: 100,       // 숙이기 애니메이션 시간
    TRAIL_ALPHA: 0.5,         // 잔상 투명도
    TRAIL_LIFETIME: 200,      // 잔상 지속 시간 (ms)
  },

  // 카메라 효과
  CAMERA: {
    SHAKE_DURATION: 200,
    SHAKE_INTENSITY: 0.01,
  },

  // 난이도 설정
  DIFFICULTY: {
    INCREASE_INTERVAL: 10000, // 10초마다 (20초 → 10초, 2배 빠른 증가)
    SPEED_MULTIPLIER: 1.2,    // 속도 20% 증가 (15% → 20%, 더 체감)
    SPAWN_MULTIPLIER: 0.75,   // 생성 간격 25% 감소 (20% → 25%, 더 빠르게)
  },

  // 점수 설정
  SCORE: {
    SURVIVAL_RATE: 10, // 1초당 10점
    OBSTACLE_BONUS: 10, // 장애물 통과 시
  },

  // 물리 설정
  PHYSICS: {
    GRAVITY: 1000,
  },
} as const;

export const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameConfig.WIDTH,
  height: GameConfig.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#0f0f23', // Deep Purple (Rainbow theme)
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GameConfig.PHYSICS.GRAVITY, x: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GameConfig.WIDTH,
    height: GameConfig.HEIGHT,
  },
};
