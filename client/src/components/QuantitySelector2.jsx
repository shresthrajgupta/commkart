import React from 'react';

const QuantitySelector2 = ({ min = 1, max = 99, value = 1, onChange }) => {
    const [currentValue, setCurrentValue] = React.useState(value);

    React.useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleIncrement = () => {
        const newValue = Math.min(currentValue + 1, max);
        setCurrentValue(newValue);
        if (onChange) onChange(newValue);
    };

    const handleDecrement = () => {
        const newValue = Math.max(currentValue - 1, min);
        setCurrentValue(newValue);
        if (onChange) onChange(newValue);
    };

    const handleInputChange = (e) => {
        const newValue = parseInt(e.target.value) || min;
        const clampedValue = Math.max(min, Math.min(max, newValue));
        setCurrentValue(clampedValue);
        if (onChange) onChange(clampedValue);
    };

    const handleInputBlur = () => {
        // Ensure value is within bounds when user finishes editing
        const clampedValue = Math.max(min, Math.min(max, currentValue));
        if (clampedValue !== currentValue) {
            setCurrentValue(clampedValue);
            if (onChange) onChange(clampedValue);
        }
    };

    return (
        <div style={{ width: "120px" }}>
            <div className="quantity-selector">
                <input style={{ backgroundColor: "white" }} type="number" value={currentValue} onChange={handleInputChange} onBlur={handleInputBlur} min={min} max={max} className="quantity-input" aria-label="quantity selector" />

                <div className="quantity-controls">
                    <button type="button" className="quantity-btn quantity-btn-up" onClick={handleIncrement} disabled={currentValue >= max} aria-label="Increase quantity"> + </button>

                    <button type="button" className="quantity-btn quantity-btn-down" onClick={handleDecrement} disabled={currentValue <= min} aria-label="Decrease quantity">-</button>
                </div>
            </div>

            <style jsx>{`
                .quantity-selector {
                    position: relative;
                    display: inline-block;
                    width: 120px;
                    height: 48px;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    background-color: #DFDCE3;
                    transition: all 0.3s;
                    overflow: hidden;
                }

                .quantity-selector:hover,
                .quantity-selector:focus-within {
                    border-color: #F7B733;
                    box-shadow: 0 0 0 1px #F7B733;
                }

                .quantity-input {
                    width: calc(100% - 40px);
                    height: 100%;
                    border: none;
                    outline: none;
                    text-align: center;
                    font-size: 16px;
                    color: #666666;
                    background: transparent;
                    -moz-appearance: textfield;
                    padding: 0;
                }

                .quantity-input::-webkit-outer-spin-button,
                .quantity-input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                .quantity-controls {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 40px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-left: 1px solid #d9d9d9;
                }

                .quantity-btn {
                    flex: 1;
                    border: none;
                    background: #f5f5f5;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    color: #2c2c2e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                }

                .quantity-btn:hover {
                    background: #e8e8e8;
                }

                .quantity-btn:active {
                    background: #ddd;
                    transform: scale(0.95);
                }

                .quantity-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    background: #f5f5f5;
                }

                .quantity-btn:disabled:hover,
                .quantity-btn:disabled:active {
                    background: #f5f5f5;
                    transform: none;
                }

                .quantity-btn-up {
                    border-bottom: 1px solid #d9d9d9;
                    border-top-right-radius: 3px;
                }

                .quantity-btn-down {
                    border-bottom-right-radius: 3px;
                }

                /* Mobile optimizations */
                @media (max-width: 768px) {
                    .quantity-controls {
                        width: 44px; /* Larger touch target on mobile */
                    }

                    .quantity-input {
                        width: calc(100% - 44px);
                    }

                    .quantity-btn {
                        font-size: 18px;
                        min-height: 22px;
                    }
                }

                /* Touch device specific */
                @media (hover: none) and (pointer: coarse) {
                    .quantity-btn {
                        background: #f0f0f0;
                        min-height: 23px;
                    }

                    .quantity-btn:active {
                        background: #e0e0e0;
                    }
                }
            `}</style>
        </div>
    );
};

export default QuantitySelector2;