// scenes.vertical.jsx — IES Maestrat vertical reel 1080×1920
// Adapted from scenes.jsx. Canvas: 1080 wide, 1920 tall. Duration: 62s.

const VPAL = {
  bg:      '#f4f1e8',
  bg2:     '#ece7d6',
  bgSoft:  '#e4f1ec',
  ink:     '#1f3a3a',
  ink2:    '#3a5555',
  muted:   '#6e7e7e',
  teal:    '#2f8a8a',
  tealL:   '#6fb5ac',
  green:   '#5ea34d',
  greenL:  '#9ccb86',
  warm:    '#b07a50',
  warmL:   '#d6a888',
};

const VSANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const VMONO = "'JetBrains Mono', ui-monospace, monospace";

const VLOGO = 'assets/logo-ies-maestrat.png';

// ──────────────────────────────────────────────────────────────────────────
// Shared building blocks (vertical)
// ──────────────────────────────────────────────────────────────────────────

function VAnimatedNumber({ target, start, end, suffix = '', size = 280, color = VPAL.ink, x = 0, y = 0, align = 'center' }) {
  const time = useTime();
  const t = clamp((time - start) / (end - start), 0, 1);
  const eased = Easing.easeOutCubic(t);
  const value = Math.round(target * eased);
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translateX(${tx})`,
      fontFamily: VSANS, fontWeight: 800, fontSize: size,
      lineHeight: 1, letterSpacing: '-0.045em', color,
      fontVariantNumeric: 'tabular-nums',
      display: 'flex', alignItems: 'baseline',
    }}>
      <span>{value}</span><span style={{ fontSize: size * 0.55 }}>{suffix}</span>
    </div>
  );
}

function VDrawLine({ x, y, width, height = 2, color = VPAL.ink, start, end }) {
  const time = useTime();
  const t = clamp((time - start) / (end - start), 0, 1);
  const eased = Easing.easeInOutCubic(t);
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: width * eased, height, background: color,
    }} />
  );
}

function VChrome({ dark = false }) {
  const c = dark ? 'rgba(244,241,232,0.55)' : 'rgba(31,58,58,0.55)';
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, right: 0,
      height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 50px',
      fontFamily: VMONO, fontSize: 18, letterSpacing: '0.22em',
      color: c, textTransform: 'uppercase',
    }}>
      <div>IES MAESTRAT</div>
      <div>SANT MATEU</div>
    </div>
  );
}

function VLogoSprite({ x, y, size = 200 }) {
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
      <img src={VLOGO} alt="IES Maestrat" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 1 — Title (0–5s)
// ──────────────────────────────────────────────────────────────────────────
function VScene1() {
  const time = useTime();
  const drift = interpolate([0, 5], [0, -20], Easing.linear)(time);
  const scale = interpolate([0, 5], [1.0, 1.025], Easing.linear)(time);

  return (
    <Sprite start={0} end={5}>
      <div style={{
        position: 'absolute', inset: 0,
        background: VPAL.bg,
        transform: `translateY(${drift}px) scale(${scale})`,
      }}>
        <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse at 85% 15%, ${VPAL.bgSoft}, transparent 55%)` }} />
        <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse at 10% 100%, ${VPAL.bg2}, transparent 60%)` }} />

        {/* Logo top center */}
        <Sprite start={0.2} end={4.8}>
          <VLogoSprite x={390} y={200} size={300} />
        </Sprite>

        {/* grid lines */}
        <VDrawLine x={80} y={600} width={920} start={0.3} end={1.3} color={VPAL.ink} height={1} />
        <VDrawLine x={80} y={1680} width={920} start={0.4} end={1.4} color={VPAL.ink} height={1} />

        {/* eyebrow */}
        <Sprite start={0.4} end={4.8}>
          <TextSprite
            text="CURS 2026 / 2027"
            x={80} y={640} size={30} color={VPAL.teal} font={VMONO} weight={600}
            letterSpacing="0.28em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Title stacked */}
        <Sprite start={0.7} end={4.8}>
          <TextSprite
            text="Cicles"
            x={80} y={770} size={170} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.035em" entryDur={0.7} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={0.9} end={4.8}>
          <TextSprite
            text="formatius"
            x={80} y={940} size={170} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.035em" entryDur={0.7} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={1.1} end={4.8}>
          <TextSprite
            text="d'Administració"
            x={80} y={1160} size={116} color={VPAL.teal} font={VSANS} weight={800}
            letterSpacing="-0.035em" entryDur={0.7} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={1.3} end={4.8}>
          <TextSprite
            text="i Gestió."
            x={80} y={1300} size={170} color={VPAL.green} font={VSANS} weight={800}
            letterSpacing="-0.035em" entryDur={0.7} exitDur={0.3}
          />
        </Sprite>

        {/* caption multi-line */}
        <Sprite start={2.0} end={4.8}>
          <TextSprite
            text={"CFGM en Gestió Administrativa\nCFGS en Administració i Finances\n2000 hores · Sant Mateu"}
            x={80} y={1720} size={30} color={VPAL.ink2} font={VMONO} weight={500}
            letterSpacing="0.06em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
      </div>
    </Sprite>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 2 — Stats (5–13s) — cards stacked vertically
// ──────────────────────────────────────────────────────────────────────────
function VScene2() {
  return (
    <Sprite start={5} end={13}>
      <div style={{ position:'absolute', inset:0, background: '#eef5f1' }}>
        <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse at 20% 10%, #f4f1e8, transparent 55%)` }} />
        <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse at 85% 90%, #e4f1ec, transparent 55%)` }} />
        <VChrome />

        <Sprite start={5.1} end={12.9}>
          <TextSprite
            text={"Per què estudiar\nun cicle formatiu?"}
            x={80} y={150} size={90} color={VPAL.ink} font={VSANS} weight={700}
            letterSpacing="-0.025em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={5.3} end={12.9}>
          <TextSprite
            text="DADES OFICIALS · ESPANYA 2025"
            x={80} y={360} size={22} color={VPAL.teal} font={VMONO} weight={600}
            letterSpacing="0.24em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Stat 1 — 82% GS */}
        <Sprite start={5.8} end={12.9}>
          <VStatCard
            x={80} y={440}
            accent={VPAL.teal}
            label="OCUPABILITAT · GRAU SUPERIOR"
            target={82}
            animStart={5.9} animEnd={7.2}
            desc="Titulats amb feina al mercat laboral."
          />
        </Sprite>
        {/* Stat 2 — 70% GM */}
        <Sprite start={7.1} end={12.9}>
          <VStatCard
            x={80} y={850}
            accent={VPAL.green}
            label="OCUPABILITAT · GRAU MITJÀ"
            target={70}
            animStart={7.2} animEnd={8.5}
            desc="Titulats amb feina al mercat laboral."
          />
        </Sprite>
        {/* Stat 3 — 14% family */}
        <Sprite start={8.4} end={12.9}>
          <VStatCard
            x={80} y={1260}
            accent={VPAL.warm}
            label="FAMÍLIA · ADMINISTRACIÓ I GESTIÓ"
            target={14}
            animStart={8.5} animEnd={9.8}
            desc="De l'alumnat de cicles l'escull a Espanya."
          />
        </Sprite>

        {/* Footnote */}
        <Sprite start={10.2} end={12.9}>
          <TextSprite
            text={"→ un sector amb feina,\ndemanda i futur."}
            x={80} y={1740} size={42} color={VPAL.teal} font={VSANS} weight={500}
            letterSpacing="-0.01em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
      </div>
    </Sprite>
  );
}

