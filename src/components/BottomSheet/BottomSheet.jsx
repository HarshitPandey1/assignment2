import React, { useRef, useState, useEffect } from 'react';
import { useSpringMotion } from '../useSpringMotion';
import './BottomSheet.css';

export default function BottomSheet() {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const snapPoints = {
    FULL: 60,
    HALF: window.innerHeight * 0.5,
    CLOSED: window.innerHeight,
  };

  const [position, setPosition] = useState(snapPoints.CLOSED);

  const setSpringTarget = useSpringMotion({
    onUpdate: (val) => {
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${val}px)`;
      }
    },
    onRest: () => setPosition(current => current),
  });

  useEffect(() => {
    setSpringTarget(snapPoints.CLOSED);
  }, []);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = y - startY.current;
    const newY = Math.min(Math.max(position + diff, snapPoints.FULL), snapPoints.CLOSED);
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${newY}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
    const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const diff = endY - startY.current;
    const currentY = position + diff;

    const clampedY = Math.max(Math.min(currentY, snapPoints.CLOSED), snapPoints.FULL);
    const distances = Object.values(snapPoints).map((point) => ({
      point,
      distance: Math.abs(clampedY - point),
    }));

    distances.sort((a, b) => a.distance - b.distance);
    const nearest = distances[0].point;

    setPosition(nearest);
    setSpringTarget(nearest);
  };

  const goTo = (point) => {
    setPosition(snapPoints[point]);
    setSpringTarget(snapPoints[point]);
  };

  return (
    <>
      <div
        ref={sheetRef}
        className="bottom-sheet"
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="handle" />
        <div className="content">
          <h2>Bottom Sheet</h2>
          <p>This is a spring-animated bottom sheet.</p>
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
