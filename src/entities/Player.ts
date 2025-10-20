import Phaser from 'phaser';
import { Colors } from '../utils/Colors';

/**
 * 공격 상태
 */
export enum AttackState {
  IDLE = 'idle',
  ATTACK_1 = 'attack1',
  ATTACK_2 = 'attack2',
  ATTACK_3 = 'attack3',
}

/**
 * Player 클래스
 * 캐릭터 이동, 공격, 콤보 시스템을 담당
 */
export class Player {
  public sprite: Phaser.GameObjects.Rectangle;
  private scene: Phaser.Scene;
  private body: Phaser.Physics.Arcade.Body;

  // 이동 관련
  private speed: number = 300;
  private jumpSpeed: number = -500;

  // 공격 관련
  private attackState: AttackState = AttackState.IDLE;
  private comboTimer: number = 0;
  private comboWindow: number = 500; // 0.5초 콤보 윈도우
  private attackDurations: Map<AttackState, number> = new Map([
    [AttackState.ATTACK_1, 300], // 0.3초
    [AttackState.ATTACK_2, 300], // 0.3초
    [AttackState.ATTACK_3, 400], // 0.4초
  ]);
  private attackTimer: number = 0;

  // 히트박스
  private hitbox?: Phaser.GameObjects.Rectangle;

  // 이펙트
  private afterImages: Phaser.GameObjects.Rectangle[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // 스프라이트 생성 (임시로 Rectangle)
    this.sprite = scene.add.rectangle(x, y, 64, 64, Colors.CHAR_PRIMARY);
    this.sprite.setStrokeStyle(5, Colors.OUTLINE);

    // 물리 활성화
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setBounce(0);
    this.body.setCollideWorldBounds(true);

    console.log('🎮 Player 클래스 생성 완료');
  }

