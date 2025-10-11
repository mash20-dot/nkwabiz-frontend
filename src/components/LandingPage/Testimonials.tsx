import React from 'react';
import { Link } from 'react-router-dom';
const Testimonials = () => {
  const testimonials = [{
    content: 'NkwaBiz transformed how I manage my small grocery store. I can now track inventory, monitor sales, and make better business decisions with the analytics dashboard.',
    author: 'Grace Mensah',
    role: "Owner, Grace's Groceries",
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80'
  }, {
    content: "Since implementing NkwaBiz, I've reduced stockouts by 60% and increased my monthly revenue by tracking which products sell best. The interface is intuitive even for non-tech users.",
    author: 'Kwame Osei',
    role: 'Manager, Kwame General Store',
    image: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80'
  }, {
    content: 'As a new business owner, I needed something simple yet powerful to manage my shop. NkwaBiz provides exactly what I need without overwhelming me with complicated features.',
    author: 'Abena Dankwa',
    role: 'Proprietor, Abena Fashion House',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80'
  }];
  return <div id="testimonials" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            Testimonials
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Trusted by business owners
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            See what our customers have to say about how NkwaBiz has improved
            their business operations.
          </p>
        </div>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => <div key={index} className="flex flex-col bg-gray-50 rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-gray-500 italic">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={testimonial.image} alt={testimonial.author} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        <div className="mt-10 text-center">
          <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Read more success stories
          </Link>
        </div>
      </div>
    </div>;
};
export default Testimonials;