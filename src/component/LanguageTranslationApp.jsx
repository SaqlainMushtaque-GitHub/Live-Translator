import React, { useRef, useState, useEffect } from "react";
import languages from "../language";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MicIcon from "@mui/icons-material/Mic";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"; // Import the swap icon
import VolumeUpIcon from "@mui/icons-material/VolumeUp"; // Import the volume icon
import { makeStyles } from "@mui/styles";
import LanguageSelector from "./LanguageSelector";
import "../App.css";

// Define your custom styles
const useStyles = makeStyles((theme) => ({
  container: {
    background:
      "linear-gradient(90deg, rgba(41,40,39,1) 0%, rgba(41,40,39,1) 100%)",
      display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
  },
}));

const LanguageTranslationApp = () => {
  const classes = useStyles();
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [translateText, setTranslateText] = useState("");
  const [fromLanguage, setFromLanguage] = useState("en");
  const [toLanguage, setToLanguage] = useState("en");
  const [charCount, setCharCount] = useState(0);
  const fromTextRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef(null);

  useEffect(() => {
    if (fromText.trim() === "") {
      // If the input is empty or contains only whitespace, don't make a translation request
      setTranslateText("");
    } else {
      const transLINK = `https://api.mymemory.translated.net/get?q=${fromText}!&langpair=${fromLanguage}|${toLanguage}`;
      fetch(transLINK)
        .then((response) => response.json())
        .then((data) => {
          if (data.responseData && data.responseData.translatedText) {
            setTranslateText(data.responseData.translatedText);
          } else {
            setTranslateText("");
          }
        });
    }
  }, [fromText, fromLanguage, toLanguage]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;

      recognition.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setFromText(transcript);
      };
    }
  }, []);
  const toggleListening = () => {
    if (recognition.current) {
      if (isListening) {
        recognition.current.stop();
      } else {
        recognition.current.start();
      }
      setIsListening(!isListening);
    }
  };
  const handleVoiceButtonClick = () => {
    toggleListening();
  };
  const handleInputChange = (e) => {
    const content = e.target.value;
    setFromText(content);
    setCharCount(content.length);
  };

  const handleFromVoiceClick = () => {
    const fromTalk = new SpeechSynthesisUtterance(fromText);
    fromTalk.lang = fromLanguage;
    speechSynthesis.speak(fromTalk);
  };
  const handleToVoiceClick = () => {
    const toTalk = new SpeechSynthesisUtterance(translateText);
    toTalk.lang = toLanguage;
    speechSynthesis.speak(toTalk);
  };
  const handleCopyClick = () => {
    navigator.clipboard.writeText(`${toText}`);
  };
  const handleExchangeLangClick = () => {
    const tempText = fromText;
    setFromText(translateText);
    setTranslateText(tempText);
    setTranslateText("");
    console.log("Before clearing toText:", toText);
    setToText("", () => {
      console.log("After clearing toText:", toText);
    });
    const tempLang = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(tempLang);

    fromTextRef.current.focus();
  };

  return (
    <main>
      <div className="border-container">
        <div className={classes.container}>
      <div className="groupy">
        <ul>
          <li>
            <LanguageSelector
              languages={languages}
              value={fromLanguage}
              onChange={(e) => setFromLanguage(e.target.value)}
            />
          </li>
          <li>
            {" "}
            <Tooltip title="Exchange Languages">
              <IconButton
                onClick={handleExchangeLangClick}
              >
                <SwapHorizIcon />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <LanguageSelector
              languages={languages}
              value={toLanguage}
              onChange={(e) => setToLanguage(e.target.value)}
            />
          </li>
        </ul>
      </div>
      <div className="wrapper">
        <div className="text-container">
          <textarea
            value={fromText}
            onChange={handleInputChange}
            ref={fromTextRef}
            placeholder="Enter text"
          ></textarea>
          <div className=" elem">
            <div>
            <Tooltip title="Voice">
              <IconButton
                className={`${isListening ? 'active-mic' : ''}`}
                onClick={handleVoiceButtonClick}
              >
                <MicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Speak">
              <IconButton
                onClick={handleFromVoiceClick}
              >
                <VolumeUpIcon />
              </IconButton>
            </Tooltip>
            </div>
            <div>
              <span className={classes.codeLength}>{`${charCount}/5,000`}</span>
            </div>
            </div>
          
        </div>
        <div className="middl-border"></div>
        <div className="text-container">
          <textarea
            value={translateText}
            placeholder="Translation"
            readOnly
          ></textarea>
          <div className="to-speak-icon">
            <Tooltip title="Speak">
              <IconButton
                onClick={handleToVoiceClick}
              >
                <VolumeUpIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy Translation">
              <IconButton onClick={handleCopyClick}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
      </div>
    </main>
  );
};

export default LanguageTranslationApp;
