# 🎵 **뮤직 플레이어 웹 애플리케이션**

YouTube에서 다양한 음악 장르를 탐색하고 재생할 수 있는 반응형 뮤직 플레이어 웹 애플리케이션입니다. <br/>
사용자는 즐겨찾기를 저장하고, 재생 제어 옵션을 사용할 수 있습니다. 
<br/>

현재, API 호출과 할당량 조절에 힘쓰고 있습니다..!😢

📦 **프로젝트 구조**
```bash
├── **.gitignore**
├── **README.md**
├── **package-lock.json**
├── **package.json**
├── **public**
│   ├── **favicon.ico**          # 웹사이트 아이콘
│   ├── **index.html**           # 메인 HTML 파일
│   ├── **logo192.png**          # 192x192 로고 이미지
│   ├── **logo512.png**          # 512x512 로고 이미지
│   ├── **manifest.json**       
│   └── **robots.txt**          
├── **src**
│   ├── **App.css**             
│   ├── **App.jsx**              
│   ├── **App.test.js**          
│   ├── **components**           # 재사용 가능한 컴포넌트 폴더
│   │   ├── **HomeScreen.jsx**    # 홈 화면 컴포넌트
│   │   └── **MainContent.jsx**   # 메인 콘텐츠 컴포넌트
│   ├── **index.css**            # 전역 스타일 파일
│   ├── **index.js**             
│   ├── **logo.svg**             
│   ├── **pages**                # 페이지별 컴포넌트 폴더
│   │   └── **Main.jsx**          # 메인 페이지 컴포넌트
│   ├── **reportWebVitals.js**    
│   ├── **setupTests.js**       
│   └── **style**                # 스타일링 파일 폴더
│       ├── **HomeScreen.css**    # 홈 화면 스타일 파일
│       ├── **MainContent.css**   # 메인 콘텐츠 스타일 파일
│       └── **main.css**          # 공통 스타일 파일
```


## 🚀 **주요 기능**

- 🎶 **다양한 음악 장르**: 어쿠스틱, 인디, 지브리, 로파이, 발라드, 팝, 힙합, R&B, K-POP, Phonk, 광고 없는 음악 등 다양한 장르의 음악을 선택하여 재생할 수 있습니다.
- ⭐ **즐겨찾기**: 마음에 드는 음악을 즐겨찾기에 추가하고 나중에 쉽게 재생할 수 있습니다.
- 🔄 **동영상 캐싱**: API 호출을 최소화하기 위해 최근 검색된 동영상 데이터를 로컬에 캐싱합니다.
- 🔊 **볼륨 및 음소거 제어**: 볼륨 슬라이더와 음소거 기능을 제공합니다.
- ⏭️ **다음 곡 자동 재생**: 10초 이상 재생이 진행되지 않으면 자동으로 다음 곡으로 넘어갑니다.
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크탑에서도 최적화된 디자인으로 사용할 수 있습니다.

## 🛠️ **주요 기술 스택**
- **Material-UI**: 애플리케이션의 스타일링과 UI 요소를 처리하기 위한 React 컴포넌트 라이브러리
- **React Query**: API 데이터 페칭 및 캐싱 관리
- **Axios**: API 호출을 위한 HTTP 클라이언트
- **ReactPlayer**: YouTube 동영상 재생을 위한 미디어 플레이어
- **LocalStorage**: 동영상 캐싱을 위한 브라우저 저장소

## 🖥️ **화면 미리보기**

- **홈 화면**: 사용자는 다양한 장르의 음악을 선택할 수 있습니다.
![장르 선택](https://github.com/user-attachments/assets/beb73991-3f7a-46ba-b58a-2b2dfd4e64f9)

- **플레이어 화면**: 선택한 음악을 재생하며, 재생 제어(재생, 일시정지, 다음 곡, 음소거) 및 볼륨 조절이 가능합니다.
- ![진입 화면](https://github.com/user-attachments/assets/43295f87-21f1-47cd-acb6-8466fd90f020)
![음악 재생 시 플레이어 생성](https://github.com/user-attachments/assets/8709e0f2-4c8c-4cf7-8238-7ad6bdc509af)
