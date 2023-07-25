import React, { useState, useEffect } from 'react';

const styles = {
  dayPopupContainer: {
    opacity: 1,
    transition: 'opacity 1s ease-in-out',
  },
  dayPopupFadeOut: {
    opacity: 0,
    transition: 'opacity 1s ease-in-out',
  },
};

const DayPopup = ({ ...props }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowPopup(true);
    }, 0);

    const fadeOutTimeout = setTimeout(() => {
      setShowPopup(false);
    }, 4000);

    return () => clearTimeout(fadeOutTimeout);
  }, []);

  return (
    <div style={showPopup ? styles.dayPopupContainer : styles.dayPopupFadeOut}>
      {/* Your popup content */}
      <div
        style={{
          background: '#f3b7bf',
          borderRadius: '30.94px',
          borderStyle: 'solid',
          borderColor: '#000000',
          borderWidth: '5.16px',
          padding: '61.87px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12.89px',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          position: 'relative',
          boxShadow:
            '0px 5.16px 5.16px 0px rgba(0, 0, 0, 0.25), 10.31px 10.31px 0px 0px rgba(0, 0, 0, 1)',
        }}
      >
        {/* Your popup content */}
        <div
          style={{
            flexShrink: '0',
            width: '59.29px',
            height: '0.01px',
            position: 'relative',
            transformOrigin: '0 0',
            transform: 'rotate(0deg) scale(1, -1)',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '72.18px',
              borderStyle: 'solid',
              borderColor: '#000000',
              borderWidth: '5.16px',
              padding: '10.31px 21.91px 10.31px 21.91px',
              display: 'flex',
              flexDirection: 'row',
              gap: '12.89px',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '229.44px',
              height: '45px',
              position: 'absolute',
              left: 180,
              top: 'calc(50% - -37.37px)',
            }}
          ></div>
        </div>

        <div
          style={{
            color: '#ffffff',
            textAlign: 'center',
            font: '400 42px "RixInooAriDuri", sans-serif',
            position: 'relative',
            width: '661.26px',
            WebkitTextStroke: '1px black',
          }}
        >
          닉네임 님이 추방되었습니다.
        </div>
      </div>
      {/* End of your popup content */}
    </div>
  );
};

export default DayPopup;
