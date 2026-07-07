import React from "react";

function RecieverMessage({ image, message }) {
  let scroll = React.useRef(null);

  React.useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleImageScroll = () => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div className="flex justify-start mb-3 px-3">
      <div
        ref={scroll}
        className="
          flex flex-col
          max-w-[70%]
          bg-white
          text-gray-900
          rounded-2xl
          rounded-bl-sm
          overflow-hidden
          shadow-sm
          border border-gray-200
        "
      >
        {image && (
          <img
            src={image}
            alt="received attachment"
            className="
              w-full
              max-w-[280px]
              max-h-[320px]
              object-cover
            "
            onLoad={handleImageScroll}
          />
        )}

        {message?.message && (
          <p className="px-3 py-2 text-[15px] leading-5 break-words">
            {message.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default RecieverMessage;