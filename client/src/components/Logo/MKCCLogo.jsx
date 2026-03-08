// MKCC Official Logo — Maa Kali Cricket Club
import mkccLogoSrc from '../../assets/mkcc-logo.png';

export default function MKCCLogo({ size = 80, className = '' }) {
  return (
    <img
      src={mkccLogoSrc}
      alt="MKCC — Maa Kali Cricket Club"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', display: 'block' }}
      draggable={false}
    />
  );
}
