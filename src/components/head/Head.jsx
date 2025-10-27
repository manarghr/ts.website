import "./Head.css";

export default function Head() {
  return (
    <div className="head-background">
      <div className="background">
        <video
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/videos.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Blurred translucent box */}
        <div className="overlay-box">
          <div className="overlays">
          <h1>TrainSight</h1>
          <p>See your form. <br />Master your movement.</p>
          <button className="get-started-button">Get started</button>
          </div>
         
        </div>
      </div>
    </div>
  );
}