  /**
   * 매 프레임 업데이트
   */
  update(delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys, keys: { Z: Phaser.Input.Keyboard.Key }) {
    // 공격 타이머 업데이트
    if (this.attackState !== AttackState.IDLE) {
      this.attackTimer -= delta;
      if (this.attackTimer <= 0) {
        // 공격 종료
        this.endAttack();
      }
    }

    // 콤보 타이머 업데이트
    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        // 콤보 리셋
        this.resetCombo();
      }
    }

    // 공격 중이 아닐 때만 이동 가능
    if (this.attackState === AttackState.IDLE) {
      this.handleMovement(cursors);
    } else {
      // 공격 중에는 이동 정지
      this.body.setVelocityX(0);
    }

    // Z키 공격
    if (Phaser.Input.Keyboard.JustDown(keys.Z)) {
      this.handleAttack();
    }
  }

  /**
   * 이동 처리
   */
  private handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // 좌우 이동
    if (cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
      this.sprite.setScale(-1, 1); // 좌우 반전
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
      this.sprite.setScale(1, 1);
    } else {
      this.body.setVelocityX(0);
    }

    // 점프
    if (cursors.up.isDown && this.body.touching.down) {
      this.body.setVelocityY(this.jumpSpeed);
    }
  }

  /**
   * 공격 처리
   */
  private handleAttack() {
    // 공격 중이면 콤보 체크
    if (this.attackState === AttackState.ATTACK_1 && this.comboTimer > 0) {
      this.startAttack(AttackState.ATTACK_2);
    } else if (this.attackState === AttackState.ATTACK_2 && this.comboTimer > 0) {
      this.startAttack(AttackState.ATTACK_3);
    } else if (this.attackState === AttackState.IDLE) {
      // 새 공격 시작
      this.startAttack(AttackState.ATTACK_1);
    }
  }

  /**
   * 공격 시작
   */
  private startAttack(state: AttackState) {
    console.log(`⚔️ 공격 시작: ${state}`);

    this.attackState = state;
    this.attackTimer = this.attackDurations.get(state) || 300;
    this.comboTimer = this.comboWindow;

    // 공격 애니메이션 (시각적 피드백)
    this.playAttackAnimation(state);

    // 히트박스 생성
    this.createHitbox(state);
  }

  /**
   * 공격 애니메이션 (임시 시각 효과)
   */
  private playAttackAnimation(state: AttackState) {
    const originalScale = this.sprite.scaleX;

    // 각 공격별 시각 효과
    switch (state) {
      case AttackState.ATTACK_1:
        // 1타: 빠른 찌르기 (앞으로 확대)
        this.sprite.setScale(originalScale * 1.3, 1.1);
        this.scene.tweens.add({
          targets: this.sprite,
          scaleX: originalScale,
          scaleY: 1,
          duration: 150,
          ease: 'Back.easeOut',
        });
        // 잔상 효과
        this.createAfterImage();
        break;

      case AttackState.ATTACK_2:
        // 2타: 회전 베기 (회전 효과)
        this.scene.tweens.add({
          targets: this.sprite,
          angle: 360,
          duration: 300,
          ease: 'Cubic.easeOut',
          onComplete: () => {
            this.sprite.setAngle(0);
          },
        });
        // 여러 잔상
        for (let i = 0; i < 3; i++) {
          this.scene.time.delayedCall(i * 100, () => this.createAfterImage());
        }
        break;

      case AttackState.ATTACK_3:
        // 3타: 강공격 (크게 확대 + 깜빡임)
        this.sprite.setScale(originalScale * 1.5, 1.5);
        this.sprite.setFillStyle(Colors.UI_WHITE); // 흰색 플래시
        this.scene.tweens.add({
          targets: this.sprite,
          scaleX: originalScale,
          scaleY: 1,
          duration: 200,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.sprite.setFillStyle(Colors.CHAR_PRIMARY); // 원래 색상 복구
          },
        });
        // 많은 잔상
        for (let i = 0; i < 5; i++) {
          this.scene.time.delayedCall(i * 80, () => this.createAfterImage());
        }
        break;
    }
  }

  /**
   * 잔상 생성 (Neon Comic 이펙트)
   */
  private createAfterImage() {
    const afterImage = this.scene.add.rectangle(
      this.sprite.x,
      this.sprite.y,
      64,
      64,
      Colors.UI_WHITE,
      0.5 // 50% 투명도
    );
    afterImage.setScale(this.sprite.scaleX, this.sprite.scaleY);
    afterImage.setAngle(this.sprite.angle);

    this.afterImages.push(afterImage);

    // 0.2초 후 페이드 아웃
    this.scene.tweens.add({
      targets: afterImage,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        afterImage.destroy();
        const index = this.afterImages.indexOf(afterImage);
        if (index > -1) {
          this.afterImages.splice(index, 1);
        }
      },
    });
  }

  /**
   * 히트박스 생성
   */
  private createHitbox(state: AttackState) {
    // 기존 히트박스 제거
    if (this.hitbox) {
      this.hitbox.destroy();
    }

    // 방향에 따른 히트박스 위치
    const direction = this.sprite.scaleX > 0 ? 1 : -1;
    const offsetX = direction * 50;

    // 히트박스 크기 (공격별로 다름)
    let width = 60;
    let height = 60;
    if (state === AttackState.ATTACK_3) {
      width = 80;
      height = 80;
    }

    this.hitbox = this.scene.add.rectangle(
      this.sprite.x + offsetX,
      this.sprite.y,
      width,
      height,
      Colors.ENEMY_RED,
      0.3 // 디버그용 반투명
    );

    this.scene.physics.add.existing(this.hitbox);
    const hitboxBody = this.hitbox.body as Phaser.Physics.Arcade.Body;
    hitboxBody.setAllowGravity(false);

    console.log(`💥 히트박스 생성: ${state}`);

    // 공격 지속 시간 후 히트박스 제거
    const duration = this.attackDurations.get(state) || 300;
    this.scene.time.delayedCall(duration, () => {
      if (this.hitbox) {
        this.hitbox.destroy();
        this.hitbox = undefined;
      }
    });
  }

  /**
   * 공격 종료
   */
  private endAttack() {
    console.log(`✅ 공격 종료: ${this.attackState}`);
    this.attackState = AttackState.IDLE;
    this.attackTimer = 0;
  }

  /**
   * 콤보 리셋
   */
  private resetCombo() {
    console.log('🔄 콤보 리셋');
    this.comboTimer = 0;
  }

  /**
   * 플랫폼과 충돌 설정
   */
  addCollider(platforms: Phaser.Physics.Arcade.StaticGroup) {
    this.scene.physics.add.collider(this.sprite, platforms);
  }

  /**
   * 히트박스 가져오기 (외부에서 충돌 감지용)
   */
  getHitbox(): Phaser.GameObjects.Rectangle | undefined {
    return this.hitbox;
  }

  /**
   * 현재 공격 상태 가져오기
   */
  getAttackState(): AttackState {
    return this.attackState;
  }
}
