import './search.css'
import { useEffect } from "react";
import { Checkbox, DatePicker, Select } from "antd";
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { clearing, upBtnSearchActive, upChecked, upInnOfTheCompany, upNumberOfDocuments, upSearchRange, upTonality } from '../../redux/slice/searchSlice';
import { useNavigate } from 'react-router-dom';

const validateInn = (inn: string) => {
    // Запрет "0000000000"
    if (inn === '0000000000') {
        const valid = false;
        return valid;
    }

    // Расчёт контрольного числа
    const coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    const sum = coefficients.reduce((acc, coef, i) => acc + coef * parseInt(inn[i]), 0);
    const n10 = sum % 11 % 10;
    const valid = n10 === parseInt(inn[9])
    return valid;
};


const Search = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();
    const search = useSelector((state: RootState) => state.search);
    const searchRange = search.searchRange
    const numberOfDocuments = search.numberOfDocuments
    const innOfTheCompany = search.innOfTheCompany

    const hasInn = innOfTheCompany.inn && !innOfTheCompany.errorInn
    const hasQuantity = numberOfDocuments.quantity && !numberOfDocuments.errorQuantity
    const hasValidDates = searchRange.startDate && searchRange.endDate && !searchRange.errorDate;


    useEffect(() => {
        return () => {
            dispatch(clearing());
        };
    }, [dispatch]);

    useEffect(() => {
        if (searchRange.startDate && searchRange.endDate) {
            const start = dayjs(searchRange.startDate);
            const end = dayjs(searchRange.endDate);

            if (start.isAfter(end)) {
                dispatch(upSearchRange({ data: true, field: 'errorDate' }));
            } else {
                dispatch(upSearchRange({ data: false, field: 'errorDate' }));

            }
        }
    }, [dispatch, searchRange.endDate, searchRange.startDate]);

    useEffect(() => {
        const btnActive = hasInn && hasQuantity && hasValidDates
        dispatch(upBtnSearchActive(btnActive))
    }, [dispatch, hasInn, hasQuantity, hasValidDates]);

    const handleStartDateChange = (date: dayjs.Dayjs | null) => {
        dispatch(upSearchRange({ data: date ? date.format('YYYY-MM-DDTHH:mm:ssZ') : null, field: 'StartDate' }));
    };

    const handleEndDate = (date: dayjs.Dayjs | null) => {
        dispatch(upSearchRange({ data: date ? date.format('YYYY-MM-DDTHH:mm:ssZ') : null, field: 'endDate' }));
    };

    const valueNumberDocuments = (value: string) => {
        dispatch(upNumberOfDocuments({ data: value, field: 'value' }));
        const isValid = value !== '' && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 1000;
        dispatch(upNumberOfDocuments({ error: !isValid, field: 'error' }));
    };

    const handleInnChange = (value: string) => {
        const isValid = validateInn(value);
        if (value.length === 10 && isValid) {
            dispatch(upInnOfTheCompany({ inn: value, isValid: false }));
        } else {
            dispatch(upInnOfTheCompany({ isValid: true }));
        }
    };

    const changeTonality = (value: string) => {
        if (value === 'Любая') {
            value = 'any'
        } else if (value === 'Позитивная') {
            value = 'positive'
        } else if (value === 'Негативная') {
            value = 'negative'
        }
        dispatch(upTonality({ data: value }));
    }

    const checked = (value: string) => {
        dispatch(upChecked(value));
    }

    const filterData = () => {
        localStorage.removeItem("filterData");
        localStorage.setItem("filterData", JSON.stringify(search));
        navigate('/search-results')
    }

    return (
        <main className="pl-[53px] max-sm:pl-[14px]">
            <section className="pt-[69px] pb-[64px] max-sm:pt-[20px] max-sm:pb-[24px]">
                <div className="flex mb-[47px] max-sm:block max-sm:mb-[21px]">
                    <div>
                        <h1 style={{ fontFamily: "Ferry" }} className="text-[40px] w-[640px] leading-11 mb-[25px] max-sm:w-[285px] max-sm:text-[28px] max-sm:mb-[19px] max-sm:leading-8">
                            Найдите необходимые данные в пару кликов.
                        </h1>
                        <span className="text-[20px] max-sm:text-[18px] max-sm:w-[250px] max-sm:block">
                            Задайте параметры поиска.
                            <br />
                            Чем больше заполните, тем точнее поиск
                        </span>
                    </div>
                    <img
                        src="/assets/svg/search/document.svg"
                        alt="document"
                        className="ml-[238px] mt-[65px] max-sm:absolute max-sm:ml-[277px] max-sm:mt-[-134px] max-sm:w-[58px] max-sm:h-[71px]"
                    />
                    <img
                        src="/assets/svg/search/folders.svg"
                        alt="folders"
                        className="ml-[166px] mt-[65px] max-sm:hidden"
                    />
                </div>
                <div className='flex max-sm:block'>
                    <form onSubmit={(e) => (e.preventDefault())} className="card-shadow w-[872px] h-[543px] pl-[44px] pr-[39px] rounded-[10px] flex gap-[11px] max-sm:pl-[14px] max-sm:pr-[26px] max-sm:ml-[-14px] max-sm:w-[375px] max-sm:h-[668px]">
                        <div className="flex flex-col mt-[21px] max-sm:mt-[20px]">
                            <label className="">
                                <h1 className='text-[18px] leading-none'>ИНН компании<span className={`text-[25px] ml-0.5 ${innOfTheCompany.errorInn && 'text-[#FF5959]'}`}>*</span></h1>
                                <input
                                    required
                                    type="number"
                                    className={`input border ${innOfTheCompany.errorInn && 'error'} max-sm:w-[335px]!`}
                                    inputMode="numeric"
                                    placeholder="10 цифр"
                                    maxLength={10}
                                    onChange={(e) => handleInnChange(e.target.value)}
                                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.replace(/\D/g, '').slice(0, 10);
                                    }}
                                />
                                {innOfTheCompany.errorInn &&
                                    <div className='absolute w-[242px] mt-[2px] text-center text-[#FF5959]'><span>Введите корректные данные</span></div>
                                }
                            </label>
                            <label className="mt-[30px] mb-[30px]">
                                <h1 className='text-[18px] leading-none'>Тональность</h1>
                                <Select
                                    defaultValue="Любая"
                                    className='w-[242px] max-sm:w-[335px]'
                                    style={{ height: 43, marginTop: 20 }}
                                    onChange={changeTonality}
                                    options={[
                                        { value: 'Любая' },
                                        { value: 'Позитивная' },
                                        { value: 'Негативная' },
                                    ]}
                                    suffixIcon={<img src="/assets/svg/search/down-arrow.svg" alt="down-arrow" />}
                                />
                            </label>
                            <label>
                                <h1 className='text-[18px] leading-none'>Количество документов в выдаче<span className={`text-[25px] ml-0.5 ${numberOfDocuments.errorQuantity && 'text-[#FF5959]'}`}>*</span></h1>
                                <input
                                    required
                                    type="number"
                                    className={`input border ${numberOfDocuments.errorQuantity && 'error'} max-sm:w-[335px]!`}
                                    placeholder='От 1 до 1000'
                                    onChange={e => valueNumberDocuments(e.target.value)}
                                    maxLength={4}
                                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                        const target = e.target as HTMLInputElement;
                                        if (target.value.length > 4) {
                                            target.value = target.value.slice(0, 4);
                                        }
                                    }}
                                />
                                {numberOfDocuments.errorQuantity &&
                                    <div className='absolute w-[242px] mt-[5px] text-center text-[#FF5959]'><span>Введите корректные данные</span></div>
                                }
                            </label>
                            <label className="mt-[42px] max-sm:mt-[21px]">
                                <h1 className='text-[18px] leading-none'>Диапазон поиска<span className={`text-[25px] ml-0.5 ${searchRange.errorDate && 'text-[#FF5959]'}`}>*</span></h1>
                                <div className='mt-[20px]'>
                                    <DatePicker
                                        required
                                        className="w-[176px] h-[43px] max-sm:w-[335px]"
                                        status={searchRange.errorDate ? "error" : ""}
                                        onChange={handleStartDateChange}
                                        format="DD.MM.YYYY"
                                        placeholder="Дата начала"
                                        style={{ color: `${!searchRange.errorDate ? 'black' : '#FF5959'}`, paddingLeft: `${searchRange.startDate ? '17px' : '44px'}`, marginRight: '20px' }}
                                        suffixIcon={<img src="/assets/svg/search/down-arrow.svg" alt="down-arrow" />}
                                    />
                                    <DatePicker
                                        required
                                        className="w-[176px] h-[43px] max-sm:w-[335px] max-sm:mt-[20px]!"
                                        status={searchRange.errorDate ? "error" : ""}
                                        onChange={handleEndDate}
                                        format="DD.MM.YYYY"
                                        placeholder="Дата конца"
                                        style={{ color: `${!searchRange.errorDate ? 'black' : '#FF5959'}`, paddingLeft: `${searchRange.endDate ? '17px' : '44px'}` }}
                                        suffixIcon={<img src="/assets/svg/search/down-arrow.svg" alt="down-arrow" />}
                                    />
                                    {searchRange.errorDate && <div className='absolute w-[372px] mt-[7px] text-center text-[#FF5959]'><span>Введите корректные данные</span></div>}
                                </div>
                            </label>
                        </div>
                        <div className="mt-[36px] flex flex-col gap-[6px] max-sm:hidden">
                            <Checkbox onClick={() => checked('maximumCompleteness')} className={`custom-checkbox ${search.maximumCompleteness && 'custom-checkbox-active'}`}>Признак максимальной полноты</Checkbox>
                            <Checkbox onClick={() => checked('businessContext')} className={`custom-checkbox ${search.businessContext && 'custom-checkbox-active'}`}>Упоминания в бизнес-контексте</Checkbox>
                            <Checkbox onClick={() => checked('mainPublication')} className={`custom-checkbox ${search.mainPublication && 'custom-checkbox-active'}`}>Главная роль в публикации</Checkbox>
                            <Checkbox onClick={() => checked('riskFactorPublications')} className={`custom-checkbox ${search.riskFactorPublications && 'custom-checkbox-active'}`}>Публикации только с риск-факторами</Checkbox>
                            <Checkbox onClick={() => checked('technicalNewsMarkets')} className={`custom-checkbox ${search.technicalNewsMarkets && 'custom-checkbox-active'}`}>Включать технические новости рынков</Checkbox>
                            <Checkbox onClick={() => checked('announcementsAndCalendars')} className={`custom-checkbox ${search.announcementsAndCalendars && 'custom-checkbox-active'}`}>Включать анонсы и календари</Checkbox>
                            <Checkbox onClick={() => checked('newsSummaries')} className={`custom-checkbox ${search.newsSummaries && 'custom-checkbox-active'}`}>Включать сводки новостей</Checkbox>
                        </div>
                        <div className='absolute mt-[425px] ml-[484px] max-sm:mt-[545px] max-sm:mb-[37px] max-sm:ml-[0px] '>
                            <button
                                disabled={!search.btnSearchActive}
                                onClick={filterData}
                                className={`w-[305px] h-[59px] text-[22px] text-white rounded-[5px] mb-[8px] cursor-pointer bg-[#5970FF] ${!search.btnSearchActive && 'opacity-40'} max-sm:w-[335px]`} >
                                Поиск
                            </button>
                            <br />
                            <span className='text-[#949494]'>* Обязательные к заполнению поля</span>
                        </div>
                    </form>
                    <img src="/assets/img/rocket.png" alt="rocket" className='w-[434px] h-[485px] ml-[87px] mt-[67px] max-sm:ml-[22px] max-sm:mt-[24px] max-sm:w-[339px] max-sm:h-[403px] ' />
                </div>
            </section>
        </main>
    );
};

export default Search;
