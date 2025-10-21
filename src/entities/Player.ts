import Phaser from 'phaser';
import { GameConfig } from '../config';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private scene: Phaser.Scene;

  // Trail 효과용
  private lastTrailTime: number = 0;

  // 더블점프 관리
  private jumpCount: number = 0;
  private hasReleasedJump: boolean = true; // 점프 키를 뗐는지 추적

  // 파티클 (외부에서 주입)
  public landingParticles?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // 플레이어 스프라이트 생성
    this.sprite = scene.physics.add.sprite(x, y, '');

    // 플레이어 텍스처 생성 (하나만 사용)
    if (!scene.textures.exists('player')) {
      const graphics = scene.add.graphics();
      graphics.fillStyle(GameConfig.COLORS.PLAYER, 1);
      graphics.fillRect(0, 0, GameConfig.PLAYER.WIDTH, GameConfig.PLAYER.HEIGHT);
      graphics.generateTexture('player', GameConfig.PLAYER.WIDTH, GameConfig.PLAYER.HEIGHT);
      graphics.destroy();
    }

    this.sprite.setTexture('player');

    // 물리 바디 설정
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body!.setSize(GameConfig.PLAYER.WIDTH, GameConfig.PLAYER.HEIGHT);

    // 키보드 입력 설정
    this.cursors = scene.input.keyboard!.createCursorKeys();
  }

  update(): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const isOnGround = body.touching.down;

    // 착지 시 점프 카운트 리셋
    if (isOnGround) {
      this.jumpCount = 0;
    }

    // 좌우 이동
    if (this.cursors.left.isDown) {
      this.sprite.setVelocityX(-GameConfig.PLAYER.SPEED);
    } else if (this.cursors.right.isDown) {
      this.sprite.setVelocityX(GameConfig.PLAYER.SPEED);
    } else {
      this.sprite.setVelocityX(0);
    }

    // 더블점프 시스템
    if (this.cursors.up.isDown && this.hasReleasedJump) {
      if (this.jumpCount < GameConfig.PLAYER.MAX_JUMPS) {
        this.sprite.setVelocityY(GameConfig.PLAYER.JUMP_VELOCITY);
        this.applyStretch(); // 점프 시 Stretch
        this.jumpCount++;
        this.hasReleasedJump = false; // 키를 뗄 때까지 더 이상 점프 불가
      }
    }

    // 점프 키를 뗐을 때 플래그 리셋
    if (!this.cursors.up.isDown) {
      this.hasReleasedJump = true;
    }

    // 빠른 하강 (공중에 있을 때만)
    if (this.cursors.down.isDown && !isOnGround) {
      this.sprite.setVelocityY(GameConfig.PLAYER.FAST_FALL_VELOCITY);
    }

    // 착지 감지 (Squash 효과)
    // if (isOnGround && !this.wasOnGround) {
    //   this.applySquash();
    // }

    // Trail 효과
    this.updateTrail();
  }

  // private applySquash(): void {
  //   // 착지 파티클 발사
  //   if (this.landingParticles) {
  //     const body = this.sprite.body as Phaser.Physics.Arcade.Body;
  //     // 일정 속도 이상으로 떨어졌을 때만 파티클 표시
  //     if (Math.abs(body.velocity.y) > 100) {
  //       this.landingParticles.emitParticleAt(
  //         this.sprite.x,
  //         this.sprite.y + GameConfig.PLAYER.HEIGHT / 2,
  //         5
  //       );
  //     }
  //   }

  //   // 기존 scale 애니메이션 중단
  //   this.scene.tweens.killTweensOf(this.sprite);

  //   // 착지 시: 세로 압축, 가로 확장 → 원래대로 복귀
  //   this.scene.tweens.add({
  //     targets: this.sprite,
  //     scaleX: GameConfig.ANIMATION.SQUASH_SCALE_X,
  //     scaleY: GameConfig.ANIMATION.SQUASH_SCALE_Y,
  //     duration: GameConfig.ANIMATION.SQUASH_DURATION,
  //     ease: 'Back.easeOut',
  //     onComplete: () => {
  //       // 원래 크기로 복귀
  //       this.scene.tweens.add({
  //         targets: this.sprite,
  //         scaleX: 1,
  //         scaleY: 1,
  //         duration: GameConfig.ANIMATION.SQUASH_DURATION,
  //         ease: 'Quad.easeOut',
  //       });
  //     },
  //   });
  // }

  private applyStretch(): void {
    // 기존 scale 애니메이션 중단
    this.scene.tweens.killTweensOf(this.sprite);

    // 점프 시: 세로 확장, 가로 압축 → 원래대로 복귀
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: GameConfig.ANIMATION.STRETCH_SCALE_X,
      scaleY: GameConfig.ANIMATION.STRETCH_SCALE_Y,
      duration: GameConfig.ANIMATION.SQUASH_DURATION,
      ease: 'Back.easeOut',
      onComplete: () => {
        // 원래 크기로 복귀
        this.scene.tweens.add({
          targets: this.sprite,
          scaleX: 1,
          scaleY: 1,
          duration: GameConfig.ANIMATION.SQUASH_DURATION,
          ease: 'Quad.easeOut',
        });
      },
    });
  }

  private updateTrail(): void {
    const now = Date.now();

    // 50ms마다 잔상 생성
    if (now - this.lastTrailTime > 50 && Math.abs(this.sprite.body!.velocity.x) > 50) {
      const trail = this.scene.add.sprite(
        this.sprite.x,
        this.sprite.y,
        'player'
      );

      trail.setScale(this.sprite.scaleX, this.sprite.scaleY);
      trail.setAlpha(GameConfig.ANIMATION.TRAIL_ALPHA);
      trail.setTint(GameConfig.COLORS.PLAYER);

      // Fade out
      this.scene.tweens.add({
        targets: trail,
        alpha: 0,
        duration: GameConfig.ANIMATION.TRAIL_LIFETIME,
        onComplete: () => trail.destroy(),
      });

      this.lastTrailTime = now;
    }
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
