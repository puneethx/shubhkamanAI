import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './App.scss';
import Sun1 from "./assets/sun1.jpg";
import Sun2 from "./assets/sun2.jpg";
import Sun3 from "./assets/sun3.jpg";
import Sun4 from "./assets/sun4.jpg";
import Sun5 from "./assets/sun5.jpg";

const App = () => {
  // State variables
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [imageSource, setImageSource] = useState('template');
  const [textSource, setTextSource] = useState('own');
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [aiTextPrompt, setAiTextPrompt] = useState('');
  const [selectedTemplateImage, setSelectedTemplateImage] = useState('');
  const [userQuote, setUserQuote] = useState('');
  const [finalImage, setFinalImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Image sets based on time of day
  const imageSets = {
    morning: [
      Sun1,
      Sun2,
      Sun3,
      Sun4,
      Sun5
    ],
    night: [
      Sun5,
      Sun4,
      Sun3,
      Sun2,
      Sun1
    ],
    congratulations: [
      Sun1,
      Sun2,
      Sun3,
      Sun4,
      Sun5
    ]
  };

  useEffect(() => {
    setSelectedTemplateImage(imageSets[timeOfDay][0]);
  }, [timeOfDay]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validImageTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, WEBP, or SVG)');
        return;
      }

      // Check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setSelectedTemplateImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePost = () => {
    setFinalImage({
      image: selectedTemplateImage || 'AI Generated Image Placeholder',
      quote: userQuote
    });
  };

  const handleDownload = async () => {
    const postElement = document.querySelector('.post-preview');
    if (!postElement) return;

    try {
      const canvas = await html2canvas(postElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      const link = document.createElement('a');
      link.download = `${timeOfDay}-post.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating download:', error);
    }
  };

  return (
    <div className="app">
      <h1 className="title">ShubhkamanAI</h1>

      <div className="section">
        <h2>Select Greeting Type</h2>
        <div className="radio-group">
          <label className={`radio-label ${timeOfDay === 'morning' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="timeOfDay"
              value="morning"
              checked={timeOfDay === 'morning'}
              onChange={(e) => setTimeOfDay(e.target.value)}
            />
            Morning
          </label>
          <label className={`radio-label ${timeOfDay === 'night' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="timeOfDay"
              value="night"
              checked={timeOfDay === 'night'}
              onChange={(e) => setTimeOfDay(e.target.value)}
            />
            Night
          </label>
          <label className={`radio-label ${timeOfDay === 'congratulations' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="timeOfDay"
              value="congratulations"
              checked={timeOfDay === 'congratulations'}
              onChange={(e) => setTimeOfDay(e.target.value)}
            />
            Congratulations
          </label>
        </div>
      </div>

      <div className="section">
        <h2>Select Background Image Source</h2>
        <div className="radio-group">
          <label className={`radio-label ${imageSource === 'template' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="imageSource"
              value="template"
              checked={imageSource === 'template'}
              onChange={(e) => setImageSource(e.target.value)}
            />
            Template images
          </label>
          <label className={`radio-label ${imageSource === 'upload' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="imageSource"
              value="upload"
              checked={imageSource === 'upload'}
              onChange={(e) => setImageSource(e.target.value)}
            />
            Upload image
          </label>
          <label className={`radio-label ${imageSource === 'ai' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="imageSource"
              value="ai"
              checked={imageSource === 'ai'}
              onChange={(e) => setImageSource(e.target.value)}
            />
            Generate image by AI
          </label>
        </div>
        
        {imageSource === 'upload' && (
          <div className="upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
            {uploadedImage && (
              <div className="uploaded-preview">
                <img src={uploadedImage} alt="Uploaded preview" />
              </div>
            )}
          </div>
        )}

        {imageSource === 'ai' && (
          <div className="input-group">
            <input
              type="text"
              placeholder="Describe the image you want..."
              value={aiImagePrompt}
              onChange={(e) => setAiImagePrompt(e.target.value)}
              className="text-input"
            />
            <button className="generate-btn">Generate</button>
          </div>
        )}

        {imageSource === 'template' && (
          <div className="template-images">
            {imageSets[timeOfDay].map((img, index) => (
              <div
                key={index}
                className={`template-image ${selectedTemplateImage === img ? 'selected' : ''}`}
                onClick={() => setSelectedTemplateImage(img)}
              >
                <img src={img} alt={`Template ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h2>Select Quote Source</h2>
        <div className="radio-group">
          <label className={`radio-label ${textSource === 'own' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="textSource"
              value="own"
              checked={textSource === 'own'}
              onChange={(e) => setTextSource(e.target.value)}
            />
            Write by own
          </label>
          <label className={`radio-label ${textSource === 'ai' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="textSource"
              value="ai"
              checked={textSource === 'ai'}
              onChange={(e) => setTextSource(e.target.value)}
            />
            Generate text by AI
          </label>
        </div>

        {textSource === 'ai' && (
          <div className="input-group">
            <input
              type="text"
              placeholder="Describe the quote you want..."
              value={aiTextPrompt}
              onChange={(e) => setAiTextPrompt(e.target.value)}
              className="text-input"
            />
            <button className="generate-btn">Generate</button>
          </div>
        )}
      </div>

      <div className="section">
        <textarea
          placeholder="Enter your quote here..."
          value={userQuote}
          onChange={(e) => setUserQuote(e.target.value)}
          className="quote-input"
        />
      </div>

      <button className="generate-post-btn" onClick={handleGeneratePost}>
        Generate the Post
      </button>

      {finalImage && (
        <div className="final-post">
          <h2>Generated Post</h2>
          <div className="post-preview">
            <img src={finalImage.image} alt="Generated post" />
            <p className="post-quote">{finalImage.quote}</p>
          </div>
          <button className="download-btn" onClick={handleDownload}>
            Download Post
          </button>
        </div>
      )}
    </div>
  );
};

export default App;