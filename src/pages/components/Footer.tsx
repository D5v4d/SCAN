const Footer = () => {
    return (
        <footer className="h-[137px] bg-[#029491] flex items-center justify-between pl-[60px] pr-[45px] max-sm:px-[20px] max-sm:py-[25px]">
            <img
                className="w-[140px] h-[58px]  max-sm:mt-[-55px] max-sm:w-[107px] max-sm:h-[40px]"
                src="/assets/svg/logo-footer.svg"
                alt="Logo"

            />
            <ul className="text-[14px] text-right text-white space-y-[-3px]">
                <li>г. Москва, Цветной б-р, 40</li>
                <li>+7 495 771 21 11</li>
                <li>info@skan.ru</li>
                <li className="pt-[21px]">Copyright. 2022</li>
            </ul>
        </footer>
    )
}


export default Footer;