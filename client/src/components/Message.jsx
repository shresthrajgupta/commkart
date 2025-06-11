import { Alert } from "react-bootstrap";


const Message = ({ variant = "info", children, style }) => {
    return (
        <Alert variant={variant} style={style}> {children} </Alert>
    );
};

export default Message;