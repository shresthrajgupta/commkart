const defaultTitle = "Welcome to CommKart";
const defaultDescription = "We sell top products for affordable prices";
const defaultKeywords = "electronics, buy electronics, cheap electronics";

const Meta = ({ title = defaultTitle, description = defaultDescription, keywords = defaultKeywords }) => {
    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
        </>
    );
};

export default Meta;