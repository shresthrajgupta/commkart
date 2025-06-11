import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';


const Rating = ({ value, text }) => {
    return (
        <div className='rating'>
            <span>
                {value >= 1 ? <FaStar style={{color: "#FC4A1A"}} /> : value >= 0.5 ? <FaStarHalfAlt style={{color: "#FC4A1A"}}/> : <FaRegStar style={{color: "#FC4A1A"}}/>}
                {value >= 2 ? <FaStar style={{color: "#FC4A1A"}} /> : value >= 1.5 ? <FaStarHalfAlt style={{color: "#FC4A1A"}}/> : <FaRegStar style={{color: "#FC4A1A"}}/>}
                {value >= 3 ? <FaStar style={{color: "#FC4A1A"}} /> : value >= 2.5 ? <FaStarHalfAlt style={{color: "#FC4A1A"}}/> : <FaRegStar style={{color: "#FC4A1A"}}/>}
                {value >= 4 ? <FaStar style={{color: "#FC4A1A"}} /> : value >= 3.5 ? <FaStarHalfAlt style={{color: "#FC4A1A"}}/> : <FaRegStar style={{color: "#FC4A1A"}}/>}
                {value >= 5 ? <FaStar style={{color: "#FC4A1A"}} /> : value >= 4.5 ? <FaStarHalfAlt style={{color: "#FC4A1A"}}/> : <FaRegStar style={{color: "#FC4A1A"}}/>}
            </span>

            <span className='rating-text'>{text && text}</span>
        </div>
    );
};

export default Rating;