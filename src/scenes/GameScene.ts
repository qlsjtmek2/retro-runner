import Phaser from 'phaser';
import { Colors } from '../utils/Colors';
import { Player } from '../entities/Player';

/**
 * GameScene - 메인 게임 장면
 * 캐릭터 이동, 전투, 적 처리를 담당
 */

export class GameScene extends Phaser.Scene {
  private player?: Player;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: { Z: Phaser.Input.Keyboard.Key };

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    console.log('🎬 GameScene 생성');

    // 배경 그라데이션 (간단한 버전)
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(Colors.BG_DARK, Colors.BG_DARK, Colors.BG_MID, Colors.BG_MID, 1);
    graphics.fillRect(0, 0, 1280, 720);

    // 플랫폼 생성
    this.createPlatforms();

    // 플레이어 생성 (Player 클래스 사용)
    this.createPlayer();

    // 입력 설정
    this.setupInput();

    // UI 텍스트
    this.add.text(16, 16, '쾌쾌쾌 v0.2 - 3단 콤보', {
      fontSize: '24px',
      color: '#00F0FF',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4,
    });

    this.add.text(16, 50, 'Arrow Keys: Move | Z: Attack Combo', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'monospace',
    });
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    // 바닥 플랫폼 (네온 스타일)
    const ground = this.add.rectangle(640, 680, 1280, 80, Colors.CHAR_SECONDARY);
    ground.setStrokeStyle(5, Colors.UI_WHITE);
    this.physics.add.existing(ground, true); // static body
    this.platforms.add(ground);

    // 중간 플랫폼들
    const platform1 = this.add.rectangle(400, 500, 300, 20, Colors.CHAR_PRIMARY);
    platform1.setStrokeStyle(3, Colors.UI_WHITE);
    this.physics.add.existing(platform1, true);
    this.platforms.add(platform1);

    const platform2 = this.add.rectangle(800, 400, 300, 20, Colors.CHAR_PRIMARY);
    platform2.setStrokeStyle(3, Colors.UI_WHITE);
    this.physics.add.existing(platform2, true);
    this.platforms.add(platform2);

    console.log('🏗️ 플랫폼 생성 완료');
  }

  private createPlayer() {
    // Player 클래스 사용
    this.player = new Player(this, 100, 500);

    // 플랫폼과 충돌 설정
    this.player.addCollider(this.platforms!);

    console.log('🎮 Player 클래스 인스턴스 생성 완료');
  }

  private setupInput() {
    // 방향키
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Z키 (공격)
    this.keys = {
      Z: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
    };

    console.log('⌨️ 입력 설정 완료 (방향키 + Z)');
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.cursors || !this.keys) return;

    // Player 업데이트 (이동 + 공격)
    this.player.update(delta, this.cursors, this.keys);
  }

  /**
   * HIT 텍스트 표시 (외부에서 호출 가능)
   */
  showHitText(x: number, y: number, comboCount: number = 1) {
    const text = this.add.text(x, y, 'HIT!', {
      fontSize: '48px',
      color: '#FFFF00', // 네온 노랑
      fontFamily: 'monospace',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    });

    // 중앙 정렬
    text.setOrigin(0.5, 0.5);

    // 애니메이션: 확대 + 페이드아웃
    this.tweens.add({
      targets: text,
      scale: 1.5,
      alpha: 0,
      y: y - 50, // 위로 떠오름
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        text.destroy();
      },
    });

    console.log(`💥 HIT 텍스트 표시: ${comboCount}단 콤보`);
  }
}
