import React, { useCallback, useEffect, useState } from "react";
import { shuffleArray } from "../../../configs/functions";
import "./CircleCharacters.css";

const CircleCharacter = ({
  isDowning,
  setIsDowning,
  char,
  index,
  crossing,
  setCrossing,
  charsRest,
  setCharsRest,
  setChars,
  chars,
}) => {
  const charsLength = chars.length;
  const isHovered = crossing.some(
    (cross) => cross.char === char && cross.index === index
  );

  const [style] = useState({
    left:
      (
        40 -
        35 * Math.cos(-0.5 * Math.PI - 2 * (1 / charsLength) * index * Math.PI)
      ).toFixed(4) + "%",
    top:
      (
        40 +
        35 * Math.sin(-0.5 * Math.PI - 2 * (1 / charsLength) * index * Math.PI)
      ).toFixed(4) + "%",
  });

  const onMouseOver = () => {
    if (!isHovered) {
      if (isDowning) {
        setCrossing([...crossing, { char, index }]);
      }
    }
  };

  const onMouseDown = () => {
    setIsDowning(true);
    setCrossing([...crossing, { char, index }]);
  };

  const onMouseLeave = () => {
    if (isDowning) {
      if (charsRest.length > 0)
        setChars(chars.map((ele, idx) => (idx === index ? charsRest[0] : ele)));
      setCharsRest(charsRest.slice(1));
    }
  };

  return (
    <div
      style={style}
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      className={`menu-item ${isHovered ? "hovered-item" : ""}`}
    >
      {char}
    </div>
  );
};

const CircleCharacters = ({ numChars }) => {
  const style = {
    width: 8 > 6 ? "320px" : "220px",
    height: 8 > 6 ? "320px" : "220px",
  };

  // useEffect(() => {
  //   var items = document.querySelectorAll(".circle-menu .menu-item");
  //   for (var i = 0, l = items.length; i < l; i++) {
  //     items[i].style.top = (40 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
  //     items[i].style.left = (40 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
  //   }
  // }, []);

  const [isDowning, setIsDowning] = useState(false);

  const [charsInitial, setCharsInitial] = useState([
    "c",
    "o",
    "n",
    "M",
    "E",
    "O",
    "W",
  ]);
  const [crossing, setCrossing] = useState([]);

  const [chars, setChars] = useState([]);
  const [charsRest, setCharsRest] = useState([]);

  const loadDecoys = useCallback(() => {
    const numDecoys = Math.round(charsInitial.length / 3);
    const decoys = [];
    for (let index = 0; index < numDecoys; index++) {
      // const boolean = Math.random() < 0.5;
      const boolean = Math.random() < 0.7; // 70% true
      const element = alphabet[Math.floor(Math.random() * alphabet.length)];
      decoys.push(boolean ? element.toLowerCase() : element.toUpperCase());
    }
    return decoys;
  }, [charsInitial]);

  useEffect(() => {
    const decoys = loadDecoys();
    const numChars = Math.round(charsInitial.length / 2);
    setChars(shuffleArray([...charsInitial.slice(0, numChars), ...decoys]));
    setCharsRest(charsInitial.slice(numChars, charsInitial.length));
  }, [charsInitial, loadDecoys, isDowning]);

  const onMouseUp = () => {
    setIsDowning(false);
    setCrossing([]);
  };

  return (
    <>
      <div className="crossing">
        {crossing.map((cross, index) => (
          <div key={index} className="crossing-item">
            {cross.char}
          </div>
        ))}
      </div>

      <div onMouseUp={onMouseUp}>
        <div className="circle-menu" style={style}>
          {chars.map((char, index) => (
            <CircleCharacter
              crossing={crossing}
              setCrossing={setCrossing}
              key={index}
              index={index}
              char={char}
              setIsDowning={setIsDowning}
              isDowning={isDowning}
              charsRest={charsRest}
              setCharsRest={setCharsRest}
              setChars={setChars}
              chars={chars}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CircleCharacters;
