import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { Colors } from './utils/Colors';

/**
 * Phaser 게임 설정
 * 목표: 60fps, <50ms 입력 지연, <3초 로딩
 */

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: Colors.BG_DARK,

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800, x: 0 },
      debug: true, // 프로토타입이므로 디버그 모드
    },
  },

  scene: [GameScene],

  render: {
    pixelArt: false, // 벡터 그래픽 사용
    antialias: true,
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  fps: {
    target: 60,
    forceSetTimeOut: false,
  },
};
