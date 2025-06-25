import React, { useRef, useState, useEffect } from 'react';
import './BottomSheet.css';

export default function BottomSheet() {
  const sheetRef = useRef(null);
  const [position, setPosition] = useState('CLOSED');

  const snapPoints = {
    FULL: 60,
    HALF: window.innerHeight * 0.5,
    CLOSED: window.innerHeight,
  };

  const goTo = (point) => {
    const y = snapPoints[point];
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${y}px)`;
      setPosition(point);
    }
  };

  useEffect(() => {
    // Set initial position
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${snapPoints.CLOSED}px)`;
    }
  }, []);

  return (
    <>
      <div ref={sheetRef} className="bottom-sheet">
        <div className="handle" />
        <div className="content">
          <h2>Bottom Sheet</h2>
          <p>This is a basic bottom sheet layout</p>
        </div>
      </div>

      <div className="button-bar">
        <button onClick={() => goTo('FULL')}>Open Full</button>
        <button onClick={() => goTo('HALF')}>Half Open</button>
        <button onClick={() => goTo('CLOSED')}>Close</button>
      </div>
    </>
  );
}
