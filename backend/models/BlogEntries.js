class BlogEntry {
  constructor(
    title,
    blogger_name,
    text,
    category,
    published_date,
    updated,
    img_url
  ) {
    this.title = title;
    this.blogger_name = blogger_name;
    this.text = text;
    this.category = category;
    this.published_date = new Date(published_date); // Ensures it is a Date object
    this.updated = new Date(updated); // Ensures it is a Date object
    this.img_url = img_url;
  }

  getFormattedDate() {
    return this.published_date.toLocaleDateString(); // Returns formatted date
  }

  getSummary() {
    return this.text.split(" ").slice(0, 20).join(" ") + "..."; // Short summary of text
  }
}

export default BlogEntry;
