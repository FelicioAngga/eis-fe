import jumbotronLogo from '../assets/images/jumbotron-login.png'

function NavBar() {
  return (
    <div className="px-10 py-4 border-b border-primary-200 flex justify-between items-center">
      <p className="text-blue font-bold text-2xl">Letjen Haryono  M.T.</p>
      <div className="flex gap-3">
        <img src={jumbotronLogo} className="size-12" />
        <div>
          <p className="font-medium">Felicio</p>
          <p className="font-bold text-blue">Administrator</p>
        </div>
      </div>
    </div>
  )
}

export default NavBar;