function VStatCard({ x, y, accent, label, target, animStart, animEnd, desc }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.5, 0, 1);
  const eased = Easing.easeOutCubic(t);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      width: 920, height: 380,
      background: '#ffffff',
      borderRadius: 28,
      padding: '32px 44px',
      boxShadow: '0 10px 30px rgba(31,58,58,0.06)',
      border: `1px solid ${accent}22`,
      fontFamily: VSANS,
      opacity: eased,
      transform: `translateY(${(1-eased)*20}px)`,
      display:'flex', flexDirection:'column',
    }}>
      <div style={{ width: 64, height: 4, background: accent, marginBottom: 16, borderRadius: 2 }} />
      <div style={{ fontFamily: VMONO, fontSize: 17, color: accent, letterSpacing:'0.18em', fontWeight:600, marginBottom: 18 }}>
        {label}
      </div>
      <div style={{ position:'relative', height: 150, marginBottom: 20 }}>
        <VAnimatedNumber target={target} start={animStart} end={animEnd} suffix="%" size={140} color={VPAL.ink} x={0} y={10} align="left" />
      </div>
      <div style={{ fontSize: 26, color: VPAL.ink2, fontWeight: 400, lineHeight: 1.35 }}>
        {desc}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 3 — Two paths intro (13–17s)
