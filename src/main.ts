import Phaser from 'phaser';
import { gameConfig } from './config';

/**
 * 쾌쾌쾌 - Neon Comic Action Game
 * 진입점
 */

console.log('🎮 쾌쾌쾌 시작!');
console.log('⚡ Neon Comic Style');
console.log('💥 Fast Action Combo');

const game = new Phaser.Game(gameConfig);

// 디버그 정보
if (import.meta.env.DEV) {
  console.log('🔧 개발 모드');
  console.log(`Canvas 크기: ${gameConfig.width}x${gameConfig.height}`);

  // 전역으로 게임 객체 노출 (디버깅용)
  (window as any).game = game;
}

export default game;
