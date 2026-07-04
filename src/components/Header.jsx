import Logo from '../images/aivan-logo.svg?url'

const Header = () => (
  <header className="mb-[1.45rem] h-[65px] max-h-[65px] md:h-20 md:max-h-20">
    <div className="fixed inset-x-0 top-0 z-[1000] mx-auto bg-white text-center shadow-[0_0_5px_2px_rgba(0,0,0,0.1)]">
      <h1 className="m-0 inline-block text-[32px] leading-[48px]">
        <a className="text-white no-underline" href="/">
          <img className="mt-[5px] block w-[120px] md:w-[150px]" src={Logo} alt="Aivan Monceller" />
        </a>
      </h1>
    </div>
  </header>
)

export default Header
