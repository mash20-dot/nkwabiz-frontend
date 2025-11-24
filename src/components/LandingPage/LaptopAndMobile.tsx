import React from 'react';

const LaptopAndMobile = () => {
    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Desktop and Mobile Views Side by Side */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

                        {/* Desktop Screenshot */}
                        <div className="w-full lg:w-2/3">
                            <img
                                src="https://i.imgur.com/7L4i1AZ.png"
                                alt="NkwaBiz Desktop Dashboard"
                                className="w-full h-auto rounded-xl shadow-2xl"
                            />
                        </div>

                        {/* Mobile Screenshot */}
                        <div className="w-48 sm:w-56 md:w-64 lg:w-auto lg:flex-shrink-0">
                            <img
                                src="https://i.imgur.com/AOenLgX.png"
                                alt="NkwaBiz Mobile Dashboard"
                                className="w-full h-auto rounded-3xl shadow-2xl"
                            />
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default LaptopAndMobile;