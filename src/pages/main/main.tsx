import { useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
const Main = () => {
    const authorization = useSelector((state: RootState) => state.authorization.user.token.accessToken);
    const navigate = useNavigate();

    const [cards, setCards] = useState([
        {
            img: '/assets/svg/main/time.svg',
            alt: 'time',
            text: 'Высокая и оперативная скорость обработки заявки',
        },
        {
            img: '/assets/svg/main/search.svg',
            alt: 'search',
            text: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос',
        },
        {
            img: '/assets/svg/main/lock.svg',
            alt: 'lock',
            text: 'Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству',
        },
        {
            img: '/assets/svg/main/search.svg',
            alt: 'search',
            text: 'Высокая и оперативная скорость обработки заявки',
        },
        {
            img: '/assets/svg/main/search.svg',
            alt: 'search',
            text: 'Высокая и оперативная скорость обработки заявки',
        },
    ])

    const tariffs = [
        {
            tariff: 'Beginner',
            descriptionTariff: 'Для небольшого исследования',
            price: '799 ₽',
            oldPrice: '1 200 ₽',
            installment: 'или 150 ₽/мес. при рассрочке на 24 мес.',
            services: ['Безлимитная история запросов', 'Безопасная сделка', 'Поддержка 24/7'],
            img: '/assets/svg/main/light-bulb.svg',
            imgMobail: '/assets/svg/main/mobail/light-bulb.svg',
            alt: 'light-bulb',
        },
        {
            tariff: 'Pro',
            descriptionTariff: 'Для HR и фрилансеров',
            price: '1 299 ₽',
            oldPrice: '2 600 ₽',
            installment: 'или 279 ₽/мес. при рассрочке на 24 мес.',
            services: ['Все пункты тарифа Beginner', 'Экспорт истории', 'Рекомендации по приоритетам'],
            img: '/assets/svg/main/target.svg',
            imgMobail: '/assets/svg/main/mobail/target.svg',
            alt: 'target',
        },
        {
            tariff: 'Business',
            descriptionTariff: 'Для корпоративных клиентов',
            price: '2 379 ₽',
            oldPrice: '3 700 ₽',
            installment: false,
            services: ['Все пункты тарифа Pro', 'Безлимитное количество запросов', 'Приоритетная поддержка'],
            img: '/assets/svg/main/laptop.svg',
            imgMobail: '/assets/svg/main/mobail/laptop.svg',
            alt: 'laptop',
        },
    ]

    const cardPrev = () => {
        setCards(prev => {
            const newCards = [...prev]
            const lastCard = newCards.pop()
            return lastCard ? [lastCard, ...newCards] : newCards
        })
    }

    const cardNext = () => {
        setCards(prev => {
            const [firstCard, ...rest] = prev
            return [...rest, firstCard]
        })
    }

    const slider = (start: number, end: number,) => (
        cards.slice(start, end).map((item, index) => (
            <div key={index} className='w-[400px] h-[225px] rounded-[10px] card-shadow pt-[22px] pl-[22px] 
            max-sm:w-[298px] max-sm:h-[188px] max-sm:pt-[18px] max-sm:pl-[16px] max-sm:pr-[28px] max-sm:line-clamp-3'>
                <img src={item.img} alt={item.alt} />
                <p className='mt-[19px] max-sm:text-[18px]'>{item.text}</p>
            </div>
        ))
    )
    
    return (
        <main className='pl-[60px] pr-[60px] max-sm:pl-[14px] max-sm:pr-[0px]'>
            <section className='flex mt-[70px] max-sm:block'>
                <div className="w-[743px]  max-sm:w-[335px]">
                    <h1 style={{ fontFamily: 'Ferry' }} className="leading-[120%] text-[60px] max-sm:text-[28px]">СЕРВИС ПО ПОИСКУ ПУБЛИКАЦИЙ<br />О КОМПАНИИ<br />ПО ЕГО ИНН</h1>
                    <p className='text-[20px] mt-[20px] mb-[70px] w-[530px] max-sm:w-[330px] max-sm:mb-[32px]'>
                        Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.
                    </p>
                    <button
                        disabled={!authorization}
                        className='w-[335px] h-[59px] bg-[#5970FF] text-[22px] text-[#ffffff] rounded-[5px] cursor-pointer'
                        onClick={() => { navigate('/search') }}>
                        Запросить данные
                    </button>
                </div>
                <img className='w-[600px] h-[600px] max-sm:w-[347px] max-sm:h-[342px] max-sm:mt-[24px]' src="/assets/img/Illustration.png" alt="Illustration" />
            </section>
            <section className='mt-[110px]'>
                <h1 style={{ fontFamily: 'Ferry' }} className='text-[45px] max-sm:text-[28px]'>Почему именно мы</h1>
                <div className='mt-[70px] mb-[70px] flex items-center max-sm:ml-[-14px]' >
                    <button onClick={cardPrev} className='cursor-pointer w-[39px] h-[39px]'><img src="/assets/svg/main/left-arrow.svg" alt="left-arrow" style={{ maxWidth: 'none' }} /></button>
                    <div className=' flex gap-[30px] max-sm:hidden'>{slider(0, 3)} </div>
                    <div className=' flex gap-[30px] sm:hidden'>{slider(0, 1)} </div>
                    <button onClick={cardNext} className='cursor-pointer w-[39px] h-[39px]'><img src="/assets/svg/main/right-arrow.svg" alt="right-arrow" style={{ maxWidth: 'none' }} /></button>
                </div>
                <img className='w-[1307px] h-[575px] max-sm:hidden' src="/assets/img/Illustration2.png" alt="Illustration2" />
                <img className='w-[361px] h-[400px] sm:hidden' src="/assets/img/Illustration2-mobail.png" alt="Illustration2-mobail" />
            </section>
            <section>
                <h1 style={{ fontFamily: 'Ferry' }} className='mt-[108px] mb-[70px] text-[45px] max-sm:mt-[74px] max-sm:mb-[37px] max-sm:text-[28px]'>НАШИ ТАРИФЫ</h1>
                <div className='flex justify-between mb-[118px] max-sm:block max-sm:mb-[0px] '>
                    {tariffs.map((item, index) => (
                        <div key={index} className='w-[415px] rounded-[10px] card-shadow  max-sm:w-[335px] max-sm:mb-[43px]'>
                            <div className={`rounded-t-lg flex justify-between pr-[10px] ${index === 0 ? 'bg-[#FFB64F]' : index === 1 ? 'bg-[#7CE3E1]' : 'bg-black'} max-sm:pb-[21px]`}>
                                <div className={`pl-[30px] pt-[30px] pb-[34px] ${index === 2 ? 'text-white' : 'text-black'} `}>
                                    <h1 className='text-[30px] font-medium max-sm:text-[20px] max-sm:mb-[18px]'>{item.tariff}</h1>
                                    <span className='text-[18px] max-sm:absolute'>{item.descriptionTariff}</span>
                                </div>
                                <img className='max-sm:hidden' src={item.img} alt={item.alt} style={{ marginTop: '-20px' }} />
                                <img className='sm:hidden' src={item.imgMobail} alt={item.alt} style={{ marginTop: '-30px' }} />
                            </div>
                            <div className={`rounded-b-lg pl-[30px] pt-[33px] ${index === 0 ? 'border-[#FFB64F] border-2' : ''} max-sm:pt-[20px] max-sm:pl-[24px]`}>
                                {authorization && index === 0 &&
                                    <div className='absolute w-[134px] h-[24px] bg-[#3BA5E0] rounded-[10px] text-white text-[14px] text-center ml-[235px] mt-[-22px] max-sm:hidden'>Текущий тариф</div>}

                                <div className='h-[22px]'>
                                    <span className='font-medium text-[30px] mr-[19px]'>{item.price}</span>
                                    <span className='line-through opacity-[50%] text-[25px] font-medium'>{item.oldPrice}</span> <br />
                                    <span className='text-[18px]'>{item.installment}</span>
                                </div>
                                <ul className='mt-[90px] mb-[55px] max-sm:mt-[110px]'>
                                    <h2 className='font-medium text-[20px] mb-[5px] max-sm:text-[18px]'>В тариф входит:</h2>
                                    {item.services.map((service, serviceIndex) => (
                                        <li key={serviceIndex} className='flex gap-2 text-[18px] max-sm:text-[16px]'><img src='/assets/svg/main/check-mark.svg' alt="check-mark" />{service}</li>
                                    ))}
                                </ul>
                                <button className={`${authorization && index === 0 ? 'bg-[#D2D2D2]' : 'bg-[#5970FF]'} w-[355px] h-[59px] mb-[24px] text-[20px] rounded-[5px] cursor-pointer max-sm:text-[18px] max-sm:w-[286px] max-sm:mb-[31px]`}>
                                    {authorization && index === 0 ? 'Перейти в личный кабинет' : 'Подробнее'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>

    )
}


export default Main;