// ──────────────────────────────────────────────────────────────────────────
function VScene3() {
  return (
    <Sprite start={13} end={17}>
      <div style={{ position:'absolute', inset:0, background: VPAL.bg }}>
        <VChrome />

        <Sprite start={13.05} end={16.9}>
          <TextSprite
            text="02"
            x={80} y={500} size={52} color={VPAL.teal} font={VMONO} weight={700}
            letterSpacing="0.2em" entryDur={0.4} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={13.1} end={16.9}>
          <TextSprite
            text="Dos"
            x={80} y={590} size={230} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.04em" entryDur={0.6} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={13.3} end={16.9}>
          <TextSprite
            text="itineraris."
            x={80} y={820} size={180} color={VPAL.green} font={VSANS} weight={800}
            letterSpacing="-0.035em" entryDur={0.6} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={13.7} end={16.9}>
          <TextSprite
            text={"Una mateixa destinació:\nla teua carrera professional."}
            x={80} y={1060} size={52} color={VPAL.ink2} font={VSANS} weight={400}
            letterSpacing="-0.01em" entryDur={0.6} exitDur={0.3}
          />
        </Sprite>

        <Sprite start={14.4} end={16.9}>
          <VPathPill x={80} y={1340} text="CFGM en Gestió Administrativa" color={VPAL.bg} bg={VPAL.green} />
        </Sprite>
        <Sprite start={14.8} end={16.9}>
          <VPathPill x={80} y={1480} text="CFGS en Administració i Finances" color={VPAL.bg} bg={VPAL.teal} />
        </Sprite>
      </div>
    </Sprite>
  );
}

function VPathPill({ x, y, text, color, bg }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.5, 0, 1);
  const eased = Easing.easeOutBack(t);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      padding:'28px 48px',
      background: bg,
      borderRadius: 100,
      fontFamily: VSANS, fontSize: 40, fontWeight: 600, color,
      opacity: t,
      transform: `translateY(${(1-eased)*16}px) scale(${0.9 + 0.1*eased})`,
      transformOrigin: 'left center',
      boxShadow: '0 8px 24px rgba(31,58,58,0.12)',
      display: 'inline-block',
    }}>{text}</div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Vertical module list (single column)
// ──────────────────────────────────────────────────────────────────────────
function VModuleList({ items, x, y, width, start, labelColor }) {
  return (
    <div style={{ position:'absolute', left:x, top:y, width }}>
      {items.map((item, i) => (
        <Sprite key={i} start={start + i * 0.06} end={99}>
          <VModuleRow item={item} labelColor={labelColor} />
        </Sprite>
      ))}
    </div>
  );
}

