import Phaser from 'phaser';
import { GameConfig } from '../config';

export type ObstacleType = 'low' | 'medium' | 'high';

export class Obstacle {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public passed: boolean = false; // 플레이어가 통과했는지 (보너스 점수용)
  public type: ObstacleType;
  private width: number;
  private height: number;

  constructor(scene: Phaser.Scene, x: number, y: number, type: ObstacleType = 'medium') {
    this.type = type;

    // 타입에 따라 크기 결정
    this.width = GameConfig.OBSTACLE.WIDTH;
    switch (type) {
      case 'low':
        this.height = 25; // 플레이어 기본 높이(40)보다 낮음 - 숙여서 피해야 함
        break;
      case 'high':
        this.height = 80; // 플레이어 점프 높이보다 높음 - 더블점프로 넘어야 함
        break;
      case 'medium':
      default:
        this.height = GameConfig.OBSTACLE.HEIGHT; // 50 - 기본 점프로 넘김
        break;
    }

    // 장애물 스프라이트 생성
    this.sprite = scene.physics.add.sprite(x, y, '');

    // 그래픽 생성 (타입별로 고유 텍스처)
    const textureName = `obstacle_${type}`;
    if (!scene.textures.exists(textureName)) {
      const graphics = scene.add.graphics();
      graphics.fillStyle(GameConfig.OBSTACLE.COLOR, 1);
      graphics.fillRect(0, 0, this.width, this.height);
      graphics.generateTexture(textureName, this.width, this.height);
      graphics.destroy();
    }

    this.sprite.setTexture(textureName);

    // 물리 바디 설정
    this.sprite.body!.setSize(this.width, this.height);
    (this.sprite.body as Phaser.Physics.Arcade.Body).allowGravity = false; // 중력 영향 받지 않음
  }

  setVelocity(speed: number): void {
    this.sprite.setVelocityX(-speed); // 왼쪽으로 이동 (플레이어가 달리는 느낌)
  }

  isOffScreen(): boolean {
    return this.sprite.x < -this.width;
  }

  getHeight(): number {
    return this.height;
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
