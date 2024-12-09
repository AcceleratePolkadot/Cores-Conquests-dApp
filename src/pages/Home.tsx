import ContentPane from "@/components/ContentPane";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="flex items-start">
        <ContentPane />
      </div>
    </div>
  );
};

export default Home;
