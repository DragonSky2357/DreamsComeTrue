# Dreams Come True

꿈은 인류의 역사와 문화와 함께 다양하게 존재하였으나 대부분 글로만 전달되어 왔다.
잠에서 일어나서 꿈을 기억해도 시간이 지나면 점점 희미해져 잊혀져 간다.
그리하여 꿈의 내용을 이미지화 시켜 자신의 아카이브를 만드는것은 물론이고 다른 사람에게 공유하는 서비스를 제작하였다.

## 사용법
꿈의 제목과 내용, 태그를 적고 이미지 생성 버튼을 누르면 해당 내용을 이미지로 변환시켜 저장할 수 있다.

## 기능

- 꿈의 내용을 이미지로 생성이 가능하다.
- 웹 서비스를 통해 다른 사람들과 공유하며 다양한 사람들의 꿈을 검색 할 수 있다.
- 앱 서비스를 이용하여 자신의 꿈의 이미지를 이용하여 프린팅 할 수 있다.

## 사용기술
- React(Web)
- Flutter(App)
- Nestjs(Server)
- MySQL(DB)
- DALL E(이미지 생성)
- Papago(한글 번역)
- Docker
- EC2,RDS,CDN, S3, ECR, Route53, Aplify, Lambda

- **기술 의사 결정**
    - Lambda
        - 웹, 앱 서비스간 이미지 크기가 다르기에 Image Resize 작업 수행
    - S3
        - 이미지 저장소, 웹 이미지, 앱 이미지 버킷 분리
    - ECR
        - 컨테이너를 확장 또는 축소에 대한 필요성
        - 필요한 자원을 사용할 수 있어 비용 효율성 상승
    - **CDN**
        - S3에 이미지를 함께 등록 이후 캐싱 처리 필요성 파악
        - 이미지 경로가 노출되어 보안적 요소 필요
    - DALL E
        - 텍스트 기반 이미지 생성
        - Node API 공식 지원
    - **papago**
        - DALL E를 사용하기 위해 언어 번역 필요(한글 → 영어)
        - 번역 API 중 가장 자연 스럽게 번역 된다고 판단
      
## 트러블 슈팅
- AWS Lambda Image Resizing 시도중 계속 람다를 호출하는 문제 발생 이후 람다 사용 중지(약 10만건씩 상승) -> S3 이미지 버킷 재귀 호출로 파악 버킷 재설정
- DALL E 이미지 생성시 해당 이미지 URL 접근 시간 약 5분 이후 접근 불가 → 이미지 스트림을 다운로드 하여 S3 버킷에 저장
- 이미지 크기가 3MB로 동일 앱 서비스 이미지 리사이징 필요 파악 -> 이미지 리사이징처리 및 CDN을 사용하여 이미지 캐싱 처리 및 보안 강화
- 포스트 작성시 Image 업로드 대기 시간 발생 -> Hiding Latency 기능으로 구현

## 웹 서비스

### 메인 페이지
![메인 페이지](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/055a36d4-f6c4-443c-b7ee-5b6d988f10dc)

### 꿈 페이지 목록
![꿈 페이지 목록](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/ca4bcc16-0a44-46d7-998f-0d4eaabc92a6)

### 회원가입 페이지
![회원가입 페이지](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/32883b26-e332-4cb1-87ba-dee72a2a7d9b)

### 로그인 페이지
![로그인 페이지](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/d20413eb-3d76-4788-9ef1-3f093048213a)

### 포스트 생성 페이지
![포스트 생성 페이지](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/c29b5ff4-0d54-40d2-88c8-2b8e73816b78)

### 포스트 페이지
![포스트 페이지](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/d48d9292-b7c0-492e-a788-8faf836435d0)

### 랭킹 페이지
![랭킹 페이지](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/e833a540-3cf5-4318-8b72-f09d164b3928)

## 앱 서비스

### 홈 스크린 
![홈 스크린](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/f84cdc1a-2bc6-4476-ac61-97d5ca48b12c)

### 포스트 등록 스크린 
![포스트 등록 스크린](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/e2b63a1b-743a-4245-8f0a-eb3d1f49bfa6)

### 랭킹 스크린
![랭킹 스크린](htps://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/367dd55e-7469-4427-b27f-168adcab4748)

### 프로파일 스크린
![프로파일 스크린](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/681b5d17-cb82-4ec4-a16f-33d9a83a44d4)

### 검색 스크린
![검색 스크린](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/5849288d-786f-4993-b4e6-830d3e8bb394)

## 포토 프린팅 결과물
![image](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/7bac0a94-4588-4370-b204-6e92f5b6ab1f)

## ERD
![ERD](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/2f1a2c3c-ec31-4179-aa8a-c3ea1de56491)

## 시스템 아키텍처
![image](https://github.com/DragonSky2357/DreamsComeTrue/assets/38320524/1e37a018-59bd-4048-84f8-95856d3828f2)

## 뱃지

[![GitHub 라이선스](https://img.shields.io/github/license/사용자명/프로젝트명)](LICENSE)
