import React from 'react';
import InputNumber from 'rc-input-number';

const QuantitySelector2 = ({ min, max, value, onChange }) => {
    const [disabled, setDisabled] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(false);
    const [keyboard, setKeyboard] = React.useState(true);
    const [wheel, setWheel] = React.useState(false);
    const [stringMode, setStringMode] = React.useState(false);
    // const [value, setValue] = React.useState < string | number > (93);

    // const onChange = (val) => {
    //     console.warn('onChange:', val, typeof val);
    //     setValue(val);
    // };

    return (
        <>
            <style>{`
                .rc-input-number {
                    display: inline-block;
                    height: 46px;
                    margin: 0;
                    padding: 0;
                    font-size: 16px;
                    line-height: 26px;
                    vertical-align: middle;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    transition: all 0.3s;
                    background-color: #DFDCE3;
                }

                .rc-input-number-focused {
                    border-color: #F7B733;
                    box-shadow: 0 0 0 1px #F7B733;
                }

                .rc-input-number-out-of-range input {
                    color: white;
                    background-color: red
                }

                .rc-input-number-handler {
                    display: block;
                    height: 20px;
                    overflow: hidden;
                    line-height: 23px;
                    text-align: center;
                    touch-action: none;
                }

                .rc-input-number-handler-active {
                    background: #ddd;
                }

                .rc-input-number-handler-up-inner,
                .rc-input-number-handler-down-inner {
                    color: #666666;
                    -webkit-user-select: none;
                    user-select: none;
                }

                .rc-input-number:hover {
                    border-color: #F7B733;
                }

                .rc-input-number:hover .rc-input-number-handler-up,
                .rc-input-number:hover .rc-input-number-handler-wrap {
                    border-color: #F7B733;
                }

                .rc-input-number-disabled:hover {
                    border-color: #d9d9d9;
                }

                .rc-input-number-disabled:hover .rc-input-number-handler-up,
                .rc-input-number-disabled:hover .rc-input-number-handler-wrap {
                    border-color: #d9d9d9;
                }

                .rc-input-number-input-wrap {
                    height: 100%;
                    overflow: hidden;
                }

                .rc-input-number-input {
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    color: #666666;
                    line-height: 26px;
                    text-align: center;
                    border: 0;
                    border-radius: 4px;
                    outline: 0;
                    transition: all 0.3s ease;
                    -moz-appearance: textfield;
                }

                .rc-input-number-handler-wrap {
                    float: right;
                    width: 20px;
                    height: 100%;
                    border-left: 1px solid #d9d9d9;
                    transition: all 0.3s;
                }

                .rc-input-number-handler-up {
                    padding-top: 1px;
                    border-bottom: 1px solid #d9d9d9;
                    transition: all 0.3s;
                }

                .rc-input-number-handler-up-inner:after {
                    color: #2c2c2e;
                    content: '+';
                }

                .rc-input-number-handler-down {
                    transition: all 0.3s;
                }

                .rc-input-number-handler-down-inner:after {
                    color: #2c2c2e;
                    content: '-';
                }

                /* Handler disabled mixin applied to these: */
                .rc-input-number-handler-down-disabled,
                .rc-input-number-handler-up-disabled {
                    opacity: 0.3;
                }

                .rc-input-number-handler-down-disabled:hover,
                .rc-input-number-handler-up-disabled:hover {
                    color: #999;
                    border-color: #d9d9d9;
                }

                .rc-input-number-disabled .rc-input-number-input {
                    background-color: #f3f3f3;
                    cursor: not-allowed;
                    opacity: 0.72;
                }

                .rc-input-number-disabled .rc-input-number-handler {
                    opacity: 0.3;
                }

                .rc-input-number-disabled .rc-input-number-handler:hover {
                    color: #999;
                    border-color: #d9d9d9;
                }
        `}</style>


            <div style={{}}>
                <InputNumber
                    aria-label="quantity selector button"
                    min={min}
                    max={max}
                    style={{ width: 100 }}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    disabled={disabled}
                    keyboard={keyboard}
                    changeOnWheel={wheel}
                    stringMode={stringMode}
                />
            </div>
        </>
    );
};

export default QuantitySelector2;