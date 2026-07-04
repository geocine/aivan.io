import Logo from '../images/aivan-logo-reverse.svg?url'

const Footer = () => (
  <footer className="mt-auto min-h-[200px] bg-[#006cb7] p-[15px] text-center text-[14px] leading-[21px] text-white">
    <a href="/">
      <img className="mx-auto block h-[58px] w-[150px]" src={Logo} alt="Aivan Monceller" />
    </a>
    <p className="my-[25px] text-[rgb(189,204,237)]">
      Building front-end applications, web APIs, system utilities and
      development tools using JavaScript, TypeScript, C# and Go.
    </p>
    <p className="my-[5px]">
      {new Date().getFullYear()}
      {` `}
      <a href="https://aivan.io">Aivan Monceller</a>. All Rights Reserved
    </p>
  </footer>
)

export default Footer
