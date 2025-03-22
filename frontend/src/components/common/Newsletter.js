// frontend/src/components/common/Newsletter.js
import React from 'react';

const Newsletter = () => {
  return (
    <>
      <iframe
        className="newsletter-iframe"
        src="https://gladstart.curated.co/embed?color1=f5efe7&color2=4a3520&color_bg_button=e67e22&color_border=f39c12&color_button=ffffff&color_links=6f4e37&color_terms=967259&title=Join+GladStart+%F0%9F%98%8A+"
        width="100%"
        height="310"
        frameBorder="0"
        scrolling="no"
        title="GladStart Newsletter"
      />
    </>
  );
};

export default Newsletter;