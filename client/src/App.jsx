import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';


const App = () => {
  return (
    <>
      <Header />
      <main className="py-3 " style={{ backgroundColor: "#DFDCE3", minHeight: 'calc(100vh - 140.247px)' }}>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;