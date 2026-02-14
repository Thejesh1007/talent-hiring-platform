import Navbar from "../components/Navbar";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/cards.css";
import "../styles/forms.css";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container">
        {children}
      </div>
    </>
  );
};

export default Layout;
