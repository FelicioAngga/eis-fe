import NavBarPopOver from './NavBarPopOver';

function NavBar() {
  return (
    <div className="px-4 md:px-10 py-4 border-b border-primary-200 flex justify-between items-center print:hidden">
      <p className="text-blue font-bold md:text-2xl">Letjen Haryono  M.T.</p>
      <NavBarPopOver />
    </div>
  )
}

export default NavBar;
