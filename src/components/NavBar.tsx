import NavBarPopOver from './NavBarPopOver';

function NavBar() {
  return (
    <div className="px-10 py-4 border-b border-primary-200 flex justify-between items-center">
      {/* <p className="text-blue font-bold text-2xl">Letjen Haryono  M.T.</p> */}
      <p className="text-blue font-bold text-2xl">LoremIpsum</p>
      <NavBarPopOver />
    </div>
  )
}

export default NavBar;
