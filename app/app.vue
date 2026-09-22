<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const slideTitles = [
  'الغلاف',
  'آية قرآنية',
  'مقدمة المشروع',
  'محتويات العرض',
  'المشكلة',
  'الحل',
  'أهداف المشروع',
  'تقنيات المشروع',
  'إنترنت الأشياء',
  'مكونات المشروع',
  'RFID وأطراف MCU',
  'مخطط المشروع',
  'Flowchart',
  'دوائر المشروع',
  'الكيان المعنوي',
  'منطق التشغيل',
  'الاختبارات',
  'الاستنتاج والتطوير',
  'شكراً'
]

const requestedSlide = Number(useRequestURL().searchParams.get('slide'))
const initialSlide = Number.isInteger(requestedSlide) && requestedSlide >= 1 && requestedSlide <= slideTitles.length
  ? requestedSlide - 1
  : 0
const active = ref(initialSlide)
const overviewOpen = ref(false)
const helpOpen = ref(false)
const direction = ref<'next' | 'prev'>('next')
const touchStartX = ref(0)
const touchStartY = ref(0)
const isFullscreen = ref(false)
const total = slideTitles.length

const slideNumber = computed(() => String(active.value + 1).padStart(2, '0'))
const totalNumber = String(total).padStart(2, '0')

function goTo(index: number) {
  const bounded = Math.max(0, Math.min(total - 1, index))
  direction.value = bounded >= active.value ? 'next' : 'prev'
  active.value = bounded
  overviewOpen.value = false
}

function next() {
  goTo(active.value === total - 1 ? 0 : active.value + 1)
}

function previous() {
  goTo(active.value === 0 ? total - 1 : active.value - 1)
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen?.()
  } else {
    await document.exitFullscreen?.()
  }
}

function handleKey(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault()
    next()
  } else if (event.key === 'ArrowRight' || event.key === 'PageUp') {
    event.preventDefault()
    previous()
  } else if (event.key === 'Home') {
    goTo(0)
  } else if (event.key === 'End') {
    goTo(total - 1)
  } else if (event.key.toLowerCase() === 'f') {
    toggleFullscreen()
  } else if (event.key.toLowerCase() === 'o') {
    overviewOpen.value = !overviewOpen.value
  } else if (event.key === 'Escape') {
    overviewOpen.value = false
    helpOpen.value = false
  }
}

function handleTouchStart(event: TouchEvent) {
  touchStartX.value = event.changedTouches[0].clientX
  touchStartY.value = event.changedTouches[0].clientY
}

function handleTouchEnd(event: TouchEvent) {
  const deltaX = event.changedTouches[0].clientX - touchStartX.value
  const deltaY = event.changedTouches[0].clientY - touchStartY.value
  if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY)) {
    deltaX < 0 ? next() : previous()
  }
}

function syncFullscreen() {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)
  document.addEventListener('fullscreenchange', syncFullscreen)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
  document.removeEventListener('fullscreenchange', syncFullscreen)
})
</script>

