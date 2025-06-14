

const QuantitySelector = ({ countInStock, quantity, setQuantity }) => {
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < countInStock) {
            setQuantity(quantity + 1);
        }
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= countInStock) {
            setQuantity(value);
        }
    };

    const buttonStyle = {
        width: '35px',
        height: '35px',
        border: 'none',
        backgroundColor: 'white',
        color: '#FC4A1A',
        fontSize: '22px',
        fontWeight: '400',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    };

    const disabledButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#DFDCE3',
        color: '#FC4A1A',
        cursor: 'not-allowed'
    };

    return (
        <div disabled={countInStock === 0} style={{ display: 'flex', alignItems: 'center', border: '1px solid #d5d9d9', borderRadius: '8px', overflow: 'hidden', width: 'fit-content' }}>
            <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                style={quantity <= 1 ? { ...disabledButtonStyle, borderRight: 'none' } : { ...buttonStyle, borderRadius: '7px 0 0 7px', borderRight: 'none' }}
                onMouseEnter={(e) => {
                    if (quantity > 1) {
                        e.target.style.backgroundColor = '#f0f2f2';
                    }
                }}
                onMouseLeave={(e) => {
                    if (quantity > 1) {
                        e.target.style.backgroundColor = 'white';
                    }
                }}
            >
                −
            </button>

            <input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                min="1"
                max={countInStock}
                style={{
                    width: '45px',
                    height: '35px',
                    textAlign: 'center',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#0f1111',
                    backgroundColor: 'white'
                }}
            />

            <button
                onClick={increaseQuantity}
                disabled={quantity >= countInStock}
                style={quantity >= countInStock ? { ...disabledButtonStyle, borderLeft: 'none' } : { ...buttonStyle, borderRadius: '0 7px 7px 0', borderLeft: 'none' }}
                onMouseEnter={(e) => {
                    if (quantity < countInStock) {
                        e.target.style.backgroundColor = '#f0f2f2';
                    }
                }}
                onMouseLeave={(e) => {
                    if (quantity < countInStock) {
                        e.target.style.backgroundColor = 'white';
                    }
                }}
            >
                +
            </button>
        </div>
    );
};

export default QuantitySelector;