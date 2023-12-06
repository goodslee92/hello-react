import React, {useState} from 'react';
import './signup.scss';
import axios from "axios";
import { useNavigate } from "react-router-native";

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState();
    const nameChangeHandler = (event) => {
        setName(event.target.value);
    };
    const [id, setId] = useState();
    const idChangeHandler = (event) => {
        setId(event.target.value);
    };
    const [password, setPassword] = useState();
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    };
    const [isPasswordSame, setIsPasswordSame] = useState(false);
    const passwordCheckChangeHandler = (event) => {
        if (password === event.target.value) {
            setIsPasswordSame(true)
        }
    };
    const data = {
        id : id,
        password : password,
        name : name,
    };
    const onClickHandler = () => {
            const fetchData = async () => {
                await axios.post('http://localhost:3001/api/registerAccount', data)
                    .then(res => {
                        console.log(res.data)
                    }).catch(err => {
                        console.log(err)
                    })
            }
            fetchData();
            alert(data.name + "님의 가입을 환영합니다.");
            navigate('/');
    }
    return (
        <div>
            <div>
                <h1>Sign Up</h1>
            </div>
            <div className='inputList'>
                <input className='name' name='name' type="name" placeholder='이름' onChange={nameChangeHandler} />
                <input className='id' name='id' type="id" placeholder='아이디' onChange={idChangeHandler} />
                <input className='password' name='password' type="password" placeholder='비밀번호' onChange={passwordChangeHandler} />
                <input className='passwordCheck' name='passwordCheck' type="password" placeholder='비밀번호 확인' onChange={passwordCheckChangeHandler} />
                {
                    !isPasswordSame &&
                    <span>비밀번호가 일치하지 않습니다.</span>
                }
                <button className="btn-signup btn-gray" onClick={onClickHandler} 
                    disabled={(id === null || password === null || !isPasswordSame)}>
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default SignUp;