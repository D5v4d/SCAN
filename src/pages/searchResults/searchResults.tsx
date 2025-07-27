import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { clearing, fetchHistograms, fetchPublications, fetchPublicationsItems, upListDocuments } from "../../redux/slice/searchResultsSlice";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const SearchResults = () => {

    const dispatch = useDispatch<AppDispatch>()
    const token = useSelector((state: RootState) => state.authorization.user.token.accessToken);
    const summary = useSelector((state: RootState) => state.searchResults.summary);
    const publicationsItems = useSelector((state: RootState) => state.searchResults.publicationsId);
    const listDocuments = useSelector((state: RootState) => state.searchResults.listDocuments);
    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(window.innerWidth > 640 ? 8 : 1)
    const items = publicationsItems.data
    const startData = publicationsItems.startData
    const endData = publicationsItems.endData


    useEffect(() => {
        const handleResize = () => {
            setEndIndex(window.innerWidth <= 640 ? 1 : 8);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        return () => {
            dispatch(clearing());
        };
    }, [dispatch]);


    useEffect(() => {
        const searchData = localStorage.getItem("filterData");

        if (token && searchData) {
            const search = JSON.parse(searchData)
            dispatch(fetchHistograms({ token, search }))
            dispatch(fetchPublicationsItems({ token, search }))
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (items.length) {
            dispatch(fetchPublications({ token, items, startData, endData }))
        }
    }, [dispatch, endData, items, startData, token]);


    const handleNextPage = () => {
        if (endIndex < summary.data.length) {
            setStartIndex(startIndex + 1)
            setEndIndex(endIndex + 1)
        }
    }

    const handlePrevPage = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1)
            setEndIndex(endIndex - 1)
        }
    }

    const AAA = () => {
        if (listDocuments.data.length < items.length) {
            dispatch(upListDocuments())
        } else {
            console.log("no")
        }
    }

    // Функция для преобразования XML-строки в HTML
    function cleanHtmlContent(html: string) {
        // Сначала преобразуем экранированные теги в обычные
        let cleaned = html
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');

        // Затем удаляем ненужные теги
        cleaned = cleaned
            .replace(/<div id="videoadv">\s*<\/div>/g, '')
            .replace(/<div>\s*<div id="adfox_\d+">\s*<\/div>\s*<\/div>/g, '')
            .replace(/<\/?(index|body|data|scandoc|sentence|entity|speech)[^>]*>/g, '')

            // Сохраняем нужные теги (strong, br)
            .replace(/<br\s*\/?>/g, '<br />') // Нормализуем br
            .trim();

        return cleaned;
    }


    const renderCleanHtml = (html: string) => {
        const cleaned = cleanHtmlContent(html);
        return <div dangerouslySetInnerHTML={{ __html: cleaned }} />;
    };

    return (
        <main className='pl-[60px] max-sm:pl-[14px]'>
            <section className="pt-[50px] max-sm:pt-[20px]">
                <div className="flex gap-[215px] max-sm:block">
                    <div className="w-[509px]">
                        <h1 style={{ fontFamily: 'Ferry' }} className="text-[40px] mb-[36px] max-sm:text-[28px] max-sm:mb-[21px] max-sm:w-[344px]">Ищем. Скоро <br /> будут результаты</h1>
                        <span className="block text-[20px] w-[405px] max-sm:text-[18px] ">Поиск может занять некоторое время, просим сохранять терпение.</span>
                    </div>
                    <img src="/assets/img/search-result.png" alt="search-result" className="max-sm:mt-[21px] mb-[59px]" />
                </div>
                <div className="mt-[-20px] max-sm:mt-[0px]">
                    <h1 style={{ fontFamily: 'Ferry' }} className="text-[30px] mb-[17px] max-sm:text-[28px] max-sm:mb-[10px]">Общая сводка</h1>
                    <span className="text-[18px] text-[#949494]">Найдено {summary.totalOptions} вариантов</span>
                    <div className="flex gap-1 mt-[27px] mb-[107px] max-sm:mt-[34px] max-sm:mb-[57px] max-sm:gap-0">
                        <button disabled={startIndex < 0} className=" cursor-pointer" onClick={handlePrevPage}>
                            <img className={`${startIndex > 0 ? 'opacity-70' : 'opacity-20'}`} src="/assets/svg/searchResults/left-arrow.svg" alt="left-arrow" />
                        </button>
                        <div className="w-[1260px] border-2 border-[#029491] rounded-[10px] flex max-sm:block max-sm:w-[298px]"> 
                            <div className="w-[133px] h-[158px] bg-[#029491] rounded-tl-[5px] rounded-bl-[5px] flex flex-col gap-[19px] px-[28px] py-[15px] text-[20px] text-[#FFFFFF] max-sm:px-[15px] max-sm:py-[23px] max-sm:block max-sm:w-auto max-sm:h-auto max-sm:rounded-bl-[0px]">
                                <span>Период</span>
                                <span className="max-sm:inline-block max-sm:ml-[49px] max-sm:mr-[20px]">Всего</span>
                                <span>Риски</span>
                            </div>

                            {summary.isLoadingSummary && (
                                <div className="flex flex-col gap-2.5 justify-center items-center w-[1127px]">
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 50, color: '#797979' }} spin />} />
                                    <span className="text-[18px]">Загружаем данные</span>
                                </div>
                            )}

                            {summary.isErrorSummary && (
                                <div className="flex flex-col gap-2.5 justify-center items-center w-[1127px] max-sm:w-[298px]">
                                    <span className="text-[18px] text-red-500">Ошибка загрузки данных</span>
                                </div>
                            )}
                            {!summary.isLoadingSummary && !summary.isData && !summary.isErrorSummary && (
                                <div className="flex flex-col gap-2.5 justify-center items-center w-[1127px] max-sm:w-[298px]">
                                    <span className="text-[20px] text-amber-600">Нет данных</span>
                                </div>
                            )}

                            {!summary.isLoadingSummary && !summary.isErrorSummary && (
                                <div className="flex">
                                    {summary.data.map((item, index) => (
                                        (index >= startIndex && index < endIndex &&
                                            <div key={index} className="w-[138px] h-[124px] flex flex-col items-center gap-[21px] mt-[17px] px-[20px] text-[18px] border-r-2 border-[rgb(148,148,148,0.4)] 
                                            max-sm:flex-row max-sm:gap-[65px] max-sm:border-none max-sm:h-[65px] max-sm:w-[298px] max-sm:pl-[10px] max-sm:mt-[0px] max-sm:text-[16px] ">
                                                <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                                                <span>{item.total}</span>
                                                <span>{item.risks}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                        <button disabled={endIndex > summary.data.length} className=" cursor-pointer" onClick={handleNextPage}>
                            <img className={`${endIndex < summary.data.length ? 'opacity-70' : 'opacity-20'}`} src="/assets/svg/searchResults/right-arrow.svg" alt="right-arrow" />
                        </button>
                    </div>
                </div>
                <div>
                    <h1 style={{ fontFamily: 'Ferry' }} className="text-[30px] max-sm:text-[28px]">Список документов</h1>
                    <div className="flex flex-wrap gap-[38px] mt-[58px] mb-[38px] max-sm:mt-[34px] max-sm:gap-[20px]">
                        {listDocuments.data.map((e, index) => (
                            <div key={index} className="w-[641px] h-[694px] rounded-[10px] card-shadow px-[30px] pt-[19px] pb-[35px] max-sm:px-[24px] max-sm:w-[335px]">
                                <div className="text-[#949494] mb-[24px] flex">
                                    <span className="mr-[14px] max-sm:text-[14px]">{new Date(e.issueDate).toLocaleDateString('ru-RU')}</span>
                                    <a href={e.url} className="underline max-sm:text-[14px] max-sm:line-clamp-1" target="_blank" rel="noopener noreferrer">{e.source.name}</a>
                                </div>
                                <div>
                                    <h1 className="text-[26px] h-[62px] font-medium line-clamp-2 leading-8 max-sm:text-[19px] max-sm:line-clamp-3 max-sm:leading-5">{e.title.text}</h1>
                                    <div className="flex gap-[10px] my-[14px] h-[22px]">
                                        {e.attributes.isAnnouncement && <div className="bg-[#FFB64F] rounded-[5px] px-[12px] py-[3px] text-[12px]">Aнонсы и события</div>}
                                        {e.attributes.isDigest && <div className="bg-[#FFB64F] rounded-[5px] px-[12px] py-[3px] text-[12px]">Cводки новостей</div>}
                                        {e.attributes.isTechNews && <div className="bg-[#FFB64F] rounded-[5px] px-[12px] py-[3px] text-[12px]">Tехнические новости</div>}
                                    </div>
                                    <div className="h-[406px] text-[rgb(0,0,0,0.5)] overflow-hidden  line-clamp-17">
                                        {renderCleanHtml(e.content.markup)}
                                    </div>
                                    <div className="flex justify-between mt-[32px] items-end">
                                        <button className="w-[223px] h-[46px] bg-[#7CE3E1] rounded-[5px] cursor-pointer  max-sm:text-[14px] max-sm:w-[195px] max-sm:h-[40px]"><a href={e.url} target="_blank" rel="noopener noreferrer">Читать в источнике</a></button>
                                        <span className="text-[#949494] max-sm:text-[14px]">{e.attributes.wordCount} слов</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mb-[109px] text-center max-sm:mb-[57px]">
                        {listDocuments.isLoadinglistDocuments &&
                            <div className="flex flex-col gap-2.5 items-center">
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 50, color: '#797979' }} spin />} />
                                <span className="text-[18px]">Загружаем данные</span>
                            </div>
                        }
                        {listDocuments.isErrorlistDocuments && (
                            <div className="flex flex-col gap-2.5 justify-center items-center w-[1127px]">
                                <span className="text-[18px] text-red-500">Ошибка загрузки данных</span>
                            </div>
                        )}
                        {!listDocuments.isLoadinglistDocuments && !listDocuments.isErrorlistDocuments && (
                            (!summary.isData ?
                                <span className="text-center text-[20px] text-amber-600">Нет документов</span>
                                :
                                (listDocuments.data.length < items.length &&
                                    <button onClick={AAA} className="w-[305px] h-[59px] bg-[#5970FF] text-white font-medium rounded-[5px] text-[22px] cursor-pointer max-sm:w-[335px] max-sm:block">
                                        Показать больше
                                    </button>)
                            )
                        )}
                    </div>

                </div>


            </section>
        </main >
    )
}

export default SearchResults;