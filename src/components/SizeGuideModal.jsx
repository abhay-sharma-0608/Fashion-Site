import { useState } from 'react';
import { X } from 'lucide-react';
import './SizeGuideModal.css';

const SIZE_DATA = {
  male: [
    { size: 'XS', chest: '82-87',  waist: '68-73',  hip: '86-91',  shoulder: '40-41' },
    { size: 'S',  chest: '88-93',  waist: '74-79',  hip: '92-97',  shoulder: '42-43' },
    { size: 'M',  chest: '94-99',  waist: '80-85',  hip: '98-103', shoulder: '44-45' },
    { size: 'L',  chest: '100-105',waist: '86-91',  hip: '104-109',shoulder: '46-47' },
    { size: 'XL', chest: '106-111',waist: '92-97',  hip: '110-115',shoulder: '48-49' },
    { size: 'XXL',chest: '112-117',waist: '98-103', hip: '116-121',shoulder: '50-51' },
  ],
  female: [
    { size: 'XS', chest: '76-81',  waist: '60-65',  hip: '84-89',  shoulder: '37-38' },
    { size: 'S',  chest: '82-87',  waist: '66-71',  hip: '90-95',  shoulder: '39-40' },
    { size: 'M',  chest: '88-93',  waist: '72-77',  hip: '96-101', shoulder: '41-42' },
    { size: 'L',  chest: '94-99',  waist: '78-83',  hip: '102-107',shoulder: '43-44' },
    { size: 'XL', chest: '100-105',waist: '84-89',  hip: '108-113',shoulder: '45-46' },
    { size: 'XXL',chest: '106-111',waist: '90-95',  hip: '114-119',shoulder: '47-48' },
  ],
};

// Waist sizes for jeans/trousers
const WAIST_SIZE_DATA = {
  male: [
    { size: '28', waist: '71-73', hip: '91-93',  inseam: '76-78' },
    { size: '30', waist: '76-78', hip: '96-98',  inseam: '78-80' },
    { size: '32', waist: '81-83', hip: '101-103',inseam: '78-80' },
    { size: '34', waist: '86-88', hip: '106-108',inseam: '80-82' },
    { size: '36', waist: '91-93', hip: '111-113',inseam: '80-82' },
    { size: '38', waist: '96-98', hip: '116-118',inseam: '82-84' },
  ],
  female: [
    { size: '26', waist: '66-68', hip: '88-90',  inseam: '74-76' },
    { size: '28', waist: '71-73', hip: '93-95',  inseam: '74-76' },
    { size: '30', waist: '76-78', hip: '98-100', inseam: '76-78' },
    { size: '32', waist: '81-83', hip: '103-105',inseam: '76-78' },
    { size: '34', waist: '86-88', hip: '108-110',inseam: '78-80' },
    { size: '36', waist: '91-93', hip: '113-115',inseam: '78-80' },
  ],
};

