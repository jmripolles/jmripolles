// scenes.jsx — IES Maestrat animated video (revised)
//
// Palette anchored in the IES Maestrat logo: teal + green + warm brown on cream.

const PAL = {
  bg:      '#f4f1e8',   // cream
  bg2:     '#ece7d6',   // warmer cream
  bgSoft:  '#e4f1ec',   // misty teal tint
  ink:     '#1f3a3a',   // deep teal-ink
  ink2:    '#3a5555',
  muted:   '#6e7e7e',
  teal:    '#2f8a8a',   // primary accent (from logo)
  tealL:   '#6fb5ac',   // lighter teal
  green:   '#5ea34d',   // logo green
  greenL:  '#9ccb86',   // lighter green
  warm:    '#b07a50',   // warm brown figures from logo
  warmL:   '#d6a888',   // lighter warm
};

const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const LOGO = (typeof window !== 'undefined' && window.__resources && window.__resources.logoIes) || 'assets/logo-ies-maestrat.png';

// ──────────────────────────────────────────────────────────────────────────
// Shared building blocks
// ──────────────────────────────────────────────────────────────────────────

function AnimatedNumber({ target, start, end, suffix = '', size = 280, color = PAL.ink, x = 0, y = 0, align = 'center' }) {
  const time = useTime();
  const t = clamp((time - start) / (end - start), 0, 1);
  const eased = Easing.easeOutCubic(t);
  const value = Math.round(target * eased);
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translateX(${tx})`,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 0.95,
      letterSpacing: '-0.045em',
      color,
      fontVariantNumeric: 'tabular-nums',
    }}>
      {value}{suffix}
    </div>
  );
}

function DrawLine({ x, y, width, height = 2, color = PAL.ink, start, end }) {
  const time = useTime();
  const t = clamp((time - start) / (end - start), 0, 1);
  const eased = Easing.easeInOutCubic(t);
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: width * eased, height,
      background: color,
    }} />
  );
}

function Chrome({ dark = false }) {
  const c = dark ? 'rgba(244,241,232,0.55)' : 'rgba(31,58,58,0.55)';
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, right: 0,
      height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 60px',
      fontFamily: MONO, fontSize: 13, letterSpacing: '0.22em',
      color: c, textTransform: 'uppercase',
    }}>
      <div>IES MAESTRAT · SANT MATEU</div>
      <div>CICLES FORMATIUS · ADMINISTRACIÓ I GESTIÓ</div>
    </div>
  );
}

// Logo with subtle entry
function Logo({ x, y, size = 140, start = 0, sprite = true }) {
  if (sprite) {
    const { localTime } = useSprite();
    const t = clamp(localTime / 0.7, 0, 1);
    const eased = Easing.easeOutBack(t);
    return (
      <div style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size,
        opacity: t,
        transform: `scale(${0.7 + 0.3 * eased})`,
        transformOrigin: 'center',
      }}>
        <img src={LOGO} alt="IES Maestrat" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size, height: size }}>
      <img src={LOGO} alt="IES Maestrat" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 1 — Title (0–5s)
// ──────────────────────────────────────────────────────────────────────────
function Scene1() {
  const time = useTime();
  const drift = interpolate([0, 5], [0, -14], Easing.linear)(time);
  const scale = interpolate([0, 5], [1.0, 1.025], Easing.linear)(time);

  return (
    <Sprite start={0} end={5}>
      <div style={{
        position: 'absolute', inset: 0,
        background: PAL.bg,
        transform: `translateY(${drift}px) scale(${scale})`,
      }}>
        {/* soft teal wash */}
        <div style={{
          position:'absolute', inset:0,
          background: `radial-gradient(ellipse at 85% 15%, ${PAL.bgSoft}, transparent 55%)`,
        }} />
        {/* soft warm wash */}
        <div style={{
          position:'absolute', inset:0,
          background: `radial-gradient(ellipse at 10% 100%, ${PAL.bg2}, transparent 60%)`,
        }} />

        {/* Logo, top right — above the top line */}
        <Sprite start={0.2} end={4.8}>
          <Logo x={1620} y={40} size={140} />
        </Sprite>

        {/* grid lines */}
        <DrawLine x={120} y={200} width={1680} start={0.3} end={1.3} color={PAL.ink} height={1} />
        <DrawLine x={120} y={920} width={1680} start={0.4} end={1.4} color={PAL.ink} height={1} />

        {/* eyebrow */}
        <Sprite start={0.4} end={4.8}>
          <TextSprite
            text="CURS 2026 / 2027"
            x={120} y={230} size={20} color={PAL.teal} font={MONO} weight={600}
            letterSpacing="0.28em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Title */}
        <Sprite start={0.7} end={4.8}>
          <TextSprite
            text="Cicles formatius"
            x={120} y={340} size={164} color={PAL.ink} font={SANS} weight={800}
            letterSpacing="-0.035em" entryDur={0.7} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={1.0} end={4.8}>
          <TextSprite
            text="d'Administració"
            x={120} y={520} size={164} color={PAL.teal} font={SANS} weight={800}
            letterSpacing="-0.035em" entryDur={0.7} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={1.2} end={4.8}>
          <TextSprite
            text="i Gestió."
            x={120} y={700} size={164} color={PAL.green} font={SANS} weight={800}
            letterSpacing="-0.035em" entryDur={0.7} exitDur={0.3}
          />
        </Sprite>

        {/* caption */}
        <Sprite start={2.0} end={4.8}>
          <TextSprite
            text="CFGM en Gestió Administrativa  ·  CFGS en Administració i Finances  ·  2000 hores"
            x={120} y={960} size={28} color={PAL.ink2} font={MONO} weight={500}
            letterSpacing="0.06em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
      </div>
    </Sprite>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 2 — Stats (5–13s)
// ──────────────────────────────────────────────────────────────────────────
function Scene2() {
  return (
    <Sprite start={5} end={13}>
      <div style={{ position:'absolute', inset:0, background: '#eef5f1' }}>
        <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse at 20% 10%, #f4f1e8, transparent 55%)` }} />
        <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse at 85% 90%, #e4f1ec, transparent 55%)` }} />
        <Chrome />

        <Sprite start={5.1} end={12.9}>
          <TextSprite
            text="Per què estudiar un cicle formatiu?"
            x={120} y={140} size={62} color={PAL.ink} font={SANS} weight={600}
            letterSpacing="-0.02em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={5.3} end={12.9}>
          <TextSprite
            text="DADES OFICIALS · ESPANYA 2025"
            x={120} y={220} size={18} color={PAL.teal} font={MONO} weight={600}
            letterSpacing="0.24em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Stat 1 — 82% GS */}
        <Sprite start={5.8} end={12.9}>
          <div style={{
            position:'absolute', left:120, top:340, width:520, height:520,
            background: '#ffffff',
            borderRadius: 24,
            padding: '40px',
            boxShadow: '0 10px 30px rgba(31,58,58,0.06)',
            border: `1px solid ${PAL.teal}22`,
            fontFamily: SANS,
          }}>
            <StatCardContent
              label="OCUPABILITAT · GRAU SUPERIOR"
              target={82}
              start={5.9} end={7.2}
              accent={PAL.teal}
              desc={"Titulats amb feina\nal mercat laboral."}
            />
          </div>
        </Sprite>

        {/* Stat 2 — 70% GM */}
        <Sprite start={7.1} end={12.9}>
          <div style={{
            position:'absolute', left:700, top:340, width:520, height:520,
            background: '#ffffff',
            borderRadius: 24,
            padding: '40px',
            boxShadow: '0 10px 30px rgba(31,58,58,0.06)',
            border: `1px solid ${PAL.green}22`,
            fontFamily: SANS,
          }}>
            <StatCardContent
              label="OCUPABILITAT · GRAU MITJÀ"
              target={70}
              start={7.2} end={8.5}
              accent={PAL.green}
              desc={"Titulats amb feina\nal mercat laboral."}
            />
          </div>
        </Sprite>

        {/* Stat 3 — 14% family */}
        <Sprite start={8.4} end={12.9}>
          <div style={{
            position:'absolute', left:1280, top:340, width:520, height:520,
            background: '#ffffff',
            borderRadius: 24,
            padding: '40px',
            boxShadow: '0 10px 30px rgba(31,58,58,0.06)',
            border: `1px solid ${PAL.warm}22`,
            fontFamily: SANS,
          }}>
            <StatCardContent
              label="FAMÍLIA · ADMINISTRACIÓ I GESTIÓ"
              target={14}
              start={8.5} end={9.8}
              accent={PAL.warm}
              desc={"De l'alumnat de cicles\nl'escull a Espanya."}
            />
          </div>
        </Sprite>

        {/* Footnote */}
        <Sprite start={10.2} end={12.9}>
          <TextSprite
            text="→ un sector amb feina, demanda i futur."
            x={120} y={940} size={36} color={PAL.teal} font={SANS} weight={500}
            letterSpacing="-0.01em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
      </div>
    </Sprite>
  );
}

