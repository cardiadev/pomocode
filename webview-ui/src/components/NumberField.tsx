import { useState, useEffect, type ReactElement, type ChangeEvent } from 'react';

interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}

export function NumberField({
  label,
  value,
  min = 1,
  max = 999,
  step = 1,
  onChange,
  unit,
}: NumberFieldProps): ReactElement {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  function handleDecrement(): void {
    const next = Math.max(min, value - step);
    onChange(next);
  }

  function handleIncrement(): void {
    const next = Math.min(max, value + step);
    onChange(next);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const text = event.target.value;
    setInputValue(text);
    const parsed = Number.parseInt(text, 10);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
    }
  }

  function handleBlur(): void {
    const parsed = Number.parseInt(inputValue, 10);
    if (Number.isNaN(parsed) || parsed < min) {
      setInputValue(String(min));
      onChange(min);
    } else if (parsed > max) {
      setInputValue(String(max));
      onChange(max);
    } else {
      setInputValue(String(parsed));
      onChange(parsed);
    }
  }

  const isMin = value <= min;
  const isMax = value >= max;

  return (
    <div className="number-field-container">
      <span className="number-field-label">{label}</span>
      <div className="number-field-control">
        <button
          type="button"
          className="number-field-btn number-field-btn--dec"
          onClick={handleDecrement}
          disabled={isMin}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>

        <div className="number-field-input-wrapper">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="number-field-input"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            aria-label={label}
          />
          {unit && <span className="number-field-unit">{unit}</span>}
        </div>

        <button
          type="button"
          className="number-field-btn number-field-btn--inc"
          onClick={handleIncrement}
          disabled={isMax}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
