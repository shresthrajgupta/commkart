import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';


const SearchBox = () => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();

    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = (e) => {
        e.preventDefault();

        if (keyword.trim()) {
            setKeyword('');
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    }

    return (
        <>
            <Form onSubmit={submitHandler} className='d-flex justify-content-center align-items-center'>
                <Form.Control type='text' name='q' onChange={(e) => setKeyword(e.target.value)} value={keyword} placeholder='Search Products...' className='mr-sm-2 ml-sm-5' style={{ height: "40px", border: "none", borderRadius: "20px" }} />
                <Button type='submit' className='px-2 py-1 mx-2' style={{ backgroundColor: "#F7B733", border: "none", borderRadius: "20px", height: "40px" }}>Search</Button>
            </Form >
        </>
    );
};

export default SearchBox;