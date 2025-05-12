export const HamburgerMenu = () => {
  return (
    <div className="absolute inset-0 pointer-events-none lg:hidden">
      <div className="absolute inset-0 opacity-[.03] bg-n-8"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-n-8/0 to-n-8/100"></div>
    </div>
  );
};