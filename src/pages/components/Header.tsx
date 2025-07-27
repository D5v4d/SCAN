import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { upActive, logoutUser, userInformation } from "../../redux/slice/authorizationSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Header = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const authorization = useSelector((state: RootState) => state.authorization);
    const { user, loadingUserInformation } = useSelector((state: RootState) => state.authorization);
    const token = user?.token?.accessToken;
    const { companyLimit, usedCompanyCount } = user?.eventFiltersInfo || {};
    const [menuActive, setMenuActive] = useState(false);

    useEffect(() => {
        if (token) {
            dispatch(userInformation({ token }));
        }
    }, [dispatch, token]);

    const entrance = (e: string) => {
        dispatch(upActive(e));
        setMenuActive(false);
    };

    const handleExit = () => {
        dispatch(logoutUser(false));
        navigate('/');
    };

    const toggleMenu = () => setMenuActive(prev => !prev);

    return (
        <header className={`h-[93px] pl-[60px] pr-[60px] flex items-center max-sm:pl-[14px] max-sm:pr-[0px] ${menuActive ? 'max-sm:bg-[#029491] max-sm:h-[491px] max-sm:flex-wrap max-sm:pb-[77px]' : 'max-sm:h-[93px]'}`}>
            <Link className="w-[135px] block" to="/">
                <img
                    className={`max-sm:w-[111px] max-sm:h-[36px] block ${menuActive && 'max-sm:mt-[-16px] '}`}
                    src={`/src/assets/svg/${menuActive ? 'logo-header-mobail' : "logo-header"}.svg`}  
                    alt="Logo"
                />
            </Link>
            <button onClick={toggleMenu} className={`hidden max-sm:ml-[173px] max-sm:block cursor-pointer ${menuActive && 'max-sm:mt-[-18px] '}`}>
                {menuActive ?
                    <img
                        src="/src/assets/svg/cross.svg"
                        alt="cross"
                    />
                    :
                    <img
                        src="/src/assets/svg/burger.svg"
                        alt="burger"
                    />}
            </button>
            <nav className={`ml-[401px] ${menuActive ? 'max-sm:ml-[141px]' : 'max-sm:hidden'}`}>
                <ul className={`p-0 list-none flex gap-[49px] w-[236px] text-[14px] ${menuActive && 'max-sm:justify-center max-sm:w-[65px] max-sm:gap-[26px] max-sm:flex-wrap max-sm:text-[16px] max-sm:text-white'}`}>
                    <li className='cursor-pointer'><Link to="/">Главная</Link></li>
                    <li className='cursor-pointer'>Тарифы</li>
                    <li className='cursor-pointer'>FAQ</li>
                </ul>
            </nav>
            {!token ?
                <div className={`w-[251px] h-[26px] ml-[291px] flex justify-between ${menuActive ? 'max-sm:flex-wrap max-sm:ml-[26px] max-sm:gap-[20px] max-sm:justify-center max-sm:w-[295px]' : 'max-sm:hidden'}`}>
                    <button disabled onClick={() => (entrance("register"))} className={`w-[146px] h-[26px] text-[14px] cursor-pointer ${authorization.entrance === 'register' ? 'bg-[#7CE3E1] rounded-[5px] font-medium' : 'opacity-40'} max-sm:h-[19px] max-sm:w-[167px] max-sm:text-white`}>Зарегистрироваться</button>
                    <div className='w-[2px] h-[26px] bg-[#029491] max-sm:hidden'></div>
                    <button onClick={() => (entrance("enter"))} className={`w-[65px] h-[26px] text-[14px] cursor-pointer ${authorization.entrance === 'enter' ? 'bg-[#7CE3E1] rounded-[5px] font-medium' : 'opacity-40'} max-sm:bg-[#7CE3E1] max-sm:h-[51px] max-sm:w-[295px] max-sm:text-[20px]`}><Link to="/authorization">Войти</Link></button>
                </div>
                :
                <div className={`flex items-center ml-[128px] max-sm:ml-[138px] ${!menuActive && 'max-sm:absolute'}`}>
                    <div className={`flex justify-between h-[63px]  max-sm:h-[75px] ${menuActive && 'max-sm:hidden'}`}>
                        {loadingUserInformation ?
                            <div className="w-[175px] bg-[rgb(217,217,217,0.3)] rounded-[5px] flex items-center justify-center max-sm:w-[132px]">
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 23, color: '#797979' }} spin />} />
                            </div> :
                            <div className="w-[175px] bg-[rgb(217,217,217,0.3)] rounded-[5px] pt-[8px] pl-[10px] pb-[18px] max-sm:w-[132px] max-sm:py-[5px]">
                                <span className="opacity-40 text-[10px] mr-[9px] max-sm:text-[8px] max-sm:block">Использовано компаний</span><span className="absolute mt-[3px] text-[14px] text-black font-bold opacity-100 max-sm:block max-sm:mt-[0px]">{companyLimit}</span><br />
                                <span className="opacity-40 text-[10px] mr-[9px] max-sm:text-[8px] max-sm:block">Лимит по компаниям </span><span className="absolute mt-[3px] text-[14px] text-[#8AC540] font-bold opacity-100 max-sm:block max-sm:mt-[0px]">{usedCompanyCount}</span>
                            </div>
                        }
                    </div>
                    <div className={`flex w-[116px] h-[32px] ml-[128px] ${!menuActive ? 'max-sm:hidden' : 'max-sm:ml-[-25px]'}`}>
                        <div className="leading-none text-right mr-[4px]">
                            <span className="text-[14px] opacity-70 max-sm:text-white max-sm:opacity-80">Алексей А.</span>
                            <button
                                className="text-[10px] opacity-40 cursor-pointer max-sm:text-white max-sm:opacity-80"
                                onClick={handleExit}>
                                Выйти
                            </button>
                        </div>
                        <img src="/src/assets/img/user.png" alt="Logo" />
                    </div>
                </div>
            }
        </header>
    )
}

export default Header;