# 🎮 RETRO RUNNER

레트로 아케이드 스타일의 러너 게임

## 🕹️ 플레이하기

**Live Demo:** https://toy-ccf2wz2kt-huis-projects-01f1d25a.vercel.app

## 🎯 게임 특징

- 🌈 **Rainbow Neon 테마** - 80년대 아케이드 감성
- 💨 **더블점프 시스템** - 최대 2번까지 점프 가능
- ⚡ **빠른 하강** - 아래 키로 빠르게 낙하
- 🎨 **Squash & Stretch** - 생동감 있는 애니메이션
- ✨ **파티클 효과** - 착지, 충돌 시 파티클
- 📈 **난이도 상승** - 시간이 지날수록 속도와 생성 빈도 증가
- 🔥 **3가지 장애물 높이** - Low, Medium, High

## 🎮 조작 방법

| 키 | 동작 |
|---|---|
| `←` | 왼쪽 이동 |
| `→` | 오른쪽 이동 |
| `↑` | 점프 (공중에서 한 번 더 가능) |
| `↓` | 빠른 하강 (공중에서만) |
| `SPACE` | 게임 오버 후 재시작 |

## 🛠️ 기술 스택

- **게임 엔진:** Phaser 3.80
- **언어:** TypeScript
- **빌드:** Vite
- **배포:** Vercel

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 📦 프로젝트 구조

```
src/
├── config.ts           # 게임 설정 (색상, 속도, 난이도 등)
├── main.ts            # 게임 초기화
├── scenes/
│   └── GameScene.ts   # 메인 게임 씬
└── entities/
    ├── Player.ts      # 플레이어 (이동, 점프, 애니메이션)
    └── Obstacle.ts    # 장애물 (3가지 높이)
```

## 🎨 디자인

- **배경:** Deep Purple (#0f0f23)
- **플레이어:** Neon Yellow (#FFFF00)
- **장애물:** Neon Purple (#A855F7)
- **바닥:** Neon Orange (#FF8800)
- **UI:** Cyan (#00ffff)
- **파티클:** Neon Green (#00FF88)

## 📝 라이선스

MIT License
