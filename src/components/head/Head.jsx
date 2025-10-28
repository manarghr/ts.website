export default function Head() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/videos.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Glass Overlay Box */}
      <div
        className="relative h-screen w-1/2 bg-[#354F52]/65 text-white p-[20vh]"
        style={{
          clipPath: "polygon(0% 0%, 90% 0%, 60% 100%, 0% 100%)",
        }}
      >
        <div className="relative top-[10%] -left-[10vh]">
          <h1 className="text-[5rem] uppercase font-bold tracking-wide mb-4">
            TrainSight
          </h1>

          <p className="text-[2.2rem] leading-snug">
            See your form. <br /> Master your movement.
          </p>

          <button className="mt-6 px-8 py-3 text-base font-semibold text-white bg-[#354F52] rounded-md shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl active:translate-y-0 active:shadow-md">
            Get started
          </button>
        </div>
      </div>
    </section>
  );
}