function VModuleRow({ item, labelColor }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.5, 0, 1);
  const eased = Easing.easeOutCubic(t);
  return (
    <div style={{
      position:'relative',
      display:'flex', alignItems:'baseline', gap: 16,
      padding: '10px 0',
      borderBottom: `1px solid ${VPAL.ink}1a`,
      opacity: eased,
      transform: `translateX(${(1-eased) * 16}px)`,
      fontFamily: VSANS,
    }}>
      <div style={{
        fontFamily: VMONO, fontSize: 20, color: labelColor,
        width: 130, flexShrink: 0, letterSpacing: '0.04em', fontWeight: 600,
      }}>{item.code}</div>
      <div style={{ fontSize: 26, color: VPAL.ink, fontWeight: 500, lineHeight: 1.25 }}>{item.name}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 4 — Grau Mitjà (17–28s)
// ──────────────────────────────────────────────────────────────────────────
function VScene4() {
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
      <div style={{ position:'absolute', inset:0, background: VPAL.bg }}>
        <VChrome />

        <Sprite start={17.1} end={27.9}>
          <TextSprite
            text="01 / CFGM"
            x={80} y={130} size={26} color={VPAL.green} font={VMONO} weight={700}
            letterSpacing="0.24em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={17.3} end={27.9}>
          <TextSprite
            text="Tècnic en"
            x={80} y={200} size={80} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={17.5} end={27.9}>
          <TextSprite
            text="Gestió"
            x={80} y={310} size={110} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={17.7} end={27.9}>
          <TextSprite
            text="Administrativa"
            x={80} y={440} size={104} color={VPAL.green} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Stats strip */}
        <Sprite start={18.4} end={27.9}>
          <VStatPill x={80}  y={620} label="DURADA"   value="2000 h" />
          <VStatPill x={400} y={620} label="EMPRESA"  value="500 h" />
          <VStatPill x={720} y={620} label="CURSOS"   value="2" />
        </Sprite>

        <Sprite start={19.0} end={27.9}>
          <TextSprite
            text={"Accés directe al mercat laboral,\nla funció pública i a cicles\nformatius de grau superior."}
            x={80} y={780} size={30} color={VPAL.ink2} font={VSANS} weight={400}
            letterSpacing="-0.01em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        {/* Two columns of modules side by side */}
        <Sprite start={18.8} end={27.9}>
          <TextSprite
            text="PRIMER CURS"
            x={80} y={980} size={20} color={VPAL.green} font={VMONO} weight={700}
            letterSpacing="0.22em" entryDur={0.4} exitDur={0.3}
          />
          <div style={{ position:'absolute', left:80, top:1015, width:460, height:2, background:VPAL.green }} />
          <VModuleList items={gm1} x={80} y={1035} width={460} start={19.2} labelColor={VPAL.green} />

          <TextSprite
            text="SEGON CURS"
            x={560} y={980} size={20} color={VPAL.green} font={VMONO} weight={700}
            letterSpacing="0.22em" entryDur={0.4} exitDur={0.3}
          />
          <div style={{ position:'absolute', left:560, top:1015, width:460, height:2, background:VPAL.green }} />
          <VModuleList items={gm2} x={560} y={1035} width={460} start={20.0} labelColor={VPAL.green} />
        </Sprite>
      </div>
    </Sprite>
  );
}

