<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const slideTitles = [
  'الغلاف',
  'المشكلة',
  'الحل المقترح',
  'معمارية النظام',
  'المكونات',
  'رحلة المستخدم',
  'الاتصال',
  'منطق التحكم',
  'القياس والحصص',
  'التطبيق والنموذج',
  'الاختبارات والنتائج',
  'الخلاصة'
]

const active = ref(0)
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
              <div class="orbit orbit-one"><span>RFID</span></div>
              <div class="orbit orbit-two"><span>IoT</span></div>
              <div class="hero-chip">
                <div class="chip-led" />
                <span class="chip-label">NODE MCU</span>
                <div class="chip-core">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <path d="M22 66V42c0-11 9-20 20-20h36c11 0 20 9 20 20v36c0 11-9 20-20 20H55" />
                    <path d="M42 42h36v36H42zM12 52h30M12 68h30M78 52h30M78 68h30M52 12v30M68 12v30M52 78v30M68 78v30" />
                  </svg>
                </div>
                <small>CONNECTED / READY</small>
              </div>
              <div class="signal signal-a" /><div class="signal signal-b" /><div class="signal signal-c" />
              <div class="floating-tag tag-a">HTTP <b>→</b></div>
              <div class="floating-tag tag-b">UDP <b>→</b></div>
              <div class="floating-tag tag-c">PULSE <b>248</b></div>
            </div>

            <div class="institution">
              <img src="/media/college-logo.jpeg" alt="شعار كلية تقنية الحاسوب طرابلس">
              <p>كلية تقنية الحاسوب - طرابلس<br><b>قسم التحكم الآلي</b></p>
              <span>ربيع 2026</span>
            </div>
          </div>

          <!-- 02 / Problem -->
          <div v-else-if="active === 1" class="slide-body split-slide problem-slide">
            <div class="section-copy">
              <div class="slide-kicker"><span>01</span> نقطة البداية</div>
              <h2>المشكلة ليست في الضخ،<br><em>بل في إدارة العملية.</em></h2>
              <p class="lead">عندما تعتمد عملية الصرف على التحقق اليدوي والتسجيل المنفصل، تصبح الأخطاء وصعوبة المتابعة جزءاً من المنظومة.</p>
              <div class="quote-card">
                <span>السؤال التصميمي</span>
                <strong>كيف نجعل كل عملية صرف موثوقة، مقاسة، ومسجّلة؟</strong>
              </div>
            </div>
            <div class="problem-board">
              <div class="problem-line"><span>01</span><div><b>هوية غير مؤكدة</b><small>الحاجة إلى ربط المستفيد بحساب معتمد.</small></div><i>IDENTITY</i></div>
              <div class="problem-line"><span>02</span><div><b>كمية قابلة للخطأ</b><small>لا يوجد قياس لحظي يوقف الصرف عند الهدف.</small></div><i>ACCURACY</i></div>
              <div class="problem-line"><span>03</span><div><b>بيانات مشتّتة</b><small>صعوبة تتبع الحصص والرصيد والعمليات.</small></div><i>TRACKING</i></div>
              <div class="problem-line"><span>04</span><div><b>تحكم يدوي</b><small>البدء والإيقاف لا يرتبطان بالطلب فعلياً.</small></div><i>CONTROL</i></div>
              <div class="board-status"><span /><b>04 تحديات</b><small>منظومة واحدة لمعالجتها</small></div>
            </div>
          </div>

          <!-- 03 / Solution -->
          <div v-else-if="active === 2" class="slide-body solution-slide">
            <div class="section-head">
              <div><div class="slide-kicker"><span>02</span> الحل المقترح</div><h2>تحويل الصرف إلى<br><em>رحلة رقمية منضبطة</em></h2></div>
              <p>نموذج أولي يجمع التحقق، الطلب، القرار، القياس والعرض في مسار واحد.</p>
            </div>
            <div class="solution-grid">
              <div class="solution-step featured">
                <span class="step-no">01</span><div class="radar-icon"><i /><i /><i /></div>
                <div><small>تحقّق</small><h3>بطاقة RFID</h3><p>هوية مرتبطة بالمستخدم قبل السماح بأي طلب.</p></div>
              </div>
              <div class="solution-connector"><i /><b>هوية موثّقة</b><i /></div>
              <div class="solution-step">
                <span class="step-no">02</span><div class="phone-icon"><span /></div>
                <div><small>اطلب</small><h3>تطبيق Android</h3><p>إدخال الكمية ومراجعة الحصة والتكلفة.</p></div>
              </div>
              <div class="solution-step">
                <span class="step-no">03</span><div class="control-icon"><span /><span /><span /></div>
                <div><small>تحكّم</small><h3>تشغيل آلي</h3><p>Relay يربط قرار النظام بالمضخة مباشرة.</p></div>
              </div>
              <div class="solution-connector"><i /><b>تغذية راجعة</b><i /></div>
              <div class="solution-step featured teal">
                <span class="step-no">04</span><div class="gauge-icon"><span>100</span><i /></div>
                <div><small>قِس</small><h3>تدفّق لحظي</h3><p>نبضات الحساس تحدد الكمية وتوقف المضخة.</p></div>
              </div>
            </div>
          </div>

          <!-- 04 / Architecture -->
          <div v-else-if="active === 3" class="slide-body architecture-slide">
            <div class="section-head compact">
              <div><div class="slide-kicker"><span>03</span> معمارية النظام</div><h2>لوحتان. شبكة واحدة.<br><em>مسار قرار واضح.</em></h2></div>
              <div class="architecture-legend"><span><i class="data" /> بيانات</span><span><i class="control" /> تحكم</span></div>
            </div>
            <div class="architecture-map">
              <div class="arch-node app-node">
                <span class="node-index">A</span><div class="mini-phone"><i /></div><small>واجهة المستخدم</small><b>Android App</b>
              </div>
              <div class="arch-link link-http"><span>Wi-Fi / HTTP</span><i /><i /><i /></div>
              <div class="arch-node core-node">
                <span class="node-index">B</span><div class="node-glow" /><small>العقل الرئيسي</small><b>NodeMCU #1</b><em>قرار + تحقق + حساب</em>
              </div>
              <div class="arch-link link-udp"><span>Wi-Fi / UDP</span><i /><i /><i /></div>
              <div class="arch-node screen-node">
                <span class="node-index">C</span><div class="mini-screen"><span>2.40 L</span></div><small>واجهة المحطة</small><b>NodeMCU #2 + TFT</b>
              </div>
              <div class="lower-link"><span>GPIO / PULSES</span><i /></div>
              <div class="arch-node actuator-node">
                <span class="node-index">D</span><div class="pump-symbol"><i /></div><small>المسار الفيزيائي</small><b>Relay + Pump + Flow</b>
              </div>
              <div class="rfid-dock"><span class="rfid-card">RFID<i /></span><b>مدخل الهوية</b><small>SPI</small></div>
            </div>
            <div class="architecture-note"><span>لماذا لوحتان؟</span><p>فصل العرض عن التحكم يقلل تعارض الموارد ويمنح الشاشة تحديثاً أكثر ثباتاً.</p></div>
          </div>

          <!-- 05 / Components -->
          <div v-else-if="active === 4" class="slide-body components-slide">
            <div class="section-head compact">
              <div><div class="slide-kicker"><span>04</span> المكونات</div><h2>منظومة صغيرة،<br><em>وظائف متكاملة.</em></h2></div>
              <p>كل قطعة تؤدي دوراً محدداً داخل سلسلة التحكم.</p>
            </div>
            <div class="component-grid">
              <div class="component-card primary"><img src="/media/nodemcu-main.jpeg" alt="لوحة NodeMCU"><div><span>01 / CONTROL</span><h3>NodeMCU ESP8266</h3><p>لوحتان للمعالجة والعرض</p></div><b>×2</b></div>
              <div class="component-card"><img src="/media/rfid-reader.jpeg" alt="قارئ RFID RC522"><div><span>02 / IDENTITY</span><h3>RFID RC522</h3><p>قراءة هوية البطاقة</p></div></div>
              <div class="component-card"><img src="/media/flow-sensor.jpeg" alt="حساس التدفق"><div><span>03 / FEEDBACK</span><h3>Flow Sensor</h3><p>تحويل التدفق إلى نبضات</p></div></div>
              <div class="component-card"><img src="/media/relay.jpeg" alt="وحدة الريليه"><div><span>04 / SWITCHING</span><h3>Relay</h3><p>عزل وتحكم في المضخة</p></div></div>
              <div class="component-card"><img src="/media/pump.jpeg" alt="المضخة التجريبية"><div><span>05 / ACTUATION</span><h3>Test Pump</h3><p>تنفيذ عملية الصرف</p></div></div>
              <div class="component-card"><img src="/media/tft-screen.jpeg" alt="شاشة TFT"><div><span>06 / DISPLAY</span><h3>TFT ILI9341</h3><p>عرض الحالة لحظياً</p></div></div>
            </div>
          </div>

          <!-- 06 / Journey -->
          <div v-else-if="active === 5" class="slide-body journey-slide">
            <div class="section-head compact">
              <div><div class="slide-kicker"><span>05</span> رحلة المستخدم</div><h2>من البطاقة إلى الإيصال<br><em>في ثماني خطوات.</em></h2></div>
              <div class="journey-badge"><span>RFID FIRST</span><b>الهوية تسبق الطلب</b></div>
            </div>
            <div class="journey-track">
              <div class="journey-progress"><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <div class="journey-item active"><span>01</span><b>تسجيل الدخول</b><small>فتح حساب المستخدم</small></div>
              <div class="journey-item active"><span>02</span><b>تمرير البطاقة</b><small>قراءة UID</small></div>
              <div class="journey-item active"><span>03</span><b>مطابقة الهوية</b><small>بطاقة + حساب</small></div>
              <div class="journey-item"><span>04</span><b>تحديد الكمية</b><small>إرسال الطلب</small></div>
              <div class="journey-item"><span>05</span><b>فحص الحصة</b><small>الرصيد والتسعير</small></div>
              <div class="journey-item"><span>06</span><b>بدء الصرف</b><small>Relay ON</small></div>
              <div class="journey-item"><span>07</span><b>القياس</b><small>عدّ النبضات</small></div>
              <div class="journey-item success"><span>08</span><b>إيقاف وتحديث</b><small>نتيجة محفوظة</small></div>
            </div>
            <div class="journey-callout"><span class="scan-mark"><i /><i /><i /></span><div><small>قاعدة أمان أساسية</small><strong>طلب صحيح + بطاقة مطابقة = السماح بالصرف</strong></div><b>✓</b></div>
          </div>

          <!-- 07 / Communications -->
          <div v-else-if="active === 6" class="slide-body comms-slide">
            <div class="section-copy">
              <div class="slide-kicker"><span>06</span> الاتصال بين الأجزاء</div>
              <h2>البروتوكول المناسب<br><em>لكل مهمة.</em></h2>
              <p class="lead">لا تعتمد المنظومة اتصالاً واحداً لكل شيء؛ كل قناة اختيرت بحسب طبيعة البيانات المطلوبة.</p>
              <div class="comms-summary"><span>شبكة محلية</span><b>Hotspot</b><i />لا تحتاج اتصالاً سحابياً أثناء التجربة</div>
            </div>
            <div class="protocol-stack">
              <div class="protocol-card wifi"><div class="protocol-icon"><i /><i /><i /></div><span>01</span><h3>Wi-Fi</h3><p>طبقة الربط اللاسلكي بين الهاتف واللوحتين.</p><small>NETWORK</small></div>
              <div class="protocol-card http"><div class="protocol-icon"><b>→</b></div><span>02</span><h3>HTTP</h3><p>طلب واضح يحتاج قبولاً أو رفضاً من اللوحة الرئيسية.</p><small>REQUEST / RESPONSE</small></div>
              <div class="protocol-card udp"><div class="protocol-icon"><b>≋</b></div><span>03</span><h3>UDP</h3><p>تحديث خفيف وسريع للحالة والكمية على الشاشة.</p><small>LIVE STATUS</small></div>
              <div class="packet packet-a">POST /order <b>12.0L</b></div>
              <div class="packet packet-b">DISPENSING <b>68%</b></div>
            </div>
          </div>

          <!-- 08 / Logic -->
          <div v-else-if="active === 7" class="slide-body logic-slide">
            <div class="section-head compact">
              <div><div class="slide-kicker"><span>07</span> منطق التحكم</div><h2>آلة حالات تمنع<br><em>القرارات العشوائية.</em></h2></div>
              <p>لا تنتقل المضخة إلى التشغيل إلا بعد اكتمال شروط الحالة السابقة.</p>
            </div>
            <div class="state-machine">
              <div class="state-node state-idle"><span>01</span><small>WAITING</small><b>خمول</b><em>PUMP OFF</em></div>
              <div class="state-arrow"><i /><span>بطاقة</span></div>
              <div class="state-node"><span>02</span><small>AUTHORIZED</small><b>هوية معتمدة</b><em>RFID ✓</em></div>
              <div class="state-arrow"><i /><span>طلب</span></div>
              <div class="state-node"><span>03</span><small>READY</small><b>جاهز للصرف</b><em>QUOTA ✓</em></div>
              <div class="state-arrow"><i /><span>تشغيل</span></div>
              <div class="state-node state-running"><div class="pulse-ring" /><span>04</span><small>DISPENSING</small><b>ضخ وقياس</b><em>PUMP ON</em></div>
              <div class="state-arrow"><i /><span>الهدف</span></div>
              <div class="state-node state-done"><span>05</span><small>COMPLETE</small><b>إيقاف وتحديث</b><em>SAVED ✓</em></div>
            </div>
            <div class="logic-strip">
              <div><span>شرط البدء</span><code>verified && order.valid</code></div>
              <div><span>شرط الإيقاف</span><code>dispensed &gt;= requested</code></div>
              <div><span>الوضع الآمن</span><code>error → relay.off()</code></div>
            </div>
          </div>

          <!-- 09 / Measurement -->
          <div v-else-if="active === 8" class="slide-body measure-slide">
            <div class="measure-copy">
              <div class="slide-kicker"><span>08</span> القياس وإدارة الحصة</div>
              <h2>كل نبضة<br><em>لها قيمة.</em></h2>
              <p>حساس التدفق يولّد نبضات؛ يحولها المتحكم إلى كمية فعلية ويقارنها بالطلب حتى لحظة الإيقاف.</p>
              <div class="formula"><span>الكمية المصروفة</span><b>=</b><code>عدد النبضات ÷ معامل المعايرة</code></div>
            </div>
            <div class="live-meter">
              <div class="meter-head"><span>LIVE FLOW</span><b>قيد الصرف <i /></b></div>
              <div class="meter-value"><strong>8.40</strong><span>L</span></div>
              <div class="meter-target"><span>الهدف 12.00 L</span><b>70%</b></div>
              <div class="meter-bar"><i /></div>
              <div class="pulse-chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <small>PULSE COUNT / 1,764</small>
            </div>
            <div class="quota-card">
              <div class="quota-head"><span>منطق الحصة</span><b>200 L / شهر</b></div>
              <div class="quota-split"><div><span>داخل الحصة</span><strong>سعر مدعوم</strong><i class="green" /></div><div><span>بعد الحصة</span><strong>السعر العادي</strong><i /></div></div>
              <p>المتبقي يُرحّل للشهر التالي بحد أقصى <b>400 لتر</b>.</p>
            </div>
          </div>

          <!-- 10 / App -->
          <div v-else-if="active === 9" class="slide-body app-slide">
            <div class="section-head compact">
              <div><div class="slide-kicker"><span>09</span> واجهة التطبيق</div><h2>المستخدم يرى فقط<br><em>ما يحتاجه الآن.</em></h2></div>
              <p>واجهة عربية/إنجليزية تبدأ بالهوية وتنتهي بنتيجة واضحة.</p>
            </div>
            <div class="phone-gallery">
              <figure class="phone-frame phone-one"><div class="phone-speaker" /><img src="/media/app-login.png" alt="واجهة تسجيل الدخول"><figcaption><span>01</span><b>دخول آمن</b><small>حساب المستخدم</small></figcaption></figure>
              <figure class="phone-frame phone-two"><div class="phone-speaker" /><img src="/media/app-dashboard.png" alt="لوحة تحكم التطبيق"><figcaption><span>02</span><b>لوحة الحساب</b><small>الحصة والحالة</small></figcaption></figure>
              <figure class="phone-frame phone-three"><div class="phone-speaker" /><img src="/media/app-order.png" alt="واجهة إنشاء طلب الوقود"><figcaption><span>03</span><b>إنشاء الطلب</b><small>كمية + تكلفة</small></figcaption></figure>
              <div class="gallery-orbit orbit-left">AR</div><div class="gallery-orbit orbit-right">EN</div>
            </div>
            <div class="app-features"><span>حالة الاتصال</span><span>الرصيد والحصة</span><span>اختيار الكمية</span><span>استجابة فورية</span></div>
          </div>

          <!-- 11 / Results -->
          <div v-else-if="active === 10" class="slide-body results-slide">
            <div class="section-head compact">
              <div><div class="slide-kicker"><span>10</span> الاختبارات والنتائج</div><h2>المسار الكامل<br><em>عمل كوحدة واحدة.</em></h2></div>
              <div class="result-score"><strong>7/7</strong><span>وظائف أساسية ناجحة</span></div>
            </div>
            <div class="results-layout">
              <div class="test-grid">
                <div><span>01</span><b>اتصال Wi-Fi</b><i>✓</i></div>
                <div><span>02</span><b>قراءة RFID</b><i>✓</i></div>
                <div><span>03</span><b>مطابقة المستخدم</b><i>✓</i></div>
                <div><span>04</span><b>تشغيل المضخة</b><i>✓</i></div>
                <div><span>05</span><b>قراءة التدفق</b><i>✓</i></div>
                <div><span>06</span><b>الإيقاف عند الهدف</b><i>✓</i></div>
                <div><span>07</span><b>عرض TFT / UDP</b><i>✓</i></div>
                <div class="test-note"><span>ملاحظة</span><b>الدقة النهائية تعتمد على معايرة الحساس والمسار الميكانيكي.</b></div>
              </div>
              <div class="challenge-list">
                <div class="challenge-title"><span>تحديات التنفيذ</span><b>→ الحل</b></div>
                <div><span>تعارض RFID + TFT</span><b>تقسيم المهام على لوحتين</b></div>
                <div><span>ارتفاع استخدام الذاكرة</span><b>تبسيط الكود والمكتبات</b></div>
                <div><span>عدم ثبات الاتصال</span><b>تثبيت الشبكة وعناوين IP</b></div>
                <div><span>تذبذب قياس التدفق</span><b>معايرة معامل النبضات</b></div>
              </div>
            </div>
          </div>

          <!-- 12 / Conclusion -->
          <div v-else class="slide-body closing-slide">
            <div class="closing-top">
              <div class="slide-kicker"><span>11</span> الخلاصة والرؤية القادمة</div>
              <h2>من نموذج تعليمي<br>إلى <em>منظومة قابلة للتوسّع.</em></h2>
              <p>أثبت المشروع إمكانية دمج الهوية والطلب والتحكم والقياس والعرض في دورة صرف آلية واحدة.</p>
            </div>
            <div class="future-roadmap">
              <div><span>01</span><b>قاعدة بيانات سحابية</b><small>سجل ومزامنة فورية</small></div>
              <i />
              <div><span>02</span><b>محطات ومضخات متعددة</b><small>إدارة مركزية للمنظومة</small></div>
              <i />
              <div><span>03</span><b>أمان وتجهيزات صناعية</b><small>تشفير واعتماد ومعايرة</small></div>
            </div>
            <div class="thanks-block">
              <span>THANK YOU / شكراً</span>
              <h3>شكراً لحُسن استماعكم</h3>
              <p>نسعد بأسئلتكم وملاحظاتكم.</p>
            </div>
            <div class="closing-signature"><b>ميلاد سالم الجربوعي</b><i /> <b>سند مسعود أونيس</b><span>قسم التحكم الآلي · ربيع 2026</span></div>
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