function MaleFigureSVG({ highlighted }) {
  const color = (part) => highlighted === part ? '#c07a3a' : '#d4ccc0';
  const lineColor = (part) => highlighted === part ? '#c07a3a' : '#a8a29e';
  return (
    <svg viewBox="0 0 160 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="figure-svg">
      {/* Head */}
      <ellipse cx="80" cy="28" rx="18" ry="22" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Neck */}
      <rect x="73" y="48" width="14" height="12" rx="3" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Torso */}
      <path d="M52 60 Q80 56 108 60 L114 130 Q80 138 46 130 Z" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Chest highlight */}
      {highlighted === 'chest' && <path d="M52 60 Q80 56 108 60 L110 95 Q80 100 50 95 Z" fill="rgba(192,122,58,0.15)" stroke="#c07a3a" strokeWidth="1.5" strokeDasharray="4 2"/>}
      {/* Waist highlight */}
      {highlighted === 'waist' && <path d="M50 100 Q80 105 110 100 L112 125 Q80 132 48 125 Z" fill="rgba(192,122,58,0.15)" stroke="#c07a3a" strokeWidth="1.5" strokeDasharray="4 2"/>}
      {/* Shoulder line */}
      <line x1="44" y1="62" x2="116" y2="62" stroke={lineColor('shoulder')} strokeWidth={highlighted==='shoulder'?2:1} strokeDasharray={highlighted==='shoulder'?'4 2':''}/>
      {/* Left arm */}
      <path d="M52 62 L36 110 Q34 116 38 118 L48 120 Q52 118 54 112 L60 72" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Right arm */}
      <path d="M108 62 L124 110 Q126 116 122 118 L112 120 Q108 118 106 112 L100 72" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Hips/Pelvis */}
      <path d="M46 128 Q80 136 114 128 L116 155 Q80 162 44 155 Z" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {highlighted === 'hip' && <path d="M46 128 Q80 136 114 128 L116 155 Q80 162 44 155 Z" fill="rgba(192,122,58,0.15)" stroke="#c07a3a" strokeWidth="1.5" strokeDasharray="4 2"/>}
      {/* Left leg */}
      <path d="M46 153 L40 240 Q39 246 44 248 L56 248 Q61 246 62 240 L66 153" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Right leg */}
      <path d="M94 153 L98 240 Q99 246 104 248 L116 248 Q121 246 120 240 L114 153" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Left foot */}
      <ellipse cx="49" cy="252" rx="12" ry="6" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Right foot */}
      <ellipse cx="111" cy="252" rx="12" ry="6" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Inseam line */}
      {highlighted === 'inseam' && <line x1="80" y1="155" x2="80" y2="248" stroke="#c07a3a" strokeWidth="2" strokeDasharray="4 2"/>}

      {/* Measurement labels */}
      <text x="120" y="82" fontSize="9" fill={lineColor('chest')} fontFamily="sans-serif">chest</text>
      <line x1="50" y1="80" x2="110" y2="80" stroke={lineColor('chest')} strokeWidth={highlighted==='chest'?1.5:0.8} strokeDasharray="3 2"/>
      <text x="120" y="115" fontSize="9" fill={lineColor('waist')} fontFamily="sans-serif">waist</text>
      <line x1="50" y1="112" x2="110" y2="112" stroke={lineColor('waist')} strokeWidth={highlighted==='waist'?1.5:0.8} strokeDasharray="3 2"/>
      <text x="120" y="148" fontSize="9" fill={lineColor('hip')} fontFamily="sans-serif">hip</text>
      <line x1="46" y1="145" x2="114" y2="145" stroke={lineColor('hip')} strokeWidth={highlighted==='hip'?1.5:0.8} strokeDasharray="3 2"/>
      <text x="120" y="64" fontSize="9" fill={lineColor('shoulder')} fontFamily="sans-serif">shoulder</text>
    </svg>
  );
}