function VStatPill({ x, y, label, value }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.5, 0, 1);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      width: 300,
      padding: '16px 0',
      borderTop: `2px solid ${VPAL.ink}`,
      opacity: t,
      transform: `translateY(${(1-t)*12}px)`,
      fontFamily: VSANS,
    }}>
      <div style={{ fontFamily: VMONO, fontSize: 16, color: VPAL.muted, letterSpacing: '0.18em', fontWeight: 600, marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 62, fontWeight: 800, color: VPAL.ink, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 5 — Grau Superior (28–40s)
// ──────────────────────────────────────────────────────────────────────────
function VScene5() {
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
        <VChrome />

        <Sprite start={28.1} end={39.9}>
          <TextSprite
            text="02 / CFGS"
            x={80} y={130} size={26} color={VPAL.teal} font={VMONO} weight={700}
            letterSpacing="0.24em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={28.3} end={39.9}>
          <TextSprite
            text="Tècnic Superior en"
            x={80} y={200} size={68} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={28.5} end={39.9}>
          <TextSprite
            text="Administració"
            x={80} y={300} size={104} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={28.7} end={39.9}>
          <TextSprite
            text="i Finances"
            x={80} y={430} size={104} color={VPAL.teal} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        <Sprite start={29.4} end={39.9}>
          <VStatPill x={80}  y={620} label="DURADA"   value="2000 h" />
          <VStatPill x={400} y={620} label="EMPRESA"  value="500 h" />
          <VStatPill x={720} y={620} label="CURSOS" value="2" />
        </Sprite>

        <Sprite start={30.0} end={39.9}>
          <TextSprite
            text={"Accés a la universitat, al mercat\nlaboral i a la funció pública —\ninclús a l'estranger."}
            x={80} y={780} size={30} color={VPAL.ink2} font={VSANS} weight={400}
            letterSpacing="-0.01em" entryDur={0.5} exitDur={0.3}
          />
        </Sprite>

        <Sprite start={29.8} end={39.9}>
          <TextSprite
            text="PRIMER CURS"
            x={80} y={980} size={20} color={VPAL.teal} font={VMONO} weight={700}
            letterSpacing="0.22em" entryDur={0.4} exitDur={0.3}
          />
          <div style={{ position:'absolute', left:80, top:1015, width:460, height:2, background:VPAL.teal }} />
          <VModuleList items={gs1} x={80} y={1035} width={460} start={30.2} labelColor={VPAL.teal} />

          <TextSprite
            text="SEGON CURS"
            x={560} y={980} size={20} color={VPAL.teal} font={VMONO} weight={700}
            letterSpacing="0.22em" entryDur={0.4} exitDur={0.3}
          />
          <div style={{ position:'absolute', left:560, top:1015, width:460, height:2, background:VPAL.teal }} />
          <VModuleList items={gs2} x={560} y={1035} width={460} start={31.0} labelColor={VPAL.teal} />
        </Sprite>
      </div>
    </Sprite>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 6 — Per què l'IES Maestrat? (40–54s) — 2x3 grid vertical
// ──────────────────────────────────────────────────────────────────────────
function VScene6() {
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
      <div style={{ position:'absolute', inset:0, background: VPAL.bgSoft }}>
        <VChrome />

        <Sprite start={40.1} end={53.9}>
          <TextSprite
            text="03 / Per què"
            x={80} y={130} size={26} color={VPAL.teal} font={VMONO} weight={700}
            letterSpacing="0.24em" entryDur={0.4} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={40.3} end={53.9}>
          <TextSprite
            text="L'IES"
            x={80} y={200} size={160} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.6} exitDur={0.3}
          />
        </Sprite>
        <Sprite start={40.5} end={53.9}>
          <TextSprite
            text="Maestrat."
            x={80} y={360} size={160} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.6} exitDur={0.3}
          />
        </Sprite>

        {/* 2 cols × 3 rows grid */}
        <div style={{ position:'absolute', left: 80, top: 640, width: 920 }}>
          {pillars.map((p, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = col * 480;
            const y = row * 400;
            const start = 41 + i * 0.45;
            return (
              <Sprite key={i} start={start} end={53.9}>
                <VPillarCard p={p} x={x} y={y} />
              </Sprite>
            );
          })}
        </div>
      </div>
    </Sprite>
  );
}

function VPillarCard({ p, x, y }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.6, 0, 1);
  const eased = Easing.easeOutCubic(t);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      width: 440, height: 360,
      padding: 30,
      background: '#ffffff',
      borderRadius: 22,
      boxShadow: '0 8px 24px rgba(31,58,58,0.06)',
      border: `1px solid ${VPAL.teal}18`,
      opacity: eased,
      transform: `translateY(${(1-eased)*20}px)`,
      fontFamily: VSANS,
    }}>
      <div style={{ fontFamily: VMONO, fontSize: 18, color: VPAL.teal, letterSpacing:'0.22em', fontWeight: 700, marginBottom: 14 }}>{p.num}</div>
      <div style={{ width: 48, height: 3, background: VPAL.green, marginBottom: 18, borderRadius: 2 }} />
      <div style={{ fontSize: 40, fontWeight: 800, color: VPAL.ink, letterSpacing:'-0.02em', lineHeight: 1.05, marginBottom: 14 }}>
        {p.title}
      </div>
      <div style={{ fontSize: 24, color: VPAL.ink2, fontWeight: 400, lineHeight: 1.4 }}>
        {p.body}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// SCENE 7 — Contact + Logo (54–62s) — stacked