function StatCardContent({ label, target, start, end, accent, desc }) {
  return (
    <div style={{ height: '100%', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div>
        <div style={{ width: 56, height: 4, background: accent, marginBottom: 24, borderRadius: 2 }} />
        <div style={{ fontFamily: MONO, fontSize: 15, color: accent, letterSpacing:'0.18em', fontWeight: 600, marginBottom: 20 }}>
          {label}
        </div>
      </div>
      <div style={{ position:'relative', flex: 1, display:'flex', alignItems:'center' }}>
        <AnimatedNumber target={target} start={start} end={end} suffix="%" size={190} color={PAL.ink} x={0} y={-10} align="left" />
      </div>
      <div style={{ fontSize: 26, color: PAL.ink2, fontWeight: 400, lineHeight: 1.35, whiteSpace:'pre-line' }}>
        {desc}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 3 — Two paths intro (13–17s)
// ──────────────────────────────────────────────────────────────────────────
function Scene3() {
  return (
    <Sprite start={13} end={17}>
      <div style={{ position:'absolute', inset:0, background: PAL.bg }}>
        <Chrome />

        <Sprite start={13.1} end={16.9}>
          <TextSprite
            text="Dos itineraris."
            x={120} y={340} size={160} color={PAL.ink} font={SANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.6} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={13.5} end={16.9}>
          <TextSprite
            text="Una mateixa destinació: la teua carrera professional."
            x={120} y={540} size={44} color={PAL.ink2} font={SANS} weight={400}
            letterSpacing="-0.01em" entryDur={0.6} exitDur={0.3}
          />
        </Sprite>

        <Sprite start={14.4} end={16.9}>
          <PathPill x={120} y={760} text="CFGM en Gestió Administrativa" color={PAL.bg} bg={PAL.green} />
        </Sprite>
        <Sprite start={14.8} end={16.9}>
          <PathPill x={760} y={760} text="CFGS en Administració i Finances" color={PAL.bg} bg={PAL.teal} />
        </Sprite>
      </div>
    </Sprite>
  );
}

function PathPill({ x, y, text, color, bg }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.5, 0, 1);
  const eased = Easing.easeOutBack(t);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      padding:'22px 40px',
      background: bg,
      borderRadius: 100,
      fontFamily: SANS, fontSize: 30, fontWeight: 600, color,
      opacity: t,
      transform: `translateY(${(1-eased)*16}px) scale(${0.9 + 0.1*eased})`,
      transformOrigin: 'left center',
      boxShadow: '0 8px 24px rgba(31,58,58,0.12)',
    }}>{text}</div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Module list (shared)
// ──────────────────────────────────────────────────────────────────────────
function ModuleList({ items, x, y, width, start, labelColor, dark = false }) {
  return (
    <div style={{ position:'absolute', left:x, top:y, width }}>
      {items.map((item, i) => (
        <Sprite key={i} start={start + i * 0.08} end={99}>
          <ModuleRow item={item} labelColor={labelColor} dark={dark} />
        </Sprite>
      ))}
    </div>
  );
}

function ModuleRow({ item, labelColor, dark }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.5, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const textColor = dark ? PAL.bg : PAL.ink;
  const borderColor = dark ? 'rgba(244,241,232,0.16)' : `${PAL.ink}1a`;
  return (
    <div style={{
      position:'relative',
      display:'flex', alignItems:'baseline', gap: 14,
      padding: '7px 0',
      borderBottom: `1px solid ${borderColor}`,
      opacity: eased,
      transform: `translateX(${(1-eased) * 16}px)`,
      fontFamily: SANS,
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 14, color: labelColor,
        width: 78, flexShrink: 0, letterSpacing: '0.04em', fontWeight: 600,
      }}>{item.code}</div>
      <div style={{ fontSize: 18, color: textColor, fontWeight: 500, lineHeight: 1.25 }}>{item.name}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 4 — Grau Mitjà (17–28s)
// ──────────────────────────────────────────────────────────────────────────
function Scene4() {
  const gm1 = [
    { code: '0156', name: 'Anglés professional GM' },
    { code: '0437', name: 'Comunicació empresarial i atenció al client' },
    { code: '0438', name: 'Operacions administratives de compravenda' },
    { code: '0439', name: 'Empresa i administració' },
    { code: '0440', name: 'Tractament informàtic de la informació' },
    { code: '0441', name: 'Tècnica comptable' },
    { code: 'CV0014', name: 'Aprofundiment Anglés Professional GM' },
    { code: '1709', name: "Itinerari personal per a l'ocupabilitat I" },
  ];
  const gm2 = [
    { code: '0442', name: 'Operacions administratives de recursos humans' },
    { code: '0443', name: 'Tractament de la documentació comptable' },
    { code: '0446', name: "Empresa en l'aula" },
    { code: '0448', name: 'Operacions auxiliars de gestió de tresoreria' },
    { code: '1710', name: "Itinerari personal per a l'ocupabilitat II" },
    { code: 'CV0PM001', name: 'Mòdul optatiu' },
    { code: '1708001', name: 'Sostenibilitat aplicada al sistema productiu GM' },
    { code: '1664001', name: 'Digitalització aplicada al sistema productiu GM' },
    { code: '1713472', name: 'Projecte intermodular' },
  ];

  return (
    <Sprite start={17} end={28}>
      <div style={{ position:'absolute', inset:0, background: PAL.bg }}>
        <Chrome />

        <Sprite start={17.1} end={27.9}>
          <TextSprite
            text="01 / CFGM"
            x={120} y={140} size={22} color={PAL.green} font={MONO} weight={700}
            letterSpacing="0.24em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={17.3} end={27.9}>
          <TextSprite
            text="Tècnic en"
            x={120} y={200} size={92} color={PAL.ink} font={SANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={17.5} end={27.9}>
          <TextSprite
            text="Gestió"
            x={120} y={310} size={92} color={PAL.ink} font={SANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={17.7} end={27.9}>
          <TextSprite
            text="Administrativa"
            x={120} y={420} size={92} color={PAL.green} font={SANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Stats strip */}
        <Sprite start={18.4} end={27.9}>
          <StatPill x={120} y={620} label="DURADA" value="2000 h" />
          <StatPill x={340} y={620} label="EMPRESA" value="500 h" />
          <StatPill x={560} y={620} label="CURSOS" value="2" />
        </Sprite>

        <Sprite start={19.0} end={27.9}>
          <TextSprite
            text={"Accés directe al mercat laboral,\nla funció pública i a cicles\nformatius de grau superior."}
            x={120} y={780} size={24} color={PAL.ink2} font={SANS} weight={400}
            letterSpacing="-0.01em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Right: modules */}
        <Sprite start={18.8} end={27.9}>
          <TextSprite
            text="PRIMER CURS"
            x={920} y={140} size={18} color={PAL.green} font={MONO} weight={700}
            letterSpacing="0.22em" entryDur={0.4} exitDur={0.3}
          />
          <div style={{ position:'absolute', left:920, top:170, width:440, height:2, background:PAL.green }} />
          <ModuleList items={gm1} x={920} y={190} width={440} start={19.2} labelColor={PAL.green} />

          <TextSprite
            text="SEGON CURS"
            x={1420} y={140} size={18} color={PAL.green} font={MONO} weight={700}
            letterSpacing="0.22em" entryDur={0.4} exitDur={0.3}
          />
          <div style={{ position:'absolute', left:1420, top:170, width:440, height:2, background:PAL.green }} />
          <ModuleList items={gm2} x={1420} y={190} width={440} start={20.0} labelColor={PAL.green} />
        </Sprite>
      </div>
    </Sprite>
  );
}

function StatPill({ x, y, label, value, dark = false }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.5, 0, 1);
  const labelColor = dark ? PAL.tealL : PAL.muted;
  const valueColor = dark ? PAL.bg : PAL.ink;
  const borderColor = dark ? PAL.bg : PAL.ink;
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      width: 200,
      padding: '14px 0',
      borderTop: `2px solid ${borderColor}`,
      opacity: t,
      transform: `translateY(${(1-t)*12}px)`,
      fontFamily: SANS,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 12, color: labelColor, letterSpacing: '0.18em', fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 48, fontWeight: 800, color: valueColor, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 5 — Grau Superior (28–40s)
// ──────────────────────────────────────────────────────────────────────────
function Scene5() {
  const gs1 = [
    { code: '0179', name: 'Anglés professional GS' },
    { code: '0647', name: 'Gestió de la documentació jurídica i empresarial' },
    { code: '0648', name: 'Recursos humans i responsabilitat social corporativa' },
    { code: '0649', name: 'Ofimàtica i procés de la informació' },
    { code: '0650', name: "Procés integral de l'activitat comercial" },
    { code: '0651', name: 'Comunicació i atenció al client' },
    { code: 'CV0015', name: 'Aprofundiment Anglés Professional GS' },
    { code: '1709', name: "Itinerari personal per a l'ocupabilitat I" },
    { code: '0657p', name: "Projecte intermodular d'administració i finances" },
  ];
  const gs2 = [
    { code: '0652', name: 'Gestió de recursos humans' },
    { code: '0653', name: 'Gestió financera' },
    { code: '0654', name: 'Comptabilitat i fiscalitat' },
    { code: '0655', name: 'Gestió logística i comercial' },
    { code: '0656', name: 'Simulació empresarial' },
    { code: '1710', name: "Itinerari personal per a l'ocupabilitat II" },
    { code: '0657', name: "Projecte intermodular d'administració i finances" },
    { code: 'CVOPS001', name: 'Mòdul optatiu' },
    { code: '1665001', name: 'Digitalització aplicada al sistema productiu GS' },
    { code: '1708001', name: 'Sostenibilitat aplicada al sistema productiu GS' },
  ];

  return (
    <Sprite start={28} end={40}>
      <div style={{ position:'absolute', inset:0, background: '#e8efe9' }}>
        <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse at 10% 100%, rgba(111,181,172,0.22), transparent 55%)` }} />
        <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse at 90% 0%, rgba(214,168,136,0.18), transparent 55%)` }} />

        <Chrome />

        <Sprite start={28.1} end={39.9}>
          <TextSprite
            text="02 / CFGS"
            x={120} y={140} size={22} color={PAL.teal} font={MONO} weight={700}
            letterSpacing="0.24em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={28.3} end={39.9}>
          <TextSprite
            text="Tècnic Superior en"
            x={120} y={200} size={80} color={PAL.ink} font={SANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={28.5} end={39.9}>
          <TextSprite
            text="Administració"
            x={120} y={300} size={88} color={PAL.ink} font={SANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={28.7} end={39.9}>
          <TextSprite
            text="i Finances"
            x={120} y={405} size={88} color={PAL.teal} font={SANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Stats strip */}
        <Sprite start={29.4} end={39.9}>
          <StatPill x={120} y={610} label="DURADA" value="2000 h" />
          <StatPill x={340} y={610} label="EMPRESA" value="500 h" />
          <StatPill x={560} y={610} label="CURSOS" value="2" />
        </Sprite>

        <Sprite start={30.0} end={39.9}>
          <TextSprite
            text={"Accés a la universitat,\nal mercat laboral i a la funció\npública — inclús a l'estranger."}
            x={120} y={770} size={24} color={PAL.ink2} font={SANS} weight={400}
            letterSpacing="-0.01em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Right: modules */}
        <Sprite start={29.8} end={39.9}>
          <TextSprite
            text="PRIMER CURS"
            x={920} y={140} size={18} color={PAL.teal} font={MONO} weight={700}
            letterSpacing="0.22em" entryDur={0.4} exitDur={0.3}
          />
          <div style={{ position:'absolute', left:920, top:170, width:440, height:2, background:PAL.teal }} />
          <ModuleList items={gs1} x={920} y={190} width={440} start={30.2} labelColor={PAL.teal} />

          <TextSprite
            text="SEGON CURS"
            x={1420} y={140} size={18} color={PAL.teal} font={MONO} weight={700}
            letterSpacing="0.22em" entryDur={0.4} exitDur={0.3}
          />
          <div style={{ position:'absolute', left:1420, top:170, width:440, height:2, background:PAL.teal }} />
          <ModuleList items={gs2} x={1420} y={190} width={440} start={31.0} labelColor={PAL.teal} />
        </Sprite>
      </div>
    </Sprite>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 6 — Per què l'IES Maestrat? (40–54s)
// ──────────────────────────────────────────────────────────────────────────
function Scene6() {
  const pillars = [
    { num:'01', title:'+150 empreses', body:"col·laboradores per a la Formació a l'Empresa." },
    { num:'02', title:'Horari de matí', body:'dilluns a divendres, de 08:10 a 14:05.' },
    { num:'03', title:'Erasmus+', body:"pràctiques a l'estranger al grau superior." },
    { num:'04', title:'Instal·lacions modernes', body:'Odoo, A3Innuva, Aplifisa, DelSol i pantalles digitals.' },
    { num:'05', title:'Borsa de treball', body:"pont directe amb el teixit empresarial de la comarca." },
    { num:'06', title:'Ràtios baixes', body:'ensenyament personalitzat i atenció individualitzada.' },
  ];

  return (
    <Sprite start={40} end={54}>
      <div style={{ position:'absolute', inset:0, background: PAL.bgSoft }}>
        <Chrome />

        <Sprite start={40.1} end={53.9}>
          <TextSprite
            text="03 / Per què"
            x={120} y={140} size={22} color={PAL.teal} font={MONO} weight={700}
            letterSpacing="0.24em" entryDur={0.4} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={40.3} end={53.9}>
          <TextSprite
            text="L'IES Maestrat."
            x={120} y={195} size={138} color={PAL.ink} font={SANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.6} exitDur={0.3}
          />
        </Sprite>

        {/* 3x2 grid of pillars */}
        <div style={{ position:'absolute', left: 120, top: 420, width: 1680 }}>
          {pillars.map((p, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = col * 570;
            const y = row * 300;
            const start = 41 + i * 0.45;
            return (
              <Sprite key={i} start={start} end={53.9}>
                <PillarCard p={p} x={x} y={y} />
              </Sprite>
            );
          })}
        </div>
      </div>
    </Sprite>
  );
}

function PillarCard({ p, x, y }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.6, 0, 1);
  const eased = Easing.easeOutCubic(t);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      width: 520,
      height: 270,
      padding: 32,
      background: '#ffffff',
      borderRadius: 20,
      boxShadow: '0 8px 24px rgba(31,58,58,0.06)',
      border: `1px solid ${PAL.teal}18`,
      opacity: eased,
      transform: `translateY(${(1-eased)*20}px)`,
      fontFamily: SANS,
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 14, color: PAL.teal, letterSpacing:'0.22em', fontWeight: 700,
        marginBottom: 12,
      }}>{p.num}</div>
      <div style={{ width: 44, height: 3, background: PAL.green, marginBottom: 18, borderRadius: 2 }} />
      <div style={{ fontSize: 40, fontWeight: 800, color: PAL.ink, letterSpacing:'-0.02em', lineHeight: 1.05, marginBottom: 14 }}>
        {p.title}
      </div>
      <div style={{ fontSize: 20, color: PAL.ink2, fontWeight: 400, lineHeight: 1.4 }}>
        {p.body}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Admission callout (blinking) for Scene 7
// ──────────────────────────────────────────────────────────────────────────
function AdmissionCallout({ x, y }) {
  const time = useTime();
  const { localTime } = useSprite();
  const entry = clamp(localTime / 0.5, 0, 1);
  const blink = 0.78 + 0.22 * Math.sin(time * Math.PI * 2 / 0.9);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      transform:`translateX(-50%) translateY(${(1-entry)*12}px)`,
      opacity: entry,
      width: 880,
      background: PAL.warm,
      borderRadius: 18,
      padding: '18px 32px',
      textAlign:'center',
      boxShadow: `0 0 ${24 + 18*blink}px ${PAL.warm}66, 0 8px 22px rgba(31,58,58,0.12)`,
      border: `3px solid ${PAL.ink}`,
      fontFamily: SANS,
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 16, color: '#fff',
        letterSpacing:'0.22em', fontWeight:700, marginBottom: 6,
        opacity: blink,
      }}>
        PROCÉS D'ADMISSIÓ
      </div>
      <div style={{
        fontSize: 34, color:'#fff', fontWeight: 800, letterSpacing:'-0.01em',
        lineHeight: 1.15,
        opacity: blink,
      }}>
        Del 23 de maig al 2 de juny
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 7 — Contact + Logo (54–62s)
// ──────────────────────────────────────────────────────────────────────────
function Scene7() {
  const time = useTime();
  const scale = interpolate([54, 62], [1.0, 1.03], Easing.linear)(time);
  return (
    <Sprite start={54} end={62}>
      <div style={{
        position:'absolute', inset:0,
        background: PAL.bg,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}>
        <div style={{
          position:'absolute', inset:0,
          background: `radial-gradient(ellipse at 50% 120%, ${PAL.bgSoft}, transparent 60%)`,
        }}/>

        {/* Logo centered large */}
        <Sprite start={54.1} end={61.9}>
          <Logo x={860} y={100} size={200} />
        </Sprite>

        <Sprite start={54.7} end={61.9}>
          <TextSprite
            text="T'estem esperant."
            x={960} y={340} size={130} color={PAL.ink} font={SANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.7} exitDur={0.3} align="center"
          />
        </Sprite>
        <Sprite start={55.2} end={61.9}>
          <TextSprite
            text="Tria el teu itinerari. Comença la teua carrera."
            x={960} y={490} size={32} color={PAL.ink2} font={SANS} weight={400}
            letterSpacing="-0.01em" entryDur={0.5} exitDur={0.3} align="center"
          />
        </Sprite>

        {/* Admission callout — highlighted & blinking */}
        <Sprite start={55.5} end={61.9}>
          <AdmissionCallout x={960} y={560} />
        </Sprite>

        {/* Three contact blocks */}
        <Sprite start={55.8} end={61.9}>
          <ContactBlock x={120} y={700} label="CONTACTE" lines={[
            "Camí Font de Morella, 2",
            "12.170 · Sant Mateu (Castelló)",
          ]} accent={PAL.teal} />
        </Sprite>
        <Sprite start={56.1} end={61.9}>
          <ContactBlock x={760} y={700} label="TELÈFON · CORREU" lines={[
            "964 33 60 90",
            "12004400@edu.gva.es",
          ]} accent={PAL.green} />
        </Sprite>
        <Sprite start={56.4} end={61.9}>
          <ContactBlock x={1400} y={700} label="WEB · XARXES" lines={[
            "portal.edu.gva.es/iesmaestrat",
            "@iesmaestrat",
          ]} accent={PAL.warm} />
        </Sprite>

        {/* Institutional logos row */}
        <Sprite start={56.8} end={61.9}>
          <InstLogoRow />
        </Sprite>
      </div>
    </Sprite>
  );
}

function InstLogoRow() {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.7, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const R = (typeof window !== 'undefined' && window.__resources) || {};
  const logos = [
    { src: R.erasmus || 'assets/erasmus.png', label: 'Erasmus+' },
    { src: R.gva     || 'assets/gva.svg',     label: 'Generalitat Valenciana' },
    { src: R.fpcv    || 'assets/fpcv.jpg',    label: 'FP Comunitat Valenciana' },
  ];
  const LOGO_H = 160;
  const LOGO_W = 340;
  return (
    <div style={{
      position:'absolute', left: 0, right: 0, top: 880,
      display:'flex', alignItems:'center', justifyContent:'center', gap: 80,
      opacity: eased,
      transform: `translateY(${(1-eased)*14}px)`,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing:'0.22em', color: PAL.muted, fontWeight:600, textTransform:'uppercase', marginRight: 24 }}>
        Amb el suport de
      </div>
      {logos.map((l, i) => (
        <div key={i} style={{
          height: LOGO_H, width: LOGO_W,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <img src={l.src} alt={l.label}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }} />
        </div>
      ))}
    </div>
  );
}

function ContactBlock({ x, y, label, lines, accent }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.5, 0, 1);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      width: 460,
      fontFamily: SANS,
      opacity: t,
      transform: `translateY(${(1-t)*12}px)`,
    }}>
      <div style={{ fontFamily: MONO, fontSize: 13, color: accent, letterSpacing:'0.24em', fontWeight:700, marginBottom: 12 }}>{label}</div>
      <div style={{ width: 56, height: 3, background: accent, marginBottom: 18, borderRadius: 2 }} />
      {lines.map((line, i) => (
        <div key={i} style={{ fontSize: 22, fontWeight: 500, color: PAL.ink, lineHeight: 1.6 }}>{line}</div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Timestamp updater
// ──────────────────────────────────────────────────────────────────────────
function TimeLabel() {
  const time = useTime();
  React.useEffect(() => {
    const root = document.querySelector('[data-video-root]');
    if (root) {
      const sec = Math.floor(time);
      root.setAttribute('data-screen-label', `t=${sec}s`);
    }
  }, [Math.floor(time)]);
  return null;
}

Object.assign(window, {
  Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7,
  TimeLabel, PAL, SANS, MONO,
});
