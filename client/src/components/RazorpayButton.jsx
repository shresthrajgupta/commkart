
const RazorpayButton = ({ onClick, disabled = false, className = '', style = {}, type = 'button', ...props }) => {
    const buttonClasses = className.trim();

    return (
        <>
            <div className="ButtonContainer" style={{ width: "100%" }}>
                <button type={type} className={`PaymentButton-Button PaymentButton-Button--rzpTheme ${buttonClasses}`} onClick={onClick} disabled={disabled} style={{ ...style, width: "100%" }} {...props}>
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.077 6.476l-.988 3.569 5.65-3.589-3.695 13.54 3.752.004 5.457-20L7.077 6.476z" fill="#fff"></path>
                        <path d="M1.455 14.308L0 20h7.202L10.149 8.42l-8.694 5.887z" fill="#fff"></path>
                    </svg>

                    <div className="PaymentButton-contents">
                        <span className="PaymentButton-text">Pay Now</span>
                        <div className="PoweredBy">Secured by Razorpay</div>
                    </div>
                </button>
            </div>


            <style>{`
                .ButtonContainer {
                    box-shadow: 0 0 20px rgba(0,0,0,.08);
                    display: inline-block;
                    margin: 0 0 0 0;
                }

                .PaymentButton-Button {
                    border: 1px solid transparent;
                    border-radius: 3px;
                    display: inline-block;
                    background: #072654;
                    border-color: #072654;
                    color: #fff;
                    font-family: 'Poppins',helvetica,sans-serif;
                    font-style: italic;
                    height: 55px;
                    overflow: hidden;
                    position: relative;
                    text-align: center;
                }

                .PaymentButton-Button--rzpTheme:before {
                    background: #1e40a0;
                    border-radius: 2px 0 0 2px;
                    content: "";
                    height: 100%;
                    left: -6px;
                    position: absolute;
                    top: 0;
                    transform: skew(-15deg,0);
                    width: 46px;
                }

                svg {
                    left: 0;
                    margin: 9px 11px;
                    position: absolute;
                    top: 0;
                }

                .PaymentButton-Button--rzpTheme svg path {
                    fill: #fff;
                }

                .PaymentButton-contents {
                    margin: 1px 0;
                    padding: 4px 10px 4px 44px;
                }

                .PaymentButton-text {
                    display: block;
                    font-size: 18px;
                    font-weight: 600;
                    line-height: 18px;
                    min-height: 18px;
                    opacity: .95;
                }

                .PoweredBy {
                    font-size: 10px;
                    line-height: 14px;
                    opacity: .6;
                }
            `}</style>
        </>
    );
};

export default RazorpayButton;