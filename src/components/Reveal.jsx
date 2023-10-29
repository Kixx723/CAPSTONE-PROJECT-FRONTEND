import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const Reveal = ({ children }) => {

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true }); 
    //sa scroll effect kaning once true kay pag mag effect pababa ang transition ug animation once lang kung mag saka ka di naka siya mag ulit

    const mainControls = useAnimation();

    useEffect(() => {
        if(isInView){
            mainControls.start("visible");
        }
    },[isInView]);
    
  return (
    <div ref={ref} className='relative overflow-hidden'>
        <motion.div
        variants={{
            hidden: { opacity: 0, y: 75},
            visible: { opacity: 1, y: 0},
        }}
        initial="hidden"
        animate={mainControls} // mag left to right tapos kung positive 100 mag right to left
        transition={{ duration: 0.5, delay: 0.25 }}
        >
          {children}
        </motion.div>
    </div>
  )
}

export default Reveal;