// ──────────────────────────────────────────────────────────────────────────
function VScene7() {
  const time = useTime();
  const scale = interpolate([54, 62], [1.0, 1.03], Easing.linear)(time);
  return (
    <Sprite start={54} end={62}>
      <div style={{
        position:'absolute', inset:0,
        background: VPAL.bg,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}>
        <div style={{ position:'absolute', inset:0, background: `radial-gradient(ellipse at 50% 120%, ${VPAL.bgSoft}, transparent 60%)` }} />

        <Sprite start={54.1} end={61.9}>
          <VLogoSprite x={390} y={160} size={300} />
        </Sprite>

        <Sprite start={54.7} end={61.9}>
          <TextSprite
            text="T'estem"
            x={540} y={540} size={130} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.7} exitDur={0.3} align="center"
          />
        </Sprite>
        <Sprite start={54.9} end={61.9}>
          <TextSprite
            text="esperant."
            x={540} y={690} size={130} color={VPAL.ink} font={VSANS} weight={800}
            letterSpacing="-0.03em" entryDur={0.7} exitDur={0.3} align="center"
          />
        </Sprite>
        <Sprite start={55.2} end={61.9}>
          <TextSprite
            text={"Tria el teu itinerari.\nComença la teua carrera."}
            x={540} y={880} size={36} color={VPAL.ink2} font={VSANS} weight={400}
            letterSpacing="-0.01em" entryDur={0.5} exitDur={0.3} align="center"
          />
        </Sprite>

        {/* Stacked contact blocks */}
        <Sprite start={55.8} end={61.9}>
          <VContactBlock x={80} y={1080} label="CONTACTE" lines={[
            "Camí Font de Morella, 2",
            "12.170 · Sant Mateu (Castelló)",
          ]} accent={VPAL.teal} />
        </Sprite>
        <Sprite start={56.1} end={61.9}>
          <VContactBlock x={80} y={1280} label="TELÈFON · CORREU" lines={[
            "964 33 60 90",
            "12004400@edu.gva.es",
          ]} accent={VPAL.green} />
        </Sprite>
        <Sprite start={56.4} end={61.9}>
          <VContactBlock x={80} y={1480} label="WEB · XARXES" lines={[
            "portal.edu.gva.es/iesmaestrat",
            "@iesmaestrat",
          ]} accent={VPAL.warm} />
        </Sprite>

        <Sprite start={56.8} end={61.9}>
          <VInstLogoRow />
        </Sprite>
      </div>
    </Sprite>
  );
}

function VContactBlock({ x, y, label, lines, accent }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.5, 0, 1);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      width: 920,
      fontFamily: VSANS,
      opacity: t,
      transform: `translateY(${(1-t)*12}px)`,
    }}>
      <div style={{ fontFamily: VMONO, fontSize: 17, color: accent, letterSpacing:'0.24em', fontWeight:700, marginBottom: 10 }}>{label}</div>
      <div style={{ width: 56, height: 3, background: accent, marginBottom: 14, borderRadius: 2 }} />
      {lines.map((line, i) => (
        <div key={i} style={{ fontSize: 30, fontWeight: 500, color: VPAL.ink, lineHeight: 1.45 }}>{line}</div>
      ))}
    </div>
  );
}

function VInstLogoRow() {
  const { localTime } = useSprite();
  const t = clamp(localTime / 0.7, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const logos = [
    { src: 'assets/erasmus.png', label: 'Erasmus+' },
    { src: 'assets/gva.svg',     label: 'Generalitat Valenciana' },
    { src: 'assets/fpcv.jpg',    label: 'FP Comunitat Valenciana' },
  ];
  const LOGO_H = 130;
  const LOGO_W = 280;
  return (
    <div style={{
      position:'absolute', left: 0, right: 0, top: 1720,
      display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap: 20,
      opacity: eased,
      transform: `translateY(${(1-eased)*14}px)`,
    }}>
      <div style={{ fontFamily: VMONO, fontSize: 16, letterSpacing:'0.22em', color: VPAL.muted, fontWeight:600, textTransform:'uppercase' }}>
        Amb el suport de
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: 40 }}>
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
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Timestamp updater
// ──────────────────────────────────────────────────────────────────────────
function VTimeLabel() {
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
  VScene1, VScene2, VScene3, VScene4, VScene5, VScene6, VScene7,
  VTimeLabel,
});
