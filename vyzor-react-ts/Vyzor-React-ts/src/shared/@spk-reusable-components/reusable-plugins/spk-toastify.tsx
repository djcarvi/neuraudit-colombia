import React from 'react';
import { ToastContainer,  type ToastOptions, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SpkToastifyProps {
    message?: string;
    buttonLabel?: string;
    toastOptions?: ToastOptions;
    hideProgressBar?: boolean;
    newestOnTop?: boolean;
    closeOnClick?: boolean;
    rtl?: boolean;
    pauseOnFocusLoss?: boolean;
    draggable?: boolean;
    pauseOnHover?: boolean;
    position?: any;
}

const SpkToastify: React.FC<SpkToastifyProps> = ({ hideProgressBar = false, newestOnTop = false, closeOnClick = true, rtl = false, pauseOnFocusLoss = true, draggable = true, pauseOnHover = true, position }) => {

    return (
        <>
            <ToastContainer position={position} autoClose={5000} hideProgressBar={hideProgressBar} newestOnTop={newestOnTop} closeOnClick={closeOnClick} rtl={rtl} pauseOnFocusLoss={pauseOnFocusLoss} draggable={draggable} pauseOnHover={pauseOnHover} theme="light" transition={Bounce} />
        </>
    );
};
export default SpkToastify;