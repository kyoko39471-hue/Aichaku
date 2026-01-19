import { ICONS } from '../icons/iconMap';

export default function Icon({
  name,
  size = 24,
  className = '',
}) {
  const src = ICONS[name];

  if (!src) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      className={className}
      alt={name}
    />
  );
}
