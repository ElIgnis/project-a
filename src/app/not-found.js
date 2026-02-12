export default function Custom404() {
    return (
        <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-5 relative overflow-hidden">
            <div className="relative text-center text-white max-w-fit animate-fade-in">
                {/* 404 Code */}
                <div className="text-9xl md:text-[200px] font-extrabold mb-6 animate-float drop-shadow-2xl">
                404
                </div>

                {/* Error Message */}
                <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                Oops! Page Not Found
                </h1>

                {/* Description */}
                <p className="md:text-xl text-lg mt-10 opacity-90 leading-relaxed">
                The page you're looking for seems to have wandered off into the digital wilderness. 
                </p>
                <p className="text-lg md:text-xl mb-10 opacity-90 leading-relaxed px-4">
                Let's get you back to familiar territory.
                </p>

                {/* Home Button */}
                <a
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 active:-translate-y-0 transition-all duration-300 hover:bg-gray-50"
                >
                <span className="text-xl">🏠</span>
                <span>Take Me Home</span>
                </a>
        </div>
      </div>
    );
}