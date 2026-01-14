import React from "react";

const JoinUsButton = () => {
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
      <button className="
        flex items-center gap-2 
        bg-blue-600 text-white font-semibold 
        px-5 py-3 rounded-xl 
        border-2 border-black
        shadow-lg shadow-black/50
        transition-transform duration-300 
        hover:scale-105 hover:bg-blue-700
        group
        focus:outline-none
      ">
        {/* Arrow on the left with slide + bounce */}
        <span className="
          inline-block transform -rotate-45 
          transition-transform duration-300
          group-hover:translate-x-1 group-hover:-translate-y-1
          group-hover:animate-bounceArrow
        ">
          ➔
        </span>
        Join Us
      </button>

      {/* Tailwind custom animation */}
      <style jsx>{`
        @keyframes bounceArrow {
          0%, 100% { transform: translate(0, 0) rotate(-45deg); }
          50% { transform: translate(4px, -4px) rotate(-45deg); }
        }
        .animate-bounceArrow {
          animation: bounceArrow 0.4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default JoinUsButton;