function FemaleFigureSVG({ highlighted }) {
  const lineColor = (part) => highlighted === part ? '#c07a3a' : '#a8a29e';
  return (
    <svg viewBox="0 0 160 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="figure-svg">
      {/* Head */}
      <ellipse cx="80" cy="26" rx="16" ry="20" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Hair */}
      <path d="M64 18 Q80 8 96 18 Q98 10 80 6 Q62 10 64 18Z" fill="#c4bdb4"/>
      {/* Neck */}
      <rect x="74" y="44" width="12" height="10" rx="3" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Shoulders */}
      <path d="M58 54 Q80 50 102 54 L108 68 Q80 64 52 68 Z" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Torso - hourglass */}
      <path d="M52 68 L48 110 Q80 122 112 110 L108 68 Q80 64 52 68Z" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Bust highlight */}
      {highlighted === 'chest' && <path d="M52 68 Q80 64 108 68 L106 90 Q80 96 54 90 Z" fill="rgba(192,122,58,0.15)" stroke="#c07a3a" strokeWidth="1.5" strokeDasharray="4 2"/>}
      {/* Waist nip */}
      <path d="M50 108 Q80 120 110 108 L112 128 Q80 122 48 128 Z" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {highlighted === 'waist' && <path d="M50 108 Q80 120 110 108 L112 128 Q80 122 48 128 Z" fill="rgba(192,122,58,0.15)" stroke="#c07a3a" strokeWidth="1.5" strokeDasharray="4 2"/>}
      {/* Hips - wider */}
      <path d="M48 126 Q80 118 112 126 L116 160 Q80 168 44 160 Z" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {highlighted === 'hip' && <path d="M48 126 Q80 118 112 126 L116 160 Q80 168 44 160 Z" fill="rgba(192,122,58,0.15)" stroke="#c07a3a" strokeWidth="1.5" strokeDasharray="4 2"/>}
      {/* Left arm - slimmer */}
      <path d="M53 68 L38 112 Q36 118 40 120 L50 121 Q54 119 55 113 L62 72" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Right arm */}
      <path d="M107 68 L122 112 Q124 118 120 120 L110 121 Q106 119 105 113 L98 72" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Left leg */}
      <path d="M48 158 L44 244 Q43 250 48 252 L60 252 Q65 250 65 244 L68 158" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Right leg */}
      <path d="M92 158 L95 244 Q95 250 100 252 L112 252 Q117 250 116 244 L112 158" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Left foot */}
      <ellipse cx="52" cy="256" rx="11" ry="5" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Right foot + heel */}
      <ellipse cx="108" cy="256" rx="11" ry="5" fill="#e8e2d9" stroke="#c4bdb4" strokeWidth="1.5"/>
      {/* Inseam */}
      {highlighted === 'inseam' && <line x1="80" y1="160" x2="80" y2="252" stroke="#c07a3a" strokeWidth="2" strokeDasharray="4 2"/>}

      {/* Measurement lines */}
      <line x1="54" y1="82" x2="106" y2="82" stroke={lineColor('chest')} strokeWidth={highlighted==='chest'?1.5:0.8} strokeDasharray="3 2"/>
      <text x="110" y="85" fontSize="9" fill={lineColor('chest')} fontFamily="sans-serif">bust</text>
      <line x1="50" y1="116" x2="110" y2="116" stroke={lineColor('waist')} strokeWidth={highlighted==='waist'?1.5:0.8} strokeDasharray="3 2"/>
      <text x="114" y="119" fontSize="9" fill={lineColor('waist')} fontFamily="sans-serif">waist</text>
      <line x1="44" y1="152" x2="116" y2="152" stroke={lineColor('hip')} strokeWidth={highlighted==='hip'?1.5:0.8} strokeDasharray="3 2"/>
      <text x="120" y="155" fontSize="9" fill={lineColor('hip')} fontFamily="sans-serif">hip</text>
      <line x1="56" y1="58" x2="104" y2="58" stroke={lineColor('shoulder')} strokeWidth={highlighted==='shoulder'?1.5:0.8} strokeDasharray="3 2"/>
      <text x="108" y="61" fontSize="9" fill={lineColor('shoulder')} fontFamily="sans-serif">shoulder</text>
    </svg>
  );
}

function getRecommendedSize(gender, measurements, isNumericSize) {
  const table = isNumericSize ? WAIST_SIZE_DATA[gender] : SIZE_DATA[gender];
  const { chest, waist, hip } = measurements;

  if (!chest && !waist && !hip) return null;

  for (const row of table) {
    const checkRange = (val, range) => {
      if (!val || !range) return true;
      const [min, max] = range.split('-').map(Number);
      return Number(val) >= min && Number(val) <= max;
    };
    const chestKey = isNumericSize ? null : 'chest';
    const waistKey = 'waist';
    const hipKey = 'hip';

    const chestOk  = !chest || !chestKey || checkRange(chest, row[chestKey]);
    const waistOk  = !waist || checkRange(waist, row[waistKey]);
    const hipOk    = !hip   || checkRange(hip,   row[hipKey]);

    if (chestOk && waistOk && hipOk) return row.size;
  }
  // Return largest if over range
  return table[table.length - 1].size + '+';
}

