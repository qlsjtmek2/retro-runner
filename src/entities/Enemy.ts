import Phaser from 'phaser';
import { Colors } from '../utils/Colors';

/**
 * Enemy (적 더미)
 * 타격 테스트용 적 객체
 */
export class Enemy {
  public sprite: Phaser.GameObjects.Rectangle;
  private scene: Phaser.Scene;
  private body: Phaser.Physics.Arcade.Body;

  private health: number = 3; // 3번 맞으면 사라짐
  private isHit: boolean = false; // 현재 피격 중인가

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // 스프라이트 생성 (네온 레드)
    this.sprite = scene.add.rectangle(x, y, 48, 48, Colors.ENEMY_RED);
    this.sprite.setStrokeStyle(3, Colors.OUTLINE);

    // 물리 활성화
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setBounce(0);
    this.body.setCollideWorldBounds(true);
    this.body.setImmovable(false); // 넉백 가능

    console.log(`🎯 Enemy 생성: (${x}, ${y})`);
  }

  /**
   * 피격 처리
   */
  hit(attackDirection: number): boolean {
    if (this.isHit) return false; // 이미 피격 중이면 무시

    this.health--;
    console.log(`💥 Enemy 피격! HP: ${this.health}`);

    // 플래시 효과 (흰색으로 깜빡임)
    this.playFlashEffect();

    // 넉백 효과
    this.applyKnockback(attackDirection);

    // HP 0이면 사망
    if (this.health <= 0) {
      this.destroy();
      return true; // 사망
    }

    return false; // 생존
  }

  /**
   * 플래시 효과 (흰색 깜빡임)
   */
  private playFlashEffect() {
    this.isHit = true;

    // 흰색으로 변경
    this.sprite.setFillStyle(Colors.UI_WHITE);

    // 0.1초 후 원래 색상 복구
    this.scene.time.delayedCall(100, () => {
      this.sprite.setFillStyle(Colors.ENEMY_RED);
      this.isHit = false;
    });
  }

  /**
   * 넉백 효과
   */
  private applyKnockback(direction: number) {
    const knockbackForce = 200;
    this.body.setVelocityX(direction * knockbackForce);
    this.body.setVelocityY(-100); // 살짝 위로
  }

  /**
   * 사망 처리
   */
  private destroy() {
    console.log('💀 Enemy 사망');

    // 사라지는 애니메이션
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scale: 0.5,
      duration: 200,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.sprite.destroy();
      },
    });
  }

  /**
   * HP 가져오기
   */
  getHealth(): number {
    return this.health;
  }

  /**
   * 스프라이트 가져오기
   */
  getSprite(): Phaser.GameObjects.Rectangle {
    return this.sprite;
  }
}
