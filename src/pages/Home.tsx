import ContentPane from "@/components/ContentPane";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const Home = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="flex items-start pt-16">
        <Sidebar />
        <ContentPane />
      </div>
    </div>
  );
};

export default Home;
