import React, { useState } from "react";
import "../styling/QuantitySelector.css";

export default function QuantitySelector({
  initial = 1,
  min = 1,
  max = 10,
  onChange,
}) {
  const [quantity, setQuantity] = useState(initial);

  const update = (next) => {
    const clamped = Math.max(min, Math.min(max, next));
    setQuantity(clamped);
    if (onChange) onChange(clamped);
  };

  const handleIncrement = () => {
    update(quantity + 1);
  };

  const handleDecrement = () => {
    update(quantity - 1);
  };

  const handleChange = (event) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) return;
    update(value);
  };

  const handleSubmit = (event) => {
    // we don’t actually submit anything, just prevent page reload
    event.preventDefault();
  };

  return (
    <form className="quantity-selector" onSubmit={handleSubmit}>
      <button type="button" onClick={handleDecrement}>
        -
      </button>
      <input
        type="number"
        value={quantity}
        min={min}
        max={max}
        onChange={handleChange}
      />
      <button type="button" className="submit-button" onClick={handleIncrement}>
        +
      </button>
    </form>
  );
}
