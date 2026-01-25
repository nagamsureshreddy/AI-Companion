import React from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  // This will be populated with actual reviews later
  const testimonials = [
    {
      id: 1,
      text: "Amazing platform for book lovers!",
      author: "Reader"
    },
    {
      id: 2,
      text: "Creating books has never been easier!",
      author: "Author"
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="section-content">
        <h2 className="section-title">What others are saying about it</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;






