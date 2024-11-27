const blogEntryCard = (blogEntry) => {
  let date = new Date(blogEntry.published_date);

  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "2-digit",
      })
    : "No date available";

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
                    <span>${formattedDate}</span>
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
