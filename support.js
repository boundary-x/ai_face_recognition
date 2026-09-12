/* Face-specific help; walkthroughs do not operate recognition or Bluetooth. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const support = $('support-card');
  support.innerHTML = `
    <summary><span><strong>사용 가이드 및 지원</strong><small>사용법 · 예제 코드 · 문제 해결</small></span><span class="support-chevron" aria-hidden="true">⌄</span></summary>
    <div class="support-content">
      <p class="support-intro">얼굴의 위치·회전·표정을 데이터로 활용해보세요.</p>
      <div class="support-actions"><button type="button" data-tour="all" class="support-primary">사용법 둘러보기 <span aria-hidden="true">→</span></button></div>
      <details class="support-section" id="help-examples"><summary>마이크로비트 예제 코드</summary><div class="support-answer example-codes">
        <div class="example-code"><a href="https://makecode.microbit.org/S49771-77509-50114-72682" target="_blank" rel="noopener noreferrer">블루투스 이름 확인 코드 ↗</a><p>연결할 마이크로비트의 장치 이름을 확인합니다. 마이크로비트의 LED 매트릭스에 출력되는 이름(알파벳 소문자 5자리)을 확인한 뒤 아래 프로젝트 코드를 다운로드하세요.</p></div>
        <div class="example-code"><a id="project-example-link" href="https://makecode.microbit.org/S62535-48438-66844-41809" target="_blank" rel="noopener noreferrer">프로젝트 예제 · AI 포니봇 얼굴인식 제어 ↗</a><p>소개 페이지의 AI 포니봇 연동 예제입니다. 얼굴 움직임을 기기 동작과 연결하며, 사용하는 제품과 코드의 데이터 처리 방식을 확인하세요.</p></div>
        <p class="support-caption">현재 앱은 얼굴 미감지 시 Visible=0을 보냅니다. Visible=0 또는 stop 수신 시 기기를 정지하는 처리가 필요합니다. 다운로드하면 이전 코드가 교체됩니다.</p>
      </div></details>
      <details class="support-section" id="help-troubleshooting"><summary>문제 해결 <span class="support-meta">증상별 안내</span></summary><div class="support-answer support-faq">
        <details id="help-camera"><summary>카메라가 켜지지 않아요</summary><p>사이트의 카메라 권한을 허용하고 다른 앱이 카메라를 사용 중인지 확인하세요. 인터넷 연결을 확인하고 모델 로딩이 완료될 때까지 기다리세요.</p></details>
        <details><summary>얼굴이 감지되지 않아요</summary><p>‘얼굴 인식 시작’을 누른 뒤 밝은 곳에서 얼굴 전체를 정면으로 비춰주세요. 한 번에 얼굴 하나를 추적합니다. Visible이 1이면 감지된 상태입니다.</p></details>
        <details id="help-connection"><summary>블루투스가 연결되지 않거나 기기가 움직이지 않아요</summary><p>마이크로비트 전원과 예제 코드 다운로드 여부를 확인하세요. MakeCode 프로젝트의 블루투스 설정과 브라우저의 Web Bluetooth 지원 여부를 확인하고, 다른 앱과 연결되어 있다면 해제하세요.</p><p>이 앱은 ID1 같은 분류 이름이 아닌 19자리 숫자열을 보냅니다. 예제가 같은 형식으로 데이터를 읽는지 확인하세요. 전송 데이터 표시만으로 수신 성공을 확인할 수는 없으므로 연결 상태와 기기의 반응도 확인하세요.</p></details>
        <details><summary>얼굴이 사라졌는데 위치 값이 남아 있어요</summary><p>얼굴이 없으면 Visible이 0이 되고 Mouth와 Smile이 0으로 바뀝니다. 다른 값은 이전 값이 남을 수 있으므로 먼저 Visible을 확인하세요. 현재 얼굴 미감지 신호는 stop이 아닌 Visible=0입니다.</p></details>
        <details><summary>19자리 데이터를 어떻게 읽나요?</summary><p>숫자열은 X·Y·Z·Yaw·Pitch·Mouth·L-Eye·R-Eye를 각각 2자리, Roll·Smile·Visible을 각각 1자리로 이어 붙입니다. 앞의 0도 유지해서 문자열로 읽으세요.</p><p><code>XX YY ZZ Ya Pi Mo Le Ri R S V</code></p><p>X부터 R-Eye까지는 0~99, Roll과 Smile은 0~9, Visible은 0 또는 1입니다. Z는 얼굴 크기로 추정한 상대적인 가까움이며 실제 거리 단위가 아닙니다.</p></details>
        <details><summary>인식 중지와 얼굴 미감지는 어떻게 다른가요?</summary><p>‘인식 중지’를 누르면 추적을 멈추고 연결된 기기에 stop 전송을 시도합니다. 얼굴만 사라진 경우에는 추적을 계속하면서 Visible=0인 숫자 데이터를 보냅니다. 기기 코드에서도 두 경우를 처리하세요.</p></details>
      </div></details>
      <details class="support-section" id="help-updates"><summary>업데이트 노트 <span class="support-meta">최근 변경</span></summary><div class="support-answer"><p class="support-release">사용 가이드 및 지원 추가</p><ul><li>얼굴 인식·기기 연결·데이터 읽기를 하나의 화면 안내로 구성</li><li>구간 이동, 연결 건너뛰기, 모바일 하이라이트 안내</li><li>장치 이름 확인 및 AI 포니봇 예제 링크 제공</li><li>현재 코드에 맞춘 Visible과 stop 설명</li></ul></div></details>
      <a class="support-original" href="https://boundaryx.io/ai/?bmode=view&idx=169414934" target="_blank" rel="noopener noreferrer">개념 설명 · 프로젝트 아이디어 보기 ↗</a>
    </div>`;
  const recognition = [
    ['#p5-container','얼굴을 카메라에 비춰주세요','카메라 권한을 허용하고 모델 로딩을 기다리세요. 이 앱은 얼굴의 움직임을 추적하며, 별도의 ID 학습은 필요하지 않습니다.'],
    ['#camera-control-buttons','촬영할 카메라를 선택하세요','전후방 전환으로 사용할 카메라를 선택하세요. 얼굴 전체가 화면 안에 들어오도록 위치를 맞춰주세요.'],
    ['#object-control-buttons','얼굴 인식을 시작하세요','모델 로딩 후 ‘얼굴 인식 시작’을 누르세요. 기기가 연결되지 않았다는 알림을 닫아도 화면에서 얼굴 움직임을 확인할 수 있습니다.'],
    ['#val-vis','얼굴 감지 상태를 확인하세요','Visible이 1이면 얼굴이 감지된 상태, 0이면 감지되지 않은 상태입니다. 위치나 표정 값을 사용하기 전에 이 값을 확인하세요.']
  ];
  const device = [
    ['#project-example-link','프로젝트 예제를 준비하세요','장치 이름 확인 코드로 LED의 알파벳 소문자 5자리를 확인하세요. 그다음 사용하는 제품에 맞게 AI 포니봇 예제를 준비해 다운로드하세요.'],
    ['#bluetooth-control-buttons','마이크로비트를 연결하세요','‘기기 연결’을 누르고 내 마이크로비트를 선택하세요. 예제의 블루투스 페어링 설정을 확인하고 다른 앱과의 연결은 해제하세요.'],
    ['#dataDisplay','전송할 데이터를 확인하세요','연결된 상태에서 인식을 시작하면 최대 초당 10회 숫자 데이터를 보냅니다. 이 표시는 전송할 값이며, 수신 성공 여부는 연결 상태와 기기의 동작도 함께 확인하세요.'],
    ['#object-control-buttons','인식을 마치면 중지하세요','‘인식 중지’를 누르면 stop 전송을 시도합니다. 얼굴 미감지 시에는 Visible=0이 전송되므로 기기 코드에서 두 경우를 모두 처리하세요.']
  ];
  const data = [
    ['#position-params','위치와 가까움을 읽으세요','X·Y는 얼굴 위치를 0~99로 나타냅니다. Z는 화면에서 얼굴이 클수록 커지는 상대값으로, 실제 거리(cm)가 아닙니다.'],
    ['#rotation-params','고개의 회전을 읽으세요','Yaw는 좌우 회전, Pitch는 위아래 각도이며 0~99입니다. Roll은 고개 기울기를 0~9로 나타냅니다. 실제 각도 단위는 아닙니다.'],
    ['#expression-params','입과 눈의 움직임을 읽으세요','Mouth는 입 벌림, L-Eye·R-Eye는 눈 열림 정도로 0~99입니다. Smile은 0~9입니다. 얼굴의 정면 방향과 조명에 따라 값이 달라질 수 있습니다.'],
    ['#dataDisplay','19자리 순서를 확인하세요','X·Y·Z·Yaw·Pitch·Mouth·L-Eye·R-Eye는 각각 2자리, Roll·Smile·Visible은 각각 1자리입니다. 앞의 0을 유지해 문자열로 읽으세요.']
  ];
  const allSteps = [...recognition, ...device, ...data];
  const chapters = [{label:'얼굴 인식',start:0},{label:'기기 연결',start:recognition.length},{label:'데이터 읽기',start:recognition.length+device.length}];
  const dialog = document.createElement('dialog');
  dialog.id = 'guide-dialog';
  dialog.setAttribute('aria-labelledby', 'guide-title');
  dialog.setAttribute('aria-describedby', 'guide-description');
  dialog.innerHTML = `<div id="guide-spotlight" aria-hidden="true"></div><section id="guide-panel"><div class="guide-topline"><span id="guide-progress"></span><button id="guide-close" type="button" aria-label="화면 안내 종료">닫기 ×</button></div><nav class="guide-chapters" aria-label="안내 구간">${chapters.map((chapter, i) => `<button type="button" data-chapter="${i}" aria-pressed="false">${chapter.label}</button>`).join('')}</nav><div aria-live="polite" aria-atomic="true"><h2 id="guide-title"></h2><p id="guide-description"></p></div><p class="guide-caption">화면 안내입니다. 닫은 뒤 직접 눌러보세요.</p><button id="guide-skip-device" type="button" hidden>기기 연결 건너뛰기 →</button><div class="guide-navigation"><button id="guide-prev" type="button">이전</button><button id="guide-next" type="button">다음</button></div></section>`;
  document.body.appendChild(dialog);
  let steps = [], index = 0, target = null, opener = null, originalScroll = 0, pendingFrame = 0;

  let examplesWereOpen = false;

  function openHelp(section) {
    support.open = true;
    if (section) {
      $('help-troubleshooting').open = true;
      $(section).open = true;
    }
    const heading = (section ? $(section) : support).querySelector('summary');
    heading.scrollIntoView({block: 'center', behavior: 'instant'});
    heading.focus({preventScroll: true});
  }
  document.querySelectorAll('[data-help]').forEach(button => button.addEventListener('click', () => openHelp(button.dataset.help || null)));

  function renderStep() {
    const [selector, title, description] = steps[index];
    if (selector === '#project-example-link') $('help-examples').open = true;
    target = document.querySelector(selector);
    const chapterIndex = index < chapters[1].start ? 0 : index < chapters[2].start ? 1 : 2;
    dialog.querySelectorAll('[data-chapter]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === chapterIndex)));
    $('guide-skip-device').hidden = chapterIndex !== 1;
    $('guide-progress').textContent = `${chapters[chapterIndex].label}${chapterIndex === 1 ? ' · 선택' : ''} · ${index + 1} / ${steps.length}`;
    $('guide-title').textContent = title;
    $('guide-description').textContent = description;
    $('guide-prev').disabled = index === 0;
    $('guide-next').textContent = index === steps.length - 1 ? '안내 마치기' : '다음';
    if (target) target.scrollIntoView({block: 'center', behavior: 'instant'});
    positionGuide(true);
  }

  function positionGuide(reveal = false) {
    if (!dialog.open) return;
    const panel = $('guide-panel'), spot = $('guide-spotlight');
    const width = window.innerWidth, height = window.innerHeight, gap = 16;
    panel.style.width = Math.min(360, width - 24) + 'px';
    const ph = panel.getBoundingClientRect().height, pw = panel.getBoundingClientRect().width;
    const headerBottom = document.querySelector('header').getBoundingClientRect().bottom;
    let r = target ? target.getBoundingClientRect() : null;
    // Narrow screens reserve the lower area for the explanation. A temporary bottom
    // spacer allows the last control to scroll above it without altering saved data.
    const narrow = width < 700;
    if (reveal && r && narrow) {
      const top = Math.max(12, headerBottom + 16);
      window.scrollBy({top: r.top - top, behavior: 'instant'});
      r = target.getBoundingClientRect();
    }
    let x = width - pw - 12, y = height - ph - 12;
    if (r && !narrow) {
      const candidates = [
        [r.left - pw - gap, Math.max(12, Math.min(r.top, height - ph - 12))],
        [r.right + gap, Math.max(12, Math.min(r.top, height - ph - 12))],
        [Math.max(12, Math.min(r.left, width - pw - 12)), r.bottom + gap],
        [Math.max(12, Math.min(r.left, width - pw - 12)), r.top - ph - gap]
      ];
      const fit = candidates.find(([cx, cy]) => cx >= 12 && cy >= 12 && cx + pw <= width - 12 && cy + ph <= height - 12);
      if (fit) [x,y] = fit;
    }
    panel.style.left = x + 'px'; panel.style.top = Math.max(12, y) + 'px';
    if (r) {
      const top = Math.max(4, r.top - 5), left = Math.max(4, r.left - 5);
      const bottom = Math.min(height - 4, narrow ? y - 12 : height - 4, r.bottom + 5);
      spot.hidden = bottom <= top || r.right <= 0 || r.left >= width;
      Object.assign(spot.style, {left: left + 'px', top: top + 'px', width: Math.max(0, Math.min(width - 4, r.right + 5) - left) + 'px', height: Math.max(0, bottom - top) + 'px'});
    } else spot.hidden = true;
  }
  function startTour(kind, button) {
    if (kind !== 'all') return;
    opener = button; originalScroll = window.scrollY;
    steps = allSteps; index = 0;
    examplesWereOpen = $('help-examples').open;
    document.body.classList.add('guide-active');
    dialog.showModal();
    renderStep();
    $('guide-next').focus({preventScroll:true});
  }
  support.querySelectorAll('[data-tour]').forEach(button => button.addEventListener('click', () => startTour(button.dataset.tour, button)));
  $('guide-prev').addEventListener('click', () => { if (index > 0) { index--; renderStep(); } });
  $('guide-next').addEventListener('click', () => { if (index === steps.length - 1) dialog.close(); else { index++; renderStep(); } });
  dialog.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => { index = chapters[Number(button.dataset.chapter)].start; renderStep(); }));
  $('guide-skip-device').addEventListener('click', () => { index = chapters[2].start; renderStep(); $('guide-next').focus({preventScroll:true}); });
  $('guide-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('guide-active');
    $('help-examples').open = examplesWereOpen;
    window.scrollTo({top:originalScroll, behavior:'instant'});
    if (opener) opener.focus({preventScroll:true});
  });
  const reposition = () => {
    if (!dialog.open || pendingFrame) return;
    pendingFrame = requestAnimationFrame(() => { pendingFrame = 0; positionGuide(); });
  };
  window.addEventListener('resize', () => { if (dialog.open) renderStep(); });
  window.addEventListener('scroll', reposition, {passive:true});
  if (location.hash === '#support-card') requestAnimationFrame(() => openHelp());
})();