<template>
  <main class="presentation" @touchstart.passive="handleTouchStart" @touchend.passive="handleTouchEnd">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="grain" />

    <header class="topbar" aria-label="شريط العرض">
      <button class="brand" aria-label="العودة إلى الغلاف" @click="goTo(0)">
        <span class="brand-mark"><i /><i /><i /></span>
        <span>
          <b>SMART FUEL</b>
          <small>CONTROL SYSTEM</small>
        </span>
      </button>

      <nav class="progress-nav" aria-label="التنقل بين الشرائح">
        <button
          v-for="(title, index) in slideTitles"
          :key="title"
          :class="{ active: index === active, passed: index < active }"
          :aria-label="`الشريحة ${index + 1}: ${title}`"
          @click="goTo(index)"
        />
      </nav>

      <div class="top-actions">
        <button class="icon-button" aria-label="فهرس الشرائح" title="فهرس الشرائح (O)" @click="overviewOpen = true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /></svg>
        </button>
        <button class="icon-button" aria-label="وضع ملء الشاشة" title="ملء الشاشة (F)" @click="toggleFullscreen">
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" /></svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3v5H3M16 3v5h5M21 16h-5v5M3 16h5v5" /></svg>
        </button>
      </div>
    </header>

    <section class="stage" aria-live="polite">
      <Transition :name="direction === 'next' ? 'slide-next' : 'slide-prev'" mode="out-in">
        <article :key="active" class="slide">
          <!-- 01 / Cover -->
          <div v-if="active === 0" class="slide-body cover-slide">
            <div class="cover-copy">
              <div class="eyebrow"><span>مشروع تخرج</span><i /> إنترنت الأشياء × هندسة التحكم</div>
              <h1>محطة وقود<br><em>ذكيّة</em></h1>
              <p class="cover-subtitle">منظومة متكاملة لتنظيم صرف الوقود باستخدام <b>RFID</b> وتطبيق Android والتحكم الآلي.</p>
              <div class="cover-meta">
                <div><span>إعداد</span><strong>ميلاد سالم الجربوعي</strong><strong>سند مسعود أونيس</strong></div>
                <div><span>إشراف</span><strong>د. محمد بورخيص</strong></div>
              </div>
            </div>
            <div class="hero-visual" aria-label="تصور لمنظومة محطة الوقود الذكية">
              <div class="orbit orbit-one"><span>RFID</span></div><div class="orbit orbit-two"><span>IoT</span></div>
              <div class="hero-chip"><div class="chip-led" /><span class="chip-label">NODE MCU</span><div class="chip-core"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M22 66V42c0-11 9-20 20-20h36c11 0 20 9 20 20v36c0 11-9 20-20 20H55"/><path d="M42 42h36v36H42zM12 52h30M12 68h30M78 52h30M78 68h30M52 12v30M68 12v30M52 78v30M68 78v30"/></svg></div><small>CONNECTED / READY</small></div>
              <div class="signal signal-a"/><div class="signal signal-b"/><div class="signal signal-c"/>
              <div class="floating-tag tag-a">HTTP <b>→</b></div><div class="floating-tag tag-b">UDP <b>→</b></div><div class="floating-tag tag-c">PULSE <b>248</b></div>
            </div>
            <div class="institution"><img src="/media/college-logo.jpeg" alt="شعار كلية تقنية الحاسوب طرابلس"><p>كلية تقنية الحاسوب - طرابلس<br><b>قسم التحكم الآلي</b></p><span>ربيع 2026</span></div>
          </div>

          <!-- 02 / Quran -->
          <div v-else-if="active === 1" class="slide-body verse-slide">
            <div class="verse-mark">01</div>
            <div class="verse-ornament"><i/><i/><span>۞</span><i/><i/></div>
            <p>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <blockquote>﴿ وَقُلْ رَبِّ زِدْنِي عِلْمًا ﴾</blockquote>
            <span class="verse-source">سورة طه · الآية 114</span>
            <div class="verse-footer">صدق الله العظيم</div>
          </div>

          <!-- 03 / Introduction -->
          <div v-else-if="active === 2" class="slide-body intro-slide">
            <div class="section-copy">
              <div class="slide-kicker"><span>02</span> مقدمة المشروع</div>
              <h2>من إجراء يدوي<br>إلى <em>منظومة قابلة للقياس.</em></h2>
              <p class="lead">يربط المشروع بين الحساسات، ووحدة التحكم، والاتصال اللاسلكي، وواجهة المستخدم لتنظيم مورد محدود بقواعد واضحة وبيانات يمكن متابعتها.</p>
              <div class="intro-thesis"><span>الفكرة الأساسية</span><b>الحساس يقيس · المتحكم يقرر · الواجهة توضّح</b></div>
            </div>
            <div class="intro-pillars">
              <div><span>01</span><b>دقة</b><p>تحويل الكمية من تقدير يدوي إلى نبضات محسوبة.</p><i>MEASURE</i></div>
              <div><span>02</span><b>شفافية</b><p>عرض الحصة والسعر والحالة للمستخدم مباشرة.</p><i>VISIBILITY</i></div>
              <div><span>03</span><b>تحكم</b><p>تشغيل وإيقاف المضخة وفق شروط محددة.</p><i>AUTOMATION</i></div>
            </div>
          </div>

          <!-- 04 / Outline -->
          <div v-else-if="active === 3" class="slide-body agenda-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>03</span> محتويات العرض</div><h2>ست محطات<br><em>لفهم المنظومة.</em></h2></div></div>
            <div class="agenda-grid">
              <div><span>01</span><small>WHY</small><b>المشكلة والحل</b><p>لماذا بُني النظام؟</p></div>
              <div><span>02</span><small>GOALS</small><b>الأهداف والتقنيات</b><p>ما الذي نريد تحقيقه؟</p></div>
              <div><span>03</span><small>HARDWARE</small><b>المكونات والتوصيلات</b><p>كيف بُني الكيان المادي؟</p></div>
              <div><span>04</span><small>DESIGN</small><b>المخططات والخوارزمية</b><p>كيف تتحرك البيانات والقرارات؟</p></div>
              <div><span>05</span><small>SOFTWARE</small><b>التطبيق والبرمجيات</b><p>كيف يتفاعل المستخدم؟</p></div>
              <div><span>06</span><small>PROOF</small><b>الاختبارات والاستنتاج</b><p>ماذا أثبت النموذج؟</p></div>
            </div>
          </div>

          <!-- 05 / Problem -->
          <div v-else-if="active === 4" class="slide-body split-slide problem-slide">
            <div class="section-copy"><div class="slide-kicker"><span>04</span> مشكلة المشروع</div><h2>المشكلة ليست في الضخ،<br><em>بل في إدارة العملية.</em></h2><p class="lead">الإجراءات المنفصلة لا تربط هوية المستفيد بالكمية المصروفة والسعر والحصة؛ فتزداد احتمالات الخطأ ويصبح الرصيد غير واضح.</p><div class="quote-card"><span>السؤال التصميمي</span><strong>كيف نجعل كل عملية صرف موثوقة، مقاسة، ومسجّلة؟</strong></div></div>
            <div class="problem-board">
              <div class="problem-line"><span>01</span><div><b>هوية غير مؤكدة</b><small>الحاجة إلى ربط المستفيد بحساب معتمد.</small></div><i>IDENTITY</i></div>
              <div class="problem-line"><span>02</span><div><b>كمية قابلة للخطأ</b><small>لا يوجد قياس لحظي يوقف الصرف عند الهدف.</small></div><i>ACCURACY</i></div>
              <div class="problem-line"><span>03</span><div><b>تجاوز الحصة</b><small>الحصة والسعر المدعوم يحتاجان قاعدة حساب واضحة.</small></div><i>QUOTA</i></div>
              <div class="problem-line"><span>04</span><div><b>متابعة مشتّتة</b><small>صعوبة معرفة الرصيد والنتيجة وحالة العملية.</small></div><i>TRACKING</i></div>
              <div class="board-status"><span/><b>04 تحديات</b><small>منظومة واحدة لمعالجتها</small></div>
            </div>
          </div>

          <!-- 06 / Solution -->
          <div v-else-if="active === 5" class="slide-body solution-slide">
            <div class="section-head"><div><div class="slide-kicker"><span>05</span> الحل</div><h2>رحلة صرف<br><em>رقمية ومنضبطة.</em></h2></div><p>محطة مصغرة تجمع التحقق، الطلب، القرار، القياس والعرض ضمن مسار واحد.</p></div>
            <div class="solution-grid">
              <div class="solution-step featured"><span class="step-no">01</span><div class="radar-icon"><i/><i/><i/></div><div><small>تحقّق</small><h3>بطاقة RFID</h3><p>ربط UID بالمستخدم قبل السماح بالطلب.</p></div></div>
              <div class="solution-connector"><i/><b>هوية موثّقة</b><i/></div>
              <div class="solution-step"><span class="step-no">02</span><div class="phone-icon"><span/></div><div><small>اطلب</small><h3>تطبيق Android</h3><p>اختيار الكمية أو القيمة ومراجعة التكلفة.</p></div></div>
              <div class="solution-step"><span class="step-no">03</span><div class="control-icon"><span/><span/><span/></div><div><small>تحكّم</small><h3>Relay + Pump</h3><p>تشغيل المضخة بعد تحقق الشروط فقط.</p></div></div>
              <div class="solution-connector"><i/><b>تغذية راجعة</b><i/></div>
              <div class="solution-step featured teal"><span class="step-no">04</span><div class="gauge-icon"><span>100</span><i/></div><div><small>قِس</small><h3>Flow + TFT</h3><p>قياس التدفق والإيقاف وعرض النتيجة.</p></div></div>
            </div>
          </div>

          <!-- 07 / Objectives -->
          <div v-else-if="active === 6" class="slide-body objectives-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>06</span> أهداف المشروع</div><h2>خمسة أهداف<br><em>قابلة للاختبار.</em></h2></div><p>استُخدمت هذه الأهداف لاحقاً كمعايير للحكم على نجاح النموذج.</p></div>
            <div class="objective-grid">
              <div class="objective-main"><span>01</span><small>IDENTITY</small><b>ربط المستخدم ببطاقة RFID</b><p>منع عدم التطابق بين الحساب والبطاقة.</p></div>
              <div><span>02</span><small>EXPERIENCE</small><b>تطبيق ثنائي اللغة</b><p>طلب واضح بالعربية والإنجليزية.</p></div>
              <div><span>03</span><small>CONTROL</small><b>قياس وإيقاف تلقائي</b><p>إيقاف المضخة عند الكمية المطلوبة.</p></div>
              <div><span>04</span><small>BUSINESS RULES</small><b>حصة وتسعير مزدوج</b><p>دعم شهري وترحيل وسعر عادي للزائد.</p></div>
              <div><span>05</span><small>ARCHITECTURE</small><b>فصل المهام على لوحتين</b><p>اتصال لاسلكي وعرض مستقل.</p></div>
            </div>
          </div>

          <!-- 08 / Technologies -->
          <div v-else-if="active === 7" class="slide-body technology-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>07</span> تقنيات المشروع</div><h2>ثلاث طبقات،<br><em>نظام واحد.</em></h2></div><p>اختيرت التقنية بحسب دورها: استشعار، اتصال، أو قرار وعرض.</p></div>
            <div class="technology-columns">
              <div class="tech-column hardware"><div class="tech-label"><span>HW</span><b>الكيان المادي</b></div><ul><li><strong>ESP8266</strong><small>MCU + Wi-Fi</small></li><li><strong>RFID / SPI</strong><small>Identity input</small></li><li><strong>Flow Sensor</strong><small>Pulse feedback</small></li><li><strong>Relay + Pump</strong><small>Actuation</small></li></ul></div>
              <div class="tech-column network"><div class="tech-label"><span>NET</span><b>الاتصال</b></div><ul><li><strong>Wi-Fi 2.4 GHz</strong><small>Local network</small></li><li><strong>HTTP</strong><small>App requests</small></li><li><strong>UDP</strong><small>Live TFT status</small></li><li><strong>NTP</strong><small>Monthly rollover</small></li></ul></div>
              <div class="tech-column software"><div class="tech-label"><span>SW</span><b>الكيان المعنوي</b></div><ul><li><strong>Arduino IDE</strong><small>NodeMCU firmware</small></li><li><strong>Android</strong><small>User interface</small></li><li><strong>EEPROM</strong><small>Persistent values</small></li><li><strong>State Machine</strong><small>Safe control flow</small></li></ul></div>
            </div>
          </div>

          <!-- 09 / IoT -->
          <div v-else-if="active === 8" class="slide-body iot-slide">
            <div class="section-copy"><div class="slide-kicker"><span>08</span> إنترنت الأشياء IoT</div><h2>ربط الواقع<br><em>بالقرار الرقمي.</em></h2><p class="lead">ينقل النظام حالة الجهاز المادي إلى واجهة رقمية، ويعيد أوامر المستخدم إلى المضخة ضمن حلقة تحكم مغلقة.</p><div class="iot-benefits"><span>مراقبة مباشرة</span><span>أتمتة</span><span>قابلية للتوسع</span><span>بيانات قابلة للتحليل</span></div></div>
            <div class="iot-layers">
              <div><span>04</span><b>طبقة التطبيق</b><small>Android + TFT</small><i>واجهة ونتيجة</i></div>
              <div><span>03</span><b>طبقة المعالجة</b><small>NodeMCU Logic</small><i>قرار وحصة وسعر</i></div>
              <div><span>02</span><b>طبقة النقل</b><small>Wi-Fi / HTTP / UDP</small><i>أوامر وحالة</i></div>
              <div><span>01</span><b>طبقة الإدراك</b><small>RFID + Flow</small><i>هوية وقياس</i></div>
            </div>
          </div>

          <!-- 10 / Components -->
          <div v-else-if="active === 9" class="slide-body components-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>09</span> مكونات المشروع</div><h2>منظومة صغيرة،<br><em>وظائف متكاملة.</em></h2></div><p>كل قطعة تؤدي دوراً محدداً داخل سلسلة التحكم.</p></div>
            <div class="component-grid">
              <div class="component-card primary"><img src="/media/nodemcu-main.jpeg" alt="لوحة NodeMCU"><div><span>01 / CONTROL</span><h3>NodeMCU ESP8266</h3><p>لوحتان للمعالجة والعرض</p></div><b>×2</b></div>
              <div class="component-card"><img src="/media/rfid-reader.jpeg" alt="قارئ RFID RC522"><div><span>02 / IDENTITY</span><h3>RFID RC522</h3><p>قراءة هوية البطاقة</p></div></div>
              <div class="component-card"><img src="/media/flow-sensor.jpeg" alt="حساس التدفق"><div><span>03 / FEEDBACK</span><h3>Flow Sensor</h3><p>تحويل التدفق إلى نبضات</p></div></div>
              <div class="component-card"><img src="/media/relay.jpeg" alt="وحدة الريليه"><div><span>04 / SWITCHING</span><h3>Relay</h3><p>عزل وتحكم في المضخة</p></div></div>
              <div class="component-card"><img src="/media/pump.jpeg" alt="المضخة التجريبية"><div><span>05 / ACTUATION</span><h3>5V Pump</h3><p>تنفيذ عملية الصرف</p></div></div>
              <div class="component-card"><img src="/media/tft-screen.jpeg" alt="شاشة TFT"><div><span>06 / DISPLAY</span><h3>TFT ILI9341</h3><p>عرض الحالة لحظياً</p></div></div>
            </div>
          </div>

          <!-- 11 / RFID & MCU -->
          <div v-else-if="active === 10" class="slide-body rfid-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>10</span> RFID وأطراف MCU</div><h2>الهوية تدخل<br><em>عبر SPI.</em></h2></div><p>يقرأ RC522 المعرّف UID عند 13.56 MHz، ثم تقارنه اللوحة بقائمة المستخدمين المسموح لهم.</p></div>
            <div class="rfid-layout">
              <div class="rfid-visual"><img src="/media/rfid-reader.jpeg" alt="قارئ RC522 وبطاقة RFID"><div class="scan-wave"><i/><i/><i/></div><span>13.56 MHz</span></div>
              <div class="rfid-process"><div><span>01</span><b>اقرأ UID</b><small>بطاقة دون تلامس</small></div><i/><div><span>02</span><b>طابق المستخدم</b><small>الحساب + البطاقة</small></div><i/><div><span>03</span><b>اسمح أو ارفض</b><small>قرار قبل الطلب</small></div></div>
              <div class="pin-map">
                <div class="pin-map-head"><span>RC522</span><b>NodeMCU #1</b></div>
                <div><span>SDA / SS</span><b>D2</b></div><div><span>RST</span><b>D3</b></div><div><span>SCK</span><b>D5</b></div><div><span>MISO</span><b>D6</b></div><div><span>MOSI</span><b>D7</b></div><div><span>POWER</span><b>3.3V + GND</b></div>
              </div>
            </div>
          </div>

          <!-- 12 / Architecture -->
          <div v-else-if="active === 11" class="slide-body architecture-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>11</span> مخطط المشروع</div><h2>لوحتان. شبكة واحدة.<br><em>مسار قرار واضح.</em></h2></div><div class="architecture-legend"><span><i class="data"/> بيانات</span><span><i class="control"/> تحكم</span></div></div>
            <div class="architecture-map">
              <div class="arch-node app-node"><span class="node-index">A</span><div class="mini-phone"><i/></div><small>واجهة المستخدم</small><b>Android App</b></div>
              <div class="arch-link link-http"><span>Wi-Fi / HTTP</span><i/><i/><i/></div>
              <div class="arch-node core-node"><span class="node-index">B</span><div class="node-glow"/><small>العقل الرئيسي</small><b>NodeMCU #1</b><em>قرار + تحقق + حساب</em></div>
              <div class="arch-link link-udp"><span>Wi-Fi / UDP</span><i/><i/><i/></div>
              <div class="arch-node screen-node"><span class="node-index">C</span><div class="mini-screen"><span>2.40 L</span></div><small>واجهة المحطة</small><b>NodeMCU #2 + TFT</b></div>
              <div class="lower-link"><span>GPIO / PULSES</span><i/></div>
              <div class="arch-node actuator-node"><span class="node-index">D</span><div class="pump-symbol"><i/></div><small>المسار الفيزيائي</small><b>Relay + Pump + Flow</b></div>
              <div class="rfid-dock"><span class="rfid-card">RFID<i/></span><b>مدخل الهوية</b><small>SPI</small></div>
            </div>
            <div class="architecture-note"><span>لماذا لوحتان؟</span><p>فصل العرض عن التحكم قلّل تعارض الأطراف والذاكرة وثبّت تحديث الشاشة.</p></div>
          </div>

          <!-- 13 / Flowchart -->
          <div v-else-if="active === 12" class="slide-body flowchart-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>12</span> Flowchart</div><h2>كل قرار له<br><em>مسار آمن.</em></h2></div><p>يبدأ المسار بالهوية، ولا يصل إلى تشغيل المضخة إلا بعد نجاح جميع نقاط التحقق.</p></div>
            <div class="flowchart">
              <div class="flow-node start"><small>START</small><b>تسجيل الدخول + تمرير RFID</b></div><i class="flow-arrow"/>
              <div class="flow-node decision"><small>CHECK 01</small><b>هل الحساب يطابق البطاقة؟</b></div>
              <div class="flow-branch reject"><span>لا</span><b>رفض + PUMP OFF</b></div><div class="flow-branch pass"><span>نعم</span><b>استقبال الطلب</b></div>
              <div class="flow-node decision second"><small>CHECK 02</small><b>هل الطلب والحصة صالحان؟</b></div>
              <div class="flow-branch reject second-reject"><span>لا</span><b>رسالة خطأ واضحة</b></div><div class="flow-branch pass second-pass"><span>نعم</span><b>Relay ON</b></div>
              <div class="flow-node process"><small>LOOP</small><b>عدّ نبضات التدفق ومقارنة الكمية</b></div><i class="flow-arrow lower"/>
              <div class="flow-node end"><small>COMPLETE</small><b>إيقاف · تحديث · عرض النتيجة</b></div>
            </div>
          </div>

          <!-- 14 / Circuits -->
          <div v-else-if="active === 13" class="slide-body circuits-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>13</span> دوائر المشروع</div><h2>توصيلات واضحة،<br><em>ومهام منفصلة.</em></h2></div><p>اللوحة الرئيسية تتحكم في الهوية والضخ، واللوحة الفرعية مخصصة لشاشة TFT.</p></div>
            <div class="circuit-gallery">
              <figure><div class="circuit-image"><img src="/media/wiring-main.jpeg" alt="توصيلات لوحة NodeMCU الرئيسية"></div><figcaption><span>A / MAIN CONTROL</span><b>RFID + Flow + Relay</b><small>D2/D3 · D1 · D0 · SPI</small></figcaption></figure>
              <figure><div class="circuit-image"><img src="/media/wiring-screen.jpeg" alt="توصيلات لوحة NodeMCU الخاصة بالشاشة"></div><figcaption><span>B / DISPLAY</span><b>TFT ILI9341</b><small>CS D8 · DC D4 · SCK D5 · MOSI D7</small></figcaption></figure>
            </div>
            <div class="circuit-warning"><b>تنبيه السلامة</b><span>النموذج اختُبر بسائل آمن ومضخة تعليمية؛ التطبيق الحقيقي يحتاج معدات وقود معتمدة وحماية من الشرر.</span></div>
          </div>

          <!-- 15 / Software -->
          <div v-else-if="active === 14" class="slide-body app-slide software-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>14</span> الكيان المعنوي</div><h2>ثلاث واجهات،<br><em>تجربة واحدة.</em></h2></div><p>برنامج اللوحة الرئيسية، برنامج الشاشة، وتطبيق Android تعمل معاً ضمن بروتوكول واضح.</p></div>
            <div class="phone-gallery">
              <figure class="phone-frame phone-one"><div class="phone-speaker"/><img src="/media/app-login.png" alt="واجهة تسجيل الدخول"><figcaption><span>01</span><b>تسجيل الدخول</b><small>حساب المستخدم</small></figcaption></figure>
              <figure class="phone-frame phone-two"><div class="phone-speaker"/><img src="/media/app-dashboard.png" alt="لوحة تحكم التطبيق"><figcaption><span>02</span><b>لوحة الحساب</b><small>الحصة والحالة</small></figcaption></figure>
              <figure class="phone-frame phone-three"><div class="phone-speaker"/><img src="/media/app-order.png" alt="واجهة إنشاء طلب الوقود"><figcaption><span>03</span><b>إنشاء الطلب</b><small>كمية + تكلفة</small></figcaption></figure>
              <div class="gallery-orbit orbit-left">AR</div><div class="gallery-orbit orbit-right">EN</div>
            </div>
            <div class="software-modules"><span><b>MAIN MCU</b> خادم HTTP + منطق التحكم</span><span><b>DISPLAY MCU</b> مستقبل UDP + TFT</span><span><b>ANDROID</b> طلب + متابعة + إعداد IP</span></div>
          </div>

          <!-- 16 / Operating logic -->
          <div v-else-if="active === 15" class="slide-body operation-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>15</span> منطق التشغيل</div><h2>حالة بعد حالة،<br><em>ونبضة بعد نبضة.</em></h2></div><p>آلة الحالات تمنع تشغيل المضخة خارج التسلسل، وحساس التدفق يغلق الحلقة عند بلوغ الهدف.</p></div>
            <div class="state-machine compact-machine">
              <div class="state-node state-idle"><span>01</span><small>IDLE</small><b>انتظار</b><em>PUMP OFF</em></div><div class="state-arrow"><i/><span>بطاقة</span></div>
              <div class="state-node"><span>02</span><small>AUTHORIZED</small><b>هوية معتمدة</b><em>RFID ✓</em></div><div class="state-arrow"><i/><span>طلب</span></div>
              <div class="state-node"><span>03</span><small>ORDER READY</small><b>طلب صالح</b><em>QUOTA ✓</em></div><div class="state-arrow"><i/><span>تشغيل</span></div>
              <div class="state-node state-running"><div class="pulse-ring"/><span>04</span><small>DISPENSING</small><b>ضخ وقياس</b><em>PUMP ON</em></div><div class="state-arrow"><i/><span>الهدف</span></div>
              <div class="state-node state-done"><span>05</span><small>COMPLETE</small><b>إيقاف وحفظ</b><em>SAVED ✓</em></div>
            </div>
            <div class="operation-bottom">
              <div class="formula-card"><span>الكمية المصروفة</span><b>=</b><code>عدد النبضات ÷ معامل المعايرة</code></div>
              <div class="price-card"><span>الحصة الشهرية</span><strong>200 L</strong><small>0.15 د.ل/لتر داخل الحصة</small></div>
              <div class="price-card regular"><span>بعد انتهاء الدعم</span><strong>4.00</strong><small>د.ل/لتر · ترحيل حتى 400 L</small></div>
            </div>
          </div>

          <!-- 17 / Tests -->
          <div v-else-if="active === 16" class="slide-body results-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>16</span> الاختبارات</div><h2>المسار الكامل<br><em>عمل كوحدة واحدة.</em></h2></div><div class="result-score"><strong>9/9</strong><span>وظائف أساسية ناجحة</span></div></div>
            <div class="results-layout">
              <div class="test-grid">
                <div><span>01</span><b>اتصال Wi-Fi</b><i>✓</i></div><div><span>02</span><b>قراءة RFID</b><i>✓</i></div>
                <div><span>03</span><b>مطابقة المستخدم</b><i>✓</i></div><div><span>04</span><b>اختبار الريليه</b><i>✓</i></div>
                <div><span>05</span><b>تشغيل المضخة 5V</b><i>✓</i></div><div><span>06</span><b>قراءة التدفق</b><i>✓</i></div>
                <div><span>07</span><b>الإيقاف عند الهدف</b><i>✓</i></div><div><span>08</span><b>عرض TFT عبر UDP</b><i>✓</i></div>
                <div><span>09</span><b>تطبيق عربي/إنجليزي</b><i>✓</i></div>
                <div class="test-note"><span>ملاحظة</span><b>قياس التدفق نجح مبدئياً، ويحتاج معايرة نهائية دقيقة للاستخدام الكمي.</b></div>
              </div>
              <div class="challenge-list"><div class="challenge-title"><span>بيئة الاختبار</span><b>LAB SETUP</b></div><div><span>الهاتف</span><b>OPPO A16</b></div><div><span>الشبكة</span><b>Wi-Fi Hotspot</b></div><div><span>التحكم والعرض</span><b>2 × NodeMCU</b></div><div><span>المسار الميكانيكي</span><b>مضخة 5V + سائل آمن</b></div><div><span>المعايرة</span><b>وعاء مدرّج</b></div></div>
            </div>
          </div>

          <!-- 18 / Conclusion -->
          <div v-else-if="active === 17" class="slide-body conclusion-slide">
            <div class="section-head compact"><div><div class="slide-kicker"><span>17</span> الاستنتاج والعمل المستقبلي</div><h2>النموذج أثبت الفكرة،<br><em>والنسخة القادمة توسّعها.</em></h2></div><p>نجح الدمج بين الهوية والطلب والقياس والتحكم والعرض داخل شبكة محلية واحدة.</p></div>
            <div class="conclusion-grid">
              <div class="conclusion-now"><span>ما تحقق</span><h3>نموذج متكامل قابل للاختبار</h3><ul><li>ربط كل بطاقة باسم مستخدم</li><li>تشغيل المضخة بعد طلب صحيح فقط</li><li>قياس بالملليلتر وإيقاف تلقائي</li><li>حصة شهرية وتسعير مزدوج وترحيل</li><li>عرض مستقل على الهاتف وTFT</li></ul></div>
              <div class="conclusion-arrow"><i/><span>NEXT</span></div>
              <div class="conclusion-future"><span>العمل المستقبلي</span><h3>من محطة مصغرة إلى منصة مركزية</h3><ul><li>قاعدة بيانات سحابية ومزامنة فورية</li><li>محطات ومضخات متعددة</li><li>صلاحيات وتشفير وتوقيع الطلبات</li><li>دفع إلكتروني وإشعارات وتقارير</li><li>معدات صناعية معتمدة ومعايرة قانونية</li></ul></div>
            </div>
          </div>

          <!-- 19 / Thanks — video slide intentionally omitted -->
          <div v-else class="slide-body closing-slide final-thanks-slide">
            <div class="thanks-rings"><i/><i/><i/></div>
            <div class="closing-top"><div class="slide-kicker"><span>18</span> ختام العرض</div><h2>شكراً لحُسن<br><em>استماعكم.</em></h2><p>نسعد بأسئلتكم وملاحظاتكم حول المنظومة وآلية تشغيلها.</p></div>
            <div class="thanks-block"><span>THANK YOU / شكراً</span><h3>الأسئلة والمناقشة</h3><p>Smart Fuel Station · RFID · IoT · Automatic Control</p></div>
            <div class="closing-signature"><b>ميلاد سالم الجربوعي</b><i/><b>سند مسعود أونيس</b><span>قسم التحكم الآلي · ربيع 2026</span></div>
          </div>
        </article>
      </Transition>
    </section>

    <footer class="controls">
      <div class="slide-counter"><b>{{ slideNumber }}</b><i />{{ totalNumber }}<span>{{ slideTitles[active] }}</span></div>
      <div class="navigation-buttons">
        <button aria-label="الشريحة السابقة" @click="previous"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg><span>السابق</span></button>
        <button class="next-button" aria-label="الشريحة التالية" @click="next"><span>{{ active === total - 1 ? 'البداية' : 'التالي' }}</span><svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7" /></svg></button>
      </div>
      <button class="hint-button" aria-label="اختصارات التحكم" @click="helpOpen = true"><kbd>←</kbd><kbd>→</kbd><span>للتنقل</span></button>
    </footer>

    <Transition name="fade">
      <div v-if="overviewOpen" class="modal-backdrop" @click.self="overviewOpen = false">
        <div class="overview-panel">
          <div class="modal-head"><div><span>OVERVIEW</span><h2>فهرس العرض</h2></div><button aria-label="إغلاق" @click="overviewOpen = false">×</button></div>
          <div class="overview-grid">
            <button v-for="(title, index) in slideTitles" :key="title" :class="{ active: index === active }" @click="goTo(index)">
              <span>{{ String(index + 1).padStart(2, '0') }}</span><b>{{ title }}</b><i>→</i>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="helpOpen" class="modal-backdrop" @click.self="helpOpen = false">
        <div class="help-panel">
          <div class="modal-head"><div><span>SHORTCUTS</span><h2>اختصارات العرض</h2></div><button aria-label="إغلاق" @click="helpOpen = false">×</button></div>
          <div class="shortcut-grid"><div><kbd>←</kbd><span>التالي</span></div><div><kbd>→</kbd><span>السابق</span></div><div><kbd>F</kbd><span>ملء الشاشة</span></div><div><kbd>O</kbd><span>الفهرس</span></div></div>
        </div>
      </div>
    </Transition>
  </main>
</template>
