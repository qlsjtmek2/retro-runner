import Phaser from 'phaser';
import { GameConfig } from '../config';
import { Player } from '../entities/Player';
import { Obstacle } from '../entities/Obstacle';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private obstacles: Obstacle[] = [];
  private ground!: Phaser.GameObjects.Rectangle;

  // 게임 상태
  private gameOver: boolean = false;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;

  // 난이도 관련
  private obstacleSpeed: number = GameConfig.OBSTACLE.SPEED;
  private spawnInterval: number = GameConfig.OBSTACLE.SPAWN_INTERVAL;
  private lastSpawnTime: number = 0;
  private difficultyTimer: number = 0;

  // UI
  private gameOverText?: Phaser.GameObjects.Text;
  private restartText?: Phaser.GameObjects.Text;

  // Particle Emitter
  private landingParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private collisionParticles!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // 바닥 생성 (Retro Yellow)
    const groundHeight = 20;
    const groundY = GameConfig.HEIGHT - groundHeight / 2;

    this.ground = this.add.rectangle(
      GameConfig.WIDTH / 2,
      groundY,
      GameConfig.WIDTH,
      groundHeight,
      GameConfig.COLORS.GROUND
    );
    this.physics.add.existing(this.ground, true); // static body

    // 파티클 텍스처 생성
    this.createParticleTexture();

    // 파티클 시스템 설정
    this.landingParticles = this.add.particles(0, 0, 'particle', {
      speed: { min: 50, max: 150 },
      angle: { min: -120, max: -60 },
      scale: { start: 1, end: 0 },
      lifespan: 300,
      gravityY: 500,
      tint: GameConfig.COLORS.PARTICLE,
    });
    this.landingParticles.stop();

    this.collisionParticles = this.add.particles(0, 0, 'particle', {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      lifespan: 500,
      gravityY: 300,
      tint: GameConfig.COLORS.FLASH,
    });
    this.collisionParticles.stop();

    // 플레이어 생성 (바닥 위)
    const playerY = groundY - groundHeight / 2 - GameConfig.PLAYER.HEIGHT / 2;
    this.player = new Player(this, 100, playerY);

    // 파티클 주입
    this.player.landingParticles = this.landingParticles;

    // 플레이어와 바닥 충돌 설정
    this.physics.add.collider(this.player.sprite, this.ground);

    // 점수 UI (Retro 스타일)
    this.scoreText = this.add.text(16, 16, 'SCORE: 0', {
      fontSize: '32px',
      color: '#00ffff',
      fontFamily: 'monospace',
      stroke: '#000033',
      strokeThickness: 4,
    });

    // 게임 상태 초기화
    this.gameOver = false;
    this.score = 0;
    this.obstacleSpeed = GameConfig.OBSTACLE.SPEED;
    this.spawnInterval = GameConfig.OBSTACLE.SPAWN_INTERVAL;
    this.difficultyTimer = 0;
  }

  private createParticleTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle', 8, 8);
    graphics.destroy();
  }


  update(time: number, delta: number): void {
    if (this.gameOver) {
      // Space로 재시작
      if (this.input.keyboard!.addKey('SPACE').isDown) {
        this.restartGame();
      }
      return;
    }

    // 플레이어 업데이트
    this.player.update();

    // 장애물 생성
    this.spawnObstacle(time);

    // 장애물 업데이트 및 정리
    this.updateObstacles();

    // 충돌 체크
    this.checkCollisions();

    // 점수 업데이트 (생존 시간)
    this.score += (GameConfig.SCORE.SURVIVAL_RATE * delta) / 1000;
    this.scoreText.setText(`SCORE: ${Math.floor(this.score)}`);

    // 난이도 증가
    this.updateDifficulty(delta);
  }

  private spawnObstacle(time: number): void {
    if (time - this.lastSpawnTime > this.spawnInterval) {
      const groundHeight = 20;

      // 랜덤하게 장애물 타입 선택 (low: 30%, medium: 40%, high: 30%)
      const rand = Math.random();
      let type: 'low' | 'medium' | 'high';
      if (rand < 0.3) {
        type = 'low';
      } else if (rand < 0.7) {
        type = 'medium';
      } else {
        type = 'high';
      }

      const obstacle = new Obstacle(this, GameConfig.WIDTH + 50, 0, type);

      // 장애물 높이에 맞춰 Y 위치 조정
      const obstacleY =
        GameConfig.HEIGHT -
        groundHeight -
        obstacle.getHeight() / 2;
      obstacle.sprite.y = obstacleY;

      obstacle.setVelocity(this.obstacleSpeed);

      this.obstacles.push(obstacle);
      this.lastSpawnTime = time;
    }
  }

  private updateObstacles(): void {
    // 화면 밖으로 나간 장애물 제거 및 보너스 점수
    this.obstacles = this.obstacles.filter((obstacle) => {
      // 플레이어를 지나쳤는지 체크
      if (
        !obstacle.passed &&
        obstacle.sprite.x + GameConfig.OBSTACLE.WIDTH <
          this.player.sprite.x - GameConfig.PLAYER.WIDTH / 2
      ) {
        obstacle.passed = true;
        this.score += GameConfig.SCORE.OBSTACLE_BONUS;

        // Score Pop-up 효과
        this.showScorePopup(
          obstacle.sprite.x,
          obstacle.sprite.y,
          `+${GameConfig.SCORE.OBSTACLE_BONUS}`
        );
      }

      // 화면 밖으로 나간 장애물 제거
      if (obstacle.isOffScreen()) {
        obstacle.destroy();
        return false;
      }
      return true;
    });
  }

  private showScorePopup(x: number, y: number, text: string): void {
    const popup = this.add.text(x, y, text, {
      fontSize: '24px',
      color: '#00ff00',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4,
    });

    this.tweens.add({
      targets: popup,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onComplete: () => popup.destroy(),
    });
  }

  private checkCollisions(): void {
    for (const obstacle of this.obstacles) {
      if (
        this.physics.overlap(this.player.sprite, obstacle.sprite)
      ) {
        this.triggerGameOver(obstacle);
        break;
      }
    }
  }

  private updateDifficulty(delta: number): void {
    this.difficultyTimer += delta;

    if (this.difficultyTimer >= GameConfig.DIFFICULTY.INCREASE_INTERVAL) {
      // 속도 증가
      this.obstacleSpeed *= GameConfig.DIFFICULTY.SPEED_MULTIPLIER;

      // 생성 간격 감소 (더 자주 생성)
      this.spawnInterval *= GameConfig.DIFFICULTY.SPAWN_MULTIPLIER;

      this.difficultyTimer = 0;

      console.log(
        `Difficulty UP! Speed: ${this.obstacleSpeed.toFixed(
          0
        )}, Interval: ${this.spawnInterval.toFixed(0)}ms`
      );
    }
  }

  private triggerGameOver(_obstacle: Obstacle): void {
    this.gameOver = true;

    // Camera Shake
    this.cameras.main.shake(
      GameConfig.CAMERA.SHAKE_DURATION,
      GameConfig.CAMERA.SHAKE_INTENSITY
    );

    // Collision Particles
    this.collisionParticles.emitParticleAt(
      this.player.sprite.x,
      this.player.sprite.y,
      20
    );

    // 플레이어 즉시 사라지기
    this.player.sprite.setVisible(false);

    // 모든 장애물 정지
    this.obstacles.forEach((obs) => {
      obs.sprite.setVelocityX(0);
    });

    // 게임 오버 UI (Retro 스타일)
    this.time.delayedCall(500, () => {
      this.gameOverText = this.add
        .text(GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2 - 80, 'GAME OVER', {
          fontSize: '72px',
          color: '#ff00ff',
          fontFamily: 'monospace',
          stroke: '#000033',
          strokeThickness: 8,
        })
        .setOrigin(0.5);

      // 깜빡이는 효과
      this.tweens.add({
        targets: this.gameOverText,
        alpha: 0.3,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });

      this.restartText = this.add
        .text(
          GameConfig.WIDTH / 2,
          GameConfig.HEIGHT / 2 + 20,
          `FINAL SCORE: ${Math.floor(this.score)}\n\nPRESS SPACE TO RESTART`,
          {
            fontSize: '24px',
            color: '#00ffff',
            fontFamily: 'monospace',
            align: 'center',
            stroke: '#000033',
            strokeThickness: 4,
          }
        )
        .setOrigin(0.5);
    });
  }

  private restartGame(): void {
    // UI 정리
    this.gameOverText?.destroy();
    this.restartText?.destroy();

    // 장애물 정리
    this.obstacles.forEach((obstacle) => obstacle.destroy());
    this.obstacles = [];

    // 씬 재시작
    this.scene.restart();
  }
}
