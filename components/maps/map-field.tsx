"use client";

type Option = { value: string; label: string };

type MapFieldProps = {
  id: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

/**
 * One filter control, in the site's own vocabulary.
 *
 * The laografia map's panel was `bg-black text-white` with white selects and
 * black type, and its record counter was `text-black` set on that black
 * panel — invisible. Both maps now share this field so they cannot drift
 * apart again.
 */
export function MapField({ id, label, value, options, onChange }: MapFieldProps) {
  return (
    <div className="map-field">
      <label className="mono mono--micro" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
