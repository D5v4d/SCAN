import { useDispatch, useSelector } from "react-redux"
import { upActive, userLogin } from "../../redux/slice/authorizationSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Authorization = () => {
    const dispatch = useDispatch<AppDispatch>()
    const authorization = useSelector((state: RootState) => state.authorization);
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [islogin, setIslogin] = useState(false)
    const [ispassword, setIspassword] = useState(false)
    const [isauthorization, setAuthorization] = useState(true)

    const entrance = (e: string) => {
        dispatch(upActive(e));
    }

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(e.target.value)
        setIslogin(e.target.value.length == 0)
        if (!isauthorization) {
            setAuthorization(true)
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setIspassword(e.target.value.length <= 6)
        if (!isauthorization) {
            setAuthorization(true)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const login = formData.get('login') as string | null;
        const password = formData.get('password') as string | null;

        if (login && password) {
            const resultAction = await dispatch(userLogin({ login, password }));
            if (!resultAction.payload.message) {
                navigate('/')
            } else {
                setAuthorization(false)
            }
        }
    }

    return (
        <main>
            <section className=" flex pl-[60px] pr-[141px] pt-[70px] pb-[80px] max-sm:flex-col max-sm:pb-[79px] max-sm:pt-[31px] max-sm:pl-[14px] max-sm-[14px]">
                <div className="w-[745px] mr-[65px] max-sm:w-[335px] max-sm:mr-[0px]">
                    <h1 style={{ fontFamily: 'Ferry' }} className="text-[40px] max-sm:hidden">Для оформления подписки на тариф, необходимо авторизоваться.</h1>
                    <h1 style={{ fontFamily: 'Ferry' }} className="hidden max-sm:block max-sm:text-[22px] max-sm:mb-[106px]">Для оформления подписки <br></br>на тариф, необходимо авторизоваться.</h1>
                    <img src="/src/assets/img/characters.png" alt="characters" className="pl-[117px] pt-[14px] pb-[23px] max-sm:hidden" />
                </div>
                <div className="w-[429px] h-[523px] card-shadow rounded-[10px] px-[25px] pb-[39px] pt-[25px] max-sm:h-[504px] max-sm:w-[335px] max-sm:px-[15px] max-sm:pb-[20px]">
                    <img src="/src/assets/svg/authorization/castle.svg" alt="castle" className="mt-[-85px] ml-[-75px] absolute max-sm:ml-[64px] max-sm:mt-[-105px]" />
                    <button onClick={() => (entrance("enter"))} className={`border-b-2 w-[151px] h-[29px] mr-[15px] cursor-pointer ${authorization.entrance === 'enter' ? 'text-[#029491]' : 'text-[#C7C7C7]'} max-sm:w-[103px] max-sm:text-[14px]`}>Войти</button>
                    <button disabled onClick={() => (entrance("register"))} className={`border-b-2 w-[213px] h-[29px] cursor-pointer ${authorization.entrance === 'register' ? 'text-[#029491]' : 'text-[#C7C7C7]'} max-sm:w-[182px] max-sm:text-[14px]`}>Зарегистрироваться</button>
                    <form className="mt-[30px]" onSubmit={handleSubmit}>

                        <label className="block h-[102px]">
                            <span className="text-[#949494] mb-[15px] max-sm:text-[14px]"> Логин или номер телефона:</span>
                            <input value={login} onChange={handleLoginChange} name="login" type="text"
                                className={`${!islogin && isauthorization ? 'border-[#C7C7C7] mb-[20px]' : 'border-[#FF5959]'}  mt-[15px] focus:outline-none w-[379px] h-[43px] pl-[10px] border rounded-[5px]  max-sm:w-[305px]`} />
                            {islogin && (<span className={`text-[#FF5959] text-[14px] ml-[88px] max-sm:ml-[60px]`}>{!login && 'Введите корректные данные'}</span>)}
                        </label>
                        <label className="block h-[91px]  max-sm:h-[115px]">
                            <span className="text-[#949494] max-sm:text-[14px]"> Пароль:</span><br />
                            <input value={password} onChange={handlePasswordChange} name="password" type="password"
                                className={`${!ispassword && isauthorization ? 'border-[#C7C7C7] mb-[30px]' : 'border-[#FF5959]'} mt-[15px] focus:outline-none w-[379px] h-[43px] pl-[10px] border rounded-[5px]  max-sm:w-[305px]`} />
                            {ispassword || !isauthorization ? (
                                <span className={`text-[#FF5959] text-[14px] w-[379px] text-center inline-block max-sm:w-[305px]`}>
                                    {ispassword ? 'Неправильный пароль' : 'Неправильное имя или пароль'}
                                </span>
                            ) : null}
                        </label>
                        <button
                            disabled={!(!ispassword && !islogin && login.trim() && password.length > 0)}
                            type="submit"
                            className={` ${!ispassword && !islogin && login.trim() && password.length ? 'bg-[#5970FF]' : 'bg-[#acb8ff]'} mt-[30px] mb-[15px] w-[379px] h-[59px] font-medium text-[22px] text-white  rounded-[5px] cursor-pointer max-sm:mt-[0px] max-sm:w-[305px]`}>
                            Войти
                        </button>
                    </form>
                    <button disabled className="text-[#5970FF] ml-[114px] underline text-[14px] cursor-pointer max-sm:ml-[77px]">Восстановить пароль</button>
                    <div className="mt-[20px] mb-[39px] max-sm:mb-[0px]">
                        <span className="text-[#949494]">Войти через:</span>
                        <div className="flex gap-[10px] mt-[15px]">
                            <button disabled className="w-[96px] h-[31px] pl-[20px] border border-[#5970FF80] cursor-pointer rounded-[3px]"><img src="/src/assets/svg/authorization/facebook.svg" alt="google" /></button>
                            <button disabled className="w-[96px] h-[31px] pl-[20px] border border-[#5970FF80] cursor-pointer rounded-[3px]"><img src="/src/assets/svg/authorization/facebook.svg" alt="facebook" /></button>
                            <button disabled className="w-[96px] h-[31px] pl-[20px] border border-[#5970FF80] cursor-pointer rounded-[3px]"><img src="/src/assets/svg/authorization/yandex.svg" alt="yandex" /></button>
                        </div>
                    </div>
                </div>
                <div className="hidden w-[335px] h-[356px] max-sm:block max-sm:mt-[49px]">
                    <img src="/src/assets/img/characters.png" alt="characters" className="" />
                </div>
                
            </section>
        </main>
    )
}


export default Authorization;