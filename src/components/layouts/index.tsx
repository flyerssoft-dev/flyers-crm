import LayoutContent from './LayoutContent';
import LayoutHeader from './LayoutHeader';
import LayoutNavBar from './layoutNavBar';

const MainLayout = () => {
  // const [mobileView, setMobileView] = useState(false);

  // const handleMobileView = () => {
  //   setMobileView(window.innerWidth < 768);
  // };

  // useEffect(() => {
  //   handleMobileView();
  //   window.addEventListener("resize", handleMobileView);

  //   return () => {
  //     window.removeEventListener("resize", handleMobileView);
  //   };
  // }, []);

  // if (mobileView) {
  //   return <WindowSize />;
  // }

  return (
    <section className="h-screen w-full flex">
      <LayoutNavBar />
      <section className="w-full h-full overflow-hidden transition-all duration-300 ease-in-out">
        <LayoutHeader />
        <LayoutContent />
      </section>
    </section>
  );
};

export default MainLayout;
