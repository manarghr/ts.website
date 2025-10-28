import Image from "next/image";
import "./AiHome.css";
import picture from "../assets/picture.png";
import { IoMdCheckmark } from "react-icons/io";

export default function AIHome() {
  return (
    <section className="ai-home">
      <div className="ai-container">
        <h1 className="ai-title">
          Real-Time AI Coaching That Perfects Every Move You Make
        </h1>
        <p className="ai-description">
          TrainSight tracks your posture in real time and gives instant feedback
          to help you move safely and train smarter.
        </p>

        <Image
          src={picture}
          alt="AI Coaching"
          className="ai_image"
          priority
        />

        {/* ✅ Correct single container for animated lines */}
        <div className="picture_content">
          <div className="picture_line">
            <IoMdCheckmark className="check_icon" />
            <p>Real-time posture correction</p>
          </div>

          <div className="picture_line">
            <IoMdCheckmark className="check_icon" />
            <p>AI-powered performance analysis</p>
          </div>

          <div className="picture_line">
            <IoMdCheckmark className="check_icon" />
            <p>Personalized training plans</p>
          </div>

          <div className="picture_line">
            <IoMdCheckmark className="check_icon" />
            <p>Injury prevention tips</p>
          </div>
        </div>
      </div>
    </section>
  );
}