export default function SizeGuideModal({ onClose, onSelectSize, productSizes }) {
  const [gender, setGender] = useState('male');
  const [highlighted, setHighlighted] = useState(null);
  const [measurements, setMeasurements] = useState({ chest: '', waist: '', hip: '', inseam: '' });
  const [recommended, setRecommended] = useState(null);

  // Detect if product uses numeric sizes (jeans/trousers)
  const isNumericSize = productSizes && productSizes.some(s => !isNaN(Number(s)));
  const table = isNumericSize ? WAIST_SIZE_DATA[gender] : SIZE_DATA[gender];

  const fields = isNumericSize
    ? [
        { key: 'waist',  label: gender === 'female' ? 'Waist (cm)' : 'Waist (cm)',  hint: 'Around your natural waist' },
        { key: 'hip',    label: 'Hip (cm)',    hint: 'Fullest part of your hips' },
        { key: 'inseam', label: 'Inseam (cm)', hint: 'Crotch to ankle' },
      ]
    : [
        { key: 'chest',  label: gender === 'female' ? 'Bust (cm)' : 'Chest (cm)',  hint: 'Fullest part of chest' },
        { key: 'waist',  label: 'Waist (cm)',  hint: 'Around your natural waist' },
        { key: 'hip',    label: 'Hip (cm)',    hint: 'Fullest part of your hips' },
      ];

  const handleMeasure = (key, val) => {
    setMeasurements(prev => ({ ...prev, [key]: val }));
    setRecommended(null);
  };

  const handleFind = () => {
    const result = getRecommendedSize(gender, measurements, isNumericSize);
    setRecommended(result);
  };

  const handleApply = () => {
    if (recommended && onSelectSize) {
      // Match recommended size against actual product sizes
      const match = productSizes.find(s => s === recommended || s === recommended.replace('+',''));
      if (match) onSelectSize(match);
    }
    onClose();
  };

  return (
    <div className="sg-backdrop" onClick={onClose}>
      <div className="sg-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sg-header">
          <div>
            <h2 className="sg-title">Size Guide</h2>
            <p className="sg-subtitle">Find your perfect fit</p>
          </div>
          <button className="sg-close" onClick={onClose}><X size={20}/></button>
        </div>

        {/* Gender toggle */}
        <div className="sg-gender-toggle">
          <button className={`sg-gender-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => { setGender('male'); setRecommended(null); }}>
            <span className="sg-gender-icon">♂</span> Male
          </button>
          <button className={`sg-gender-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => { setGender('female'); setRecommended(null); }}>
            <span className="sg-gender-icon">♀</span> Female
          </button>
        </div>

        <div className="sg-body">
          {/* Figure */}
          <div className="sg-figure-col">
            <div className="sg-figure-wrap">
              {gender === 'male'
                ? <MaleFigureSVG highlighted={highlighted} />
                : <FemaleFigureSVG highlighted={highlighted} />
              }
            </div>
            <p className="sg-figure-hint">All measurements in centimetres (cm)</p>
          </div>

          {/* Right col */}
          <div className="sg-right-col">

            {/* Measurement inputs */}
            <div className="sg-inputs">
              <p className="sg-inputs-title">Enter Your Measurements</p>
              {fields.map(f => (
                <div key={f.key} className={`sg-input-row ${highlighted === f.key ? 'active' : ''}`}
                  onMouseEnter={() => setHighlighted(f.key)}
                  onMouseLeave={() => setHighlighted(null)}>
                  <label className="sg-label">
                    {f.label}
                    <span className="sg-label-hint">{f.hint}</span>
                  </label>
                  <input
                    type="number"
                    className="sg-input"
                    placeholder="e.g. 90"
                    value={measurements[f.key]}
                    onChange={e => handleMeasure(f.key, e.target.value)}
                    min="40" max="200"
                  />
                </div>
              ))}
              <button className="sg-find-btn" onClick={handleFind}>Find My Size →</button>
            </div>

            {/* Recommendation result */}
            {recommended && (
              <div className="sg-result">
                <p className="sg-result-label">Recommended Size</p>
                <div className="sg-result-size">{recommended}</div>
                <p className="sg-result-sub">Based on your measurements</p>
                <button className="sg-apply-btn" onClick={handleApply}>Apply This Size</button>
              </div>
            )}

            {/* Size table */}
            <div className="sg-table-wrap">
              <p className="sg-table-title">Size Chart</p>
              <div className="sg-table-scroll">
                <table className="sg-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      {isNumericSize
                        ? <><th>Waist</th><th>Hip</th><th>Inseam</th></>
                        : <><th>{gender==='female'?'Bust':'Chest'}</th><th>Waist</th><th>Hip</th><th>Shoulder</th></>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {table.map(row => (
                      <tr key={row.size} className={recommended === row.size ? 'highlighted-row' : ''}>
                        <td className="sg-size-cell">{row.size}</td>
                        {isNumericSize
                          ? <><td>{row.waist}</td><td>{row.hip}</td><td>{row.inseam}</td></>
                          : <><td>{row.chest}</td><td>{row.waist}</td><td>{row.hip}</td><td>{row.shoulder}</td></>
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
