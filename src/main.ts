import Phaser from 'phaser';
import { PhaserConfig } from './config';
import { GameScene } from './scenes/GameScene';

// 씬 등록
const config: Phaser.Types.Core.GameConfig = {
  ...PhaserConfig,
  scene: [GameScene],
};

// 게임 시작
window.addEventListener('load', () => {
  new Phaser.Game(config);
});
