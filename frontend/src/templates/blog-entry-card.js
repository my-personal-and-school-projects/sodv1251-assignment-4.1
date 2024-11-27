const blogEntryCard = (blogEntry) => {
  return `
  <div class="event-card row w-75 m-auto py-3 my-3">
      <div class="col-4">
          <div class="event-image px-2">
              <img src="${blogEntry.img_url}" alt="event-image"></img>
          </div>
      </div>
      <div class="col-8">
          <div class="event-content">
              <h4 class="pb-3 fw-bold">${blogEntry.title}</h4>
              <p>${blogEntry.text}</p>
              <div class="pt-3 d-flex justify-content-between align-items-center">
                  <div class="">
                    <span class="fw-bold">Posted: </span>                 
                    <span>${blogEntry.published_date}</span>
                  </div>
                  <div>
                      <span class="category-box">${blogEntry.category}</span>
                  </div>  
                  <div>
                      <span class="fw-bold">Blogger: </span>
                      <span>${blogEntry.blogger_name}</span>
                  </div>
              </div>
          </div>
      </div>   
  </div>
  `;
};

export default blogEntryCard